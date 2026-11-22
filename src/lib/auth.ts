import { AuthSession, IAMUser } from '../types/auth';

const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://nexamos.cloud/identity';
const REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'nexamos';
const CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'nexamos-workspace';
const IDENTITY_API_URL = process.env.NEXT_PUBLIC_IDENTITY_API_URL || 'https://nexamos.cloud/identity-api/api/v1';

const STORAGE_SESSION_KEY = 'nexamos_workspace_session';
const STORAGE_VERIFIER_KEY = 'nexamos_workspace_verifier';
const STORAGE_STATE_KEY = 'nexamos_workspace_state';
const STORAGE_RETURN_TO_KEY = 'nexamos_workspace_return_to';
const STORAGE_PRODUCT_INTENT_KEY = 'nexamos_workspace_product_intent';

/**
 * Phase 5 IAM — Strict Redirect Allowlist (AT-014 Compliance)
 * Hanya izinkan redirect ke origin resmi NexaMOS:
 * - nexamos.cloud/workspace*
 * - workspace.nexamos.cloud/*
 * - crm.nexamos.cloud/*
 * - studio.nexamos.cloud/*
 * - demo.nexamos.cloud/*
 * - superadmin.nexamos.cloud/*
 * Reject semua arbitrary external URL untuk mencegah open-redirect phishing.
 */
export function validateSafeReturnTo(rawUrl?: string | null): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // Izinkan relative path di bawah /workspace
  if (trimmed.startsWith('/workspace') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;

    const host = parsed.hostname.toLowerCase();
    const allowedHosts = new Set([
      'workspace.nexamos.cloud',
      'crm.nexamos.cloud',
      'studio.nexamos.cloud',
      'demo.nexamos.cloud',
      'superadmin.nexamos.cloud',
    ]);

    if (allowedHosts.has(host)) {
      return parsed.toString();
    }

    if (host === 'nexamos.cloud' && parsed.pathname.startsWith('/workspace')) {
      return parsed.toString();
    }

    return null;
  } catch {
    return null;
  }
}

export function resolveIntentRedirectUrl(
  productIntent?: string | null,
  returnTo?: string | null
): string | null {
  const safeReturn = validateSafeReturnTo(returnTo);
  if (safeReturn) return safeReturn;

  const intent = String(productIntent || '').trim().toUpperCase();
  if (intent === 'NEXAMOS_WEB_STUDIO') {
    return 'https://studio.nexamos.cloud';
  }
  if (intent === 'NEXAMOS_CRM') {
    return 'https://crm.nexamos.cloud/login?sso=1';
  }
  if (intent === 'NEXAMOS_ADMIN') {
    return 'https://superadmin.nexamos.cloud';
  }
  return null;
}

export function consumePostLoginRedirect(): string | null {
  if (typeof window === 'undefined') return null;
  const savedReturnTo =
    sessionStorage.getItem(STORAGE_RETURN_TO_KEY) ||
    localStorage.getItem(STORAGE_RETURN_TO_KEY);
  const savedIntent =
    sessionStorage.getItem(STORAGE_PRODUCT_INTENT_KEY) ||
    localStorage.getItem(STORAGE_PRODUCT_INTENT_KEY);

  sessionStorage.removeItem(STORAGE_RETURN_TO_KEY);
  sessionStorage.removeItem(STORAGE_PRODUCT_INTENT_KEY);
  localStorage.removeItem(STORAGE_RETURN_TO_KEY);
  localStorage.removeItem(STORAGE_PRODUCT_INTENT_KEY);

  return resolveIntentRedirectUrl(savedIntent, savedReturnTo);
}

export function getBasePath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname.startsWith('/workspace') ? '/workspace' : '';
}

// ── PKCE Helpers (Native Web Crypto API) ──────────────────────────

function generateRandomString(length: number = 64): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values).map((x) => possible[x % possible.length]).join('');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// ── Auth Service Public API ───────────────────────────────────────

export interface LoginOptions {
  action?: 'login' | 'register';
  productIntent?: string | null;
  returnTo?: string | null;
}

