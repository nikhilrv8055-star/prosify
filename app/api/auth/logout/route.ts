import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth/serverAuth';
import { verifySessionToken, revokeSession, SESSION_COOKIE_NAME, getSessionCookieOptions } from '@/lib/security/session';
import { recordAuditEvent } from '@/lib/security/auditLog';
import { getClientIp } from '@/lib/security/rateLimit';

export async function POST(req: NextRequest) {
  const user = getServerUser(req);
  const ip = getClientIp(req);

  // Invalidate signed session if present
  const signedCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authHeader = req.headers.get('authorization');
  const token = signedCookie || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

  if (token) {
    const payload = verifySessionToken(token);
    if (payload?.sid) {
      revokeSession(payload.sid);
    }
  }

  if (user) {
    recordAuditEvent({
      actor: user,
      action: 'AUTH_LOGOUT',
      resource: '/api/auth/logout',
      status: 'SUCCESS',
      details: 'User logged out and session revoked',
      ipAddress: ip,
    });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = getSessionCookieOptions(isProduction, 0); // expire immediately

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  // Clear HTTP-only session cookie
  response.cookies.set(cookieOptions.name, '', { ...cookieOptions, maxAge: 0 });
  response.cookies.set('prosify_auth_user', '', { path: '/', maxAge: 0 });

  return response;
}
