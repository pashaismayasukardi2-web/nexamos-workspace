export interface Organization {
  id: string;
  name: string;
  slug: string;
  organization_type: string;
  status: string;
  role_code?: string;
  role_name?: string;
}

export interface Entitlement {
  id: string;
  app_code: string;
  app_name: string;
  domain: string;
  plan_code?: string;
  status: 'active' | 'trial' | 'suspended' | 'expired' | 'inactive' | 'revoked';
  valid_from?: string;
  valid_until?: string | null;
  org_id?: string | null;
  org_name?: string | null;
}

export interface IAMUser {
  id: string;
  identity_subject: string;
  display_name: string;
  email: string | null;
  email_verified: boolean;
  status: string;
  roles: string[];
  organizations: Organization[];
  entitlements: Entitlement[];
  created_at?: string;
}

export interface AuthSession {
  user: IAMUser;
  accessToken: string;
  idToken: string;
  expiresAt: number;
}

export interface OrgMember {
  membership_id: string;
  membership_status: 'active' | 'suspended' | 'removed';
  joined_at: string;
  user_id: string;
  display_name: string;
  user_status: string;
  email: string | null;
  role_code?: 'ORG_OWNER' | 'ORG_ADMIN' | 'ORG_MEMBER' | string;
  role_name?: string;
}

export interface AuditEvent {
  id: string;
  event_type: string;
  target_type: string | null;
  target_id: string | null;
  payload: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
