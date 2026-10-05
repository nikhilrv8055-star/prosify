import { NextRequest, NextResponse } from 'next/server';
import { AuthUser, UserRole, ROLE_PERMISSIONS, DEMO_USERS } from '@/lib/auth/types';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { createSessionToken, getSessionCookieOptions } from '@/lib/security/session';
import { recordAuditEvent } from '@/lib/security/auditLog';
import { z } from 'zod';

const googleLoginSchema = z.object({
  credential: z.string().optional(), // Google ID Token
  email: z.string().email('Invalid Google email address'),
  name: z.string().optional(),
  picture: z.string().url().optional().or(z.literal('')),
  role: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate limiting (15 requests per minute per IP)
  const rateLimitResponse = applyRateLimit(
    req,
    { limit: 15, windowMs: 60 * 1000 },
    'auth_google'
  );
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawBody = await req.json();
    const parseResult = googleLoginSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: parseResult.error.issues[0]?.message || 'Invalid Google authentication payload',
          },
        },
        { status: 400 }
      );
    }

    const { email, name, picture, role } = parseResult.data;
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists as an established persona
    let assignedRole: UserRole = (role as UserRole) || 'CUSTOMER';
    let existingUser: AuthUser | null = null;

    for (const r of Object.keys(DEMO_USERS) as UserRole[]) {
      if (DEMO_USERS[r].email.toLowerCase() === cleanEmail) {
        assignedRole = r;
        existingUser = DEMO_USERS[r];
        break;
      }
    }

    const authUser: AuthUser = {
      id: existingUser?.id || `user_google_${Math.random().toString(36).substring(2, 9)}`,
      name: name || existingUser?.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: assignedRole,
      avatarUrl: picture || existingUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      partnerCode: assignedRole === 'CHANNEL_PARTNER' ? existingUser?.partnerCode || `CP-${cleanEmail.slice(0, 4).toUpperCase()}` : undefined,
      permissions: ROLE_PERMISSIONS[assignedRole] || [],
    };

    // Generate signed session token
    const { token } = createSessionToken(authUser, 86400);

    // Record audit event
    recordAuditEvent({
      actor: authUser,
      action: 'AUTH_GOOGLE_LOGIN',
      resource: '/api/auth/google',
      status: 'SUCCESS',
      details: `Google Single Sign-On authenticated: ${cleanEmail}`,
      ipAddress: ip,
    });

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = getSessionCookieOptions(isProduction, 86400);

    const response = NextResponse.json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: authUser,
    });

    // Set secure HTTP-only cookie
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (err: unknown) {
    console.error('Error in /api/auth/google:', err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GOOGLE_AUTH_FAILED',
          message: 'Unable to authenticate with Google. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}
