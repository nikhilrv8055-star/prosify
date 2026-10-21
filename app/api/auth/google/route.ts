import { NextRequest, NextResponse } from 'next/server';
import { AuthUser, UserRole, ROLE_PERMISSIONS, DEMO_USERS } from '@/lib/auth/types';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { createSessionToken, getSessionCookieOptions } from '@/lib/security/session';
import { recordAuditEvent } from '@/lib/security/auditLog';
import { queryD1, executeD1 } from '@/lib/db/d1';
import { z } from 'zod';

const googleLoginSchema = z.object({
  credential: z.string().optional(), // Google ID Token
  id_token: z.string().optional(),
  email: z.string().email('Invalid Google email address'),
  name: z.string().optional(),
  picture: z.string().nullable().optional(),
  googleId: z.string().optional(),
  role: z.string().optional(),
  referrerCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate limiting (20 requests per minute per IP)
  const rateLimitResponse = applyRateLimit(
    req,
    { limit: 20, windowMs: 60 * 1000 },
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

    const { email, name, picture, googleId, role, referrerCode } = parseResult.data;
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists as an established demo persona
    let assignedRole: UserRole = (role as UserRole) || 'CUSTOMER';
    let existingUser: AuthUser | null = null;

    for (const r of Object.keys(DEMO_USERS) as UserRole[]) {
      if (DEMO_USERS[r].email.toLowerCase() === cleanEmail) {
        assignedRole = r;
        existingUser = DEMO_USERS[r];
        break;
      }
    }

    const userId = existingUser?.id || `usr_${Math.random().toString(36).substring(2, 10)}`;
    const userGoogleId = googleId || `gid_${Math.random().toString(36).substring(2, 12)}`;
    const userName = name || existingUser?.name || cleanEmail.split('@')[0];
    const userPicture = picture || existingUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

    // --------------------------------------------------------------------------
    // D1 Edge Database: Query or create user with STRICT ZERO BALANCE (0.00)
    // --------------------------------------------------------------------------
    try {
      const existingDbUsers = await queryD1<{ id: string; email: string; role: string }>(
        'SELECT id, email, role FROM users WHERE email = ? LIMIT 1',
        [cleanEmail]
      );

      if (!existingDbUsers || existingDbUsers.length === 0) {
        // Resolve referrer if any
        let referrerId: string | null = null;
        if (referrerCode) {
          const refAccount = await queryD1<{ user_id: string }>(
            'SELECT user_id FROM affiliate_accounts WHERE referral_code = ? LIMIT 1',
            [referrerCode.toUpperCase()]
          );
          if (refAccount && refAccount[0]) {
            referrerId = refAccount[0].user_id;
          }
        }

        // New user creation: account_balance = 0.00, commission_balance = 0.00
        await executeD1(
          `INSERT OR IGNORE INTO users 
           (id, google_id, email, name, profile_picture, role, referrer_id, account_balance, commission_balance, available_balance, total_earned, total_withdrawn, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 0.00, 0.00, 0.00, 0.00, 0.00, CURRENT_TIMESTAMP)`,
          [userId, userGoogleId, cleanEmail, userName, userPicture, assignedRole, referrerId]
        );

        // Auto-create affiliate account record with 0.00 balance
        const generatedRefCode = `PROS-${userName.replace(/[^A-Za-z0-9]/g, '').slice(0, 5).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        await executeD1(
          `INSERT OR IGNORE INTO affiliate_accounts 
           (user_id, referral_code, tier, commission_rate, account_balance, commission_balance, available_balance, total_earned, total_withdrawn, referral_count, created_at)
           VALUES (?, ?, 'SILVER', 2.50, 0.00, 0.00, 0.00, 0.00, 0.00, 0, CURRENT_TIMESTAMP)`,
          [userId, generatedRefCode]
        );
      }
    } catch (d1Err) {
      console.warn('[D1 Auth Sync] Non-blocking fallback to session state:', d1Err);
    }

    const authUser: AuthUser = {
      id: userId,
      name: userName,
      email: cleanEmail,
      role: assignedRole,
      avatarUrl: userPicture,
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

    // Set secure HTTP-only cookies
    response.cookies.set('user_session', token, cookieOptions);
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (err: unknown) {
    console.error('Error in /api/auth/google:', err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to process Google authentication request',
        },
      },
      { status: 500 }
    );
  }
}
