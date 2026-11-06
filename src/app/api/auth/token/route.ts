import { NextRequest, NextResponse } from 'next/server';

const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://nexamos.cloud/identity';
const REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'nexamos';
const CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'nexamos-workspace';
const IDENTITY_API_URL = process.env.NEXT_PUBLIC_IDENTITY_API_URL || 'https://nexamos.cloud/identity-api/api/v1';

export async function POST(req: NextRequest) {
  try {
    const { code, verifier, redirectUri } = await req.json();

    if (!code || !verifier || !redirectUri) {
      return NextResponse.json(
        { error: 'Missing code, verifier, or redirectUri' },
        { status: 400 }
      );
    }

    // 1. Tukar Code dengan Access Token (Server-to-Server, Bebas CORS)
    const tokenEndpoint = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;
    const bodyParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    });

    const tokenRes = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyParams.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return NextResponse.json(
        { error: `Keycloak token error: ${errText}` },
        { status: tokenRes.status }
      );
    }

    const tokenData = await tokenRes.json();
    const { access_token, id_token, expires_in } = tokenData;

    // 2. Decode ID token & Access token payload
    let idPayload: any = {};
    let accessPayload: any = {};
    try {
      if (id_token) {
        const parts = id_token.split('.');
        if (parts.length === 3) {
          idPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        }
      }
      if (access_token) {
        const parts = access_token.split('.');
        if (parts.length === 3) {
          accessPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        }
      }
    } catch (e) {
      console.warn('Gagal decode token payload di server:', e);
    }

    // 3. Ambil data profil dari NexaMOS Identity API
    let userMe: any = null;
    const meRes = await fetch(`${IDENTITY_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (meRes.ok) {
      const meJson = await meRes.json();
      userMe = meJson.data;
    } else if (meRes.status === 403) {
      // Auto-provisioning jika user baru
      const provRes = await fetch(`${IDENTITY_API_URL}/users/provision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity_subject: idPayload.sub || '',
          display_name: idPayload.name || idPayload.preferred_username || 'Pengguna NexaMOS',
          email: idPayload.email || `${idPayload.preferred_username || 'user'}@nexamos.local`,
        }),
      });

      if (provRes.ok) {
        const retryMe = await fetch(`${IDENTITY_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (retryMe.ok) {
          const retryJson = await retryMe.json();
          userMe = retryJson.data;
        }
      }
    }

    // 4. Ambil organisasi & entitlements
    let organizations: any[] = [];
    let entitlements: any[] = [];

    try {
      const [orgsRes, entsRes] = await Promise.all([
        fetch(`${IDENTITY_API_URL}/users/me/organizations`, {
          headers: { Authorization: `Bearer ${access_token}` },
        }),
        fetch(`${IDENTITY_API_URL}/users/me/products`, {
          headers: { Authorization: `Bearer ${access_token}` },
        }),
      ]);

      if (orgsRes.ok) {
        const orgsJson = await orgsRes.json();
        organizations = orgsJson.data || [];
      }

      if (entsRes.ok) {
        const entsJson = await entsRes.json();
        entitlements = entsJson.data || [];
      }
    } catch (err) {
      console.warn('Gagal memuat detail org/entitlement:', err);
    }

    // 5. Susun Session Resmi
    const rawRoles: string[] = [
      ...(idPayload.realm_access?.roles || []),
      ...(accessPayload.realm_access?.roles || []),
      ...(idPayload.resource_access?.[CLIENT_ID]?.roles || []),
      ...(accessPayload.resource_access?.[CLIENT_ID]?.roles || []),
    ];
    const uniqueRoles = Array.from(new Set(rawRoles));

    const session = {
      user: {
        id: userMe?.id || idPayload.sub || '',
        identity_subject: idPayload.sub || '',
        display_name: userMe?.display_name || idPayload.name || idPayload.preferred_username || 'Pengguna NexaMOS',
        email: userMe?.email || idPayload.email || null,
        email_verified: Boolean(userMe?.email_verified ?? idPayload.email_verified),
        status: userMe?.status || 'active',
        roles: uniqueRoles,
        organizations,
        entitlements,
      },
      accessToken: access_token,
      idToken: id_token,
      expiresAt: Date.now() + (expires_in || 900) * 1000,
    };

    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    console.error('Server Token Route Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error during token exchange' },
      { status: 500 }
    );
  }
}

