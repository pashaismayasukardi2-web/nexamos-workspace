import { getSession } from './auth';
import { AuditEvent, Entitlement, OrgMember } from '../types/auth';

const IDENTITY_API_URL =
  process.env.NEXT_PUBLIC_IDENTITY_API_URL || 'https://nexamos.cloud/identity-api/api/v1';

function getHeaders(): HeadersInit {
  const session = getSession();
  const token = session?.accessToken;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function updateProfile(displayName: string): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${IDENTITY_API_URL}/users/me`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ display_name: displayName }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Gagal memperbarui profil (${res.status})`);
  }
  return { success: true, message: data.message };
}

export async function getMyAuditEvents(): Promise<AuditEvent[]> {
  const res = await fetch(`${IDENTITY_API_URL}/users/me/audit-events`, {
    headers: getHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memuat riwayat aktivitas');
  }
  return data.data || [];
}

export async function revokeAllSessions(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${IDENTITY_API_URL}/users/me/sessions/revoke`, {
    method: 'POST',
    headers: getHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Gagal mencabut sesi pengguna');
  }
  return { success: true, message: data.message || 'Semua sesi berhasil dicabut' };
}

export async function getOrganizationMembers(orgId: string): Promise<OrgMember[]> {
  const res = await fetch(`${IDENTITY_API_URL}/organizations/${orgId}/members`, {
    headers: getHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memuat daftar member organisasi');
  }
  return data.data || [];
}

export async function addOrganizationMember(
  orgId: string,
  email: string,
  roleCode: string = 'ORG_MEMBER'
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${IDENTITY_API_URL}/organizations/${orgId}/members`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, role_code: roleCode }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Gagal menambahkan member ke organisasi');
  }
  return { success: true, message: data.message || 'Member berhasil diundang' };
}

export async function updateOrganizationMember(
  orgId: string,
  userId: string,
  payload: { status?: string; role_code?: string }
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${IDENTITY_API_URL}/organizations/${orgId}/members/${userId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memperbarui data member');
  }
  return { success: true, message: data.message || 'Member berhasil diperbarui' };
}

export async function removeOrganizationMember(
  orgId: string,
  userId: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${IDENTITY_API_URL}/organizations/${orgId}/members/${userId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Gagal menghapus member dari organisasi');
  }
  return { success: true, message: data.message || 'Member berhasil dikeluarkan' };
}

export async function updateOrganizationName(
  orgId: string,
  name: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${IDENTITY_API_URL}/organizations/${orgId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ name }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memperbarui nama organisasi');
  }
  return { success: true, message: data.message || 'Organisasi berhasil diperbarui' };
}

export async function getOrganizationEntitlements(orgId: string): Promise<Entitlement[]> {
  const res = await fetch(`${IDENTITY_API_URL}/organizations/${orgId}/entitlements`, {
    headers: getHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return [];
  }
  return data.data || [];
}

