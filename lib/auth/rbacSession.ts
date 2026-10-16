/**
 * Multi-Tenant Session & Security Guard Utilities
 * 
 * Handles role-scoped session cookies, route verification,
 * and brute-force protection rate limiting.
 */

import { NextRequest, NextResponse } from 'next/server';
import { RbacUser, UserRole } from './rbacStore';

export const VENDOR_COOKIE_NAME = 'prosify_vendor_session';
export const AGENT_COOKIE_NAME = 'prosify_agent_session';
export const ADMIN_COOKIE_NAME = 'prosify_admin_session';

export interface SessionPayload {
  userId: string;
  secureId: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: string;
  issuedAt: number;
}

// In-memory rate limiting map: max 5 failed attempts per IP per 10 minutes
const loginRateLimitMap = new Map<string, { attempts: number; lockUntil: number }>();

export function checkBruteForceLimit(ip: string, portal: 'vendor' | 'agent'): { allowed: boolean; waitSeconds?: number } {
  const key = `${portal}_${ip}`;
  const now = Date.now();
  const record = loginRateLimitMap.get(key);

  if (!record) return { allowed: true };

  if (record.lockUntil > now) {
    const waitSeconds = Math.ceil((record.lockUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // Lock expired
  if (record.lockUntil <= now && record.attempts >= 5) {
    loginRateLimitMap.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string, portal: 'vendor' | 'agent'): void {
  const key = `${portal}_${ip}`;
  const record = loginRateLimitMap.get(key) || { attempts: 0, lockUntil: 0 };
  record.attempts += 1;

  if (record.attempts >= 5) {
    record.lockUntil = Date.now() + 10 * 60 * 1000; // 10 minutes lockout
  }

  loginRateLimitMap.set(key, record);
}

export function resetLoginAttempts(ip: string, portal: 'vendor' | 'agent'): void {
  const key = `${portal}_${ip}`;
  loginRateLimitMap.delete(key);
}

export function createSessionPayload(user: RbacUser): SessionPayload {
  return {
    userId: user.id,
    secureId: user.secureId,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    issuedAt: Date.now(),
  };
}

export function encodeSessionCookie(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function decodeSessionCookie(cookieValue?: string): SessionPayload | null {
  if (!cookieValue) return null;
  try {
    const json = Buffer.from(cookieValue, 'base64').toString('utf-8');
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest, role: 'VENDOR' | 'AGENT'): SessionPayload | null {
  const cookieName = role === 'VENDOR' ? VENDOR_COOKIE_NAME : AGENT_COOKIE_NAME;
  const cookie = req.cookies.get(cookieName)?.value;
  const session = decodeSessionCookie(cookie);

  if (!session) return null;
  if (session.role !== role && session.role !== 'ADMIN') return null;
  return session;
}
