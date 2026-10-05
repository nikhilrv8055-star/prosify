import { signHmac, verifyHmac, generateSecureToken } from './crypto';
import { AuthUser, UserRole, ROLE_PERMISSIONS } from '../auth/types';

/**
 * Enterprise Production Session & JWT Manager
 * Uses HMAC-SHA256 authenticated state tokens with expiration & session revocation.
 */

// In-memory revoked session set (for immediate invalidation upon logout)
const revokedSessionIds = new Set<string>();

const DEFAULT_SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'prosify_production_session_signing_secret_key_2026_hardened';

export interface SessionPayload {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  partnerCode?: string;
  developerId?: string;
  franchiseCode?: string;
  sid: string; // Unique session ID for rotation & revocation
  iat: number; // Issued at timestamp (seconds)
  exp: number; // Expires at timestamp (seconds)
}

/**
 * Creates a signed session token.
 * Default validity: 24 hours (86,400 seconds)
 */
export function createSessionToken(
  user: AuthUser,
  validitySeconds = 86400
): { token: string; payload: SessionPayload } {
  const now = Math.floor(Date.now() / 1000);
  const sid = generateSecureToken(16);

  const payload: SessionPayload = {
    uid: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    partnerCode: user.partnerCode,
    developerId: user.developerId,
    franchiseCode: user.franchiseCode,
    sid,
    iat: now,
    exp: now + validitySeconds,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signHmac(encodedPayload, DEFAULT_SESSION_SECRET);
  const token = `${encodedPayload}.${signature}`;

  return { token, payload };
}

/**
 * Verifies a signed session token and returns the decoded payload.
 * Returns null if token is tampered, expired, or revoked.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const isValid = verifyHmac(encodedPayload, signature, DEFAULT_SESSION_SECRET);
    if (!isValid) return null;

    const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const payload: SessionPayload = JSON.parse(payloadJson);

    // Expiration check
    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) {
      return null;
    }

    // Check if session has been revoked
    if (revokedSessionIds.has(payload.sid)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Revokes a session (used on logout).
 */
export function revokeSession(sid: string): void {
  if (sid) {
    revokedSessionIds.add(sid);
    // Auto-clean old sessions after 24 hours
    setTimeout(() => {
      revokedSessionIds.delete(sid);
    }, 86400 * 1000);
  }
}

/**
 * Converts a verified SessionPayload into a typed AuthUser with proper permissions.
 */
export function sessionPayloadToAuthUser(payload: SessionPayload): AuthUser {
  return {
    id: payload.uid,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    partnerCode: payload.partnerCode,
    developerId: payload.developerId,
    franchiseCode: payload.franchiseCode,
    permissions: ROLE_PERMISSIONS[payload.role] || [],
  };
}

/**
 * Standard cookie configuration for session tokens.
 */
export const SESSION_COOKIE_NAME = 'prosify_auth_token';

export function getSessionCookieOptions(isProduction: boolean, maxAgeSeconds = 86400) {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}