export async function login(options?: LoginOptions): Promise<void> {
  if (typeof window === 'undefined') return;

  const verifier = generateRandomString(96);
  const state = generateRandomString(32);
  const hashed = await sha256(verifier);
  const challenge = base64UrlEncode(hashed);

  sessionStorage.setItem(STORAGE_VERIFIER_KEY, verifier);
  sessionStorage.setItem(STORAGE_STATE_KEY, state);
  localStorage.setItem(STORAGE_VERIFIER_KEY, verifier);
  localStorage.setItem(STORAGE_STATE_KEY, state);

  // Simpan return_to yang lolos allowlist & product_intent (Phase 5 IAM)
  const safeReturnTo = validateSafeReturnTo(options?.returnTo);
  if (safeReturnTo) {
    sessionStorage.setItem(STORAGE_RETURN_TO_KEY, safeReturnTo);
    localStorage.setItem(STORAGE_RETURN_TO_KEY, safeReturnTo);
  } else {
    sessionStorage.removeItem(STORAGE_RETURN_TO_KEY);
    localStorage.removeItem(STORAGE_RETURN_TO_KEY);
  }

  if (options?.productIntent) {
    const cleanIntent = String(options.productIntent).trim().toUpperCase();
    sessionStorage.setItem(STORAGE_PRODUCT_INTENT_KEY, cleanIntent);
    localStorage.setItem(STORAGE_PRODUCT_INTENT_KEY, cleanIntent);
  } else {
    sessionStorage.removeItem(STORAGE_PRODUCT_INTENT_KEY);
    localStorage.removeItem(STORAGE_PRODUCT_INTENT_KEY);
  }

  const redirectUri = `${window.location.origin}${getBasePath()}/auth/callback`;

  const endpoint = options?.action === 'register' ? 'registrations' : 'auth';
  const authUrl = new URL(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/${endpoint}`);
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('code_challenge', challenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('state', state);

  window.location.href = authUrl.toString();
}

export async function handleCallback(code: string, state: string): Promise<AuthSession> {
  if (typeof window === 'undefined') throw new Error('Browser environment required');

  const savedState =
    sessionStorage.getItem(STORAGE_STATE_KEY) ||
    localStorage.getItem(STORAGE_STATE_KEY);
  const verifier =
    sessionStorage.getItem(STORAGE_VERIFIER_KEY) ||
    localStorage.getItem(STORAGE_VERIFIER_KEY);

  if (!savedState || savedState !== state) {
    const err = new Error('State validation failed. Sesi autentikasi tidak valid.') as Error & { code?: string };
    err.code = 'STATE_MISMATCH';
    throw err;
  }

  if (!verifier) {
    const err = new Error('Code verifier tidak ditemukan. Silakan login kembali.') as Error & { code?: string };
    err.code = 'VERIFIER_MISSING';
    throw err;
  }

  const redirectUri = `${window.location.origin}${getBasePath()}/auth/callback`;

  // Panggil server route /api/auth/token untuk token exchange bebas CORS
  const res = await fetch(`${getBasePath()}/api/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      verifier,
      redirectUri,
    }),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || `Gagal autentikasi (${res.status})`);
  }

  const { session } = await res.json();

  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  sessionStorage.removeItem(STORAGE_STATE_KEY);
  sessionStorage.removeItem(STORAGE_VERIFIER_KEY);
  localStorage.removeItem(STORAGE_STATE_KEY);
  localStorage.removeItem(STORAGE_VERIFIER_KEY);

  return session;
}

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;

    const session: AuthSession = JSON.parse(raw);
    if (Date.now() >= session.expiresAt) {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function updateUserSession(partialUser: Partial<IAMUser>): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const current = getSession();
  if (!current) return null;

  const updated: AuthSession = {
    ...current,
    user: {
      ...current.user,
      ...partialUser,
    },
  };

  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updated));
  return updated;
}

export function logout(): void {
  if (typeof window === 'undefined') return;

  const session = getSession();
  const idToken = session?.idToken;

  localStorage.removeItem(STORAGE_SESSION_KEY);
  sessionStorage.clear();

  const logoutUrl = new URL(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`);
  logoutUrl.searchParams.set('client_id', CLIENT_ID);
  logoutUrl.searchParams.set('post_logout_redirect_uri', `${window.location.origin}${getBasePath()}`);
  if (idToken) {
    logoutUrl.searchParams.set('id_token_hint', idToken);
  }

  window.location.href = logoutUrl.toString();
}

