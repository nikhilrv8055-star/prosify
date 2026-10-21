import { NextRequest, NextResponse } from 'next/server';
import { AuthUser, UserRole, ROLE_PERMISSIONS } from '@/lib/auth/types';
import { createSessionToken, getSessionCookieOptions } from '@/lib/security/session';
import { recordAuditEvent } from '@/lib/security/auditLog';
import { queryD1, executeD1 } from '@/lib/db/d1';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';

const GOOGLE_CLIENT_ID =
  (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.trim()) ||
  '930588727231-3nqopkonmvjrlrne8o89hovs1imkg5hv.apps.googleusercontent.com';

const GOOGLE_CLIENT_SECRET =
  (process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_SECRET.trim()) ||
  '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';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state') || '/';

  // Determine redirect URL
  const origin = req.nextUrl.origin || 'https://www.prosify.in';
  const targetDestination = state.startsWith('/') ? `${origin}${state}` : origin;

  if (error || !code) {
    console.warn('[Google OAuth Callback Error]:', error || 'No code provided');
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(error || 'Google authorization cancelled')}`);
  }

  try {
    const callbackUri = `${origin}/api/auth/callback/google`;

    // 1. Exchange authorization code for tokens with Google OAuth API
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: callbackUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('[Google Token Exchange Failed]:', tokenData);
      return NextResponse.redirect(
        `${origin}/?auth_error=${encodeURIComponent(tokenData.error_description || 'Token exchange failed')}`
      );
    }

    // 2. Fetch User Profile from Google UserInfo endpoint
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileResponse.json();

    if (!profileResponse.ok || !profile.email) {
      return NextResponse.redirect(
        `${origin}/?auth_error=${encodeURIComponent('Failed to retrieve Google user profile')}`
      );
    }

    const cleanEmail = profile.email.toLowerCase().trim();
    const userName = profile.name || cleanEmail.split('@')[0];
    const userPicture = profile.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
    const googleId = profile.sub;

    const isAffiliateFlow = state.includes('affiliate');
    const assignedRole: UserRole = isAffiliateFlow ? 'AFFILIATE' : 'CUSTOMER';

    // 3. If affiliate flow, ensure affiliate record is created/retrieved
    if (isAffiliateFlow) {
      let affiliate = serverAffiliateDb.getAffiliateByEmail(cleanEmail);
      if (!affiliate) {
        const registered = serverAffiliateDb.registerAffiliate({
          name: userName,
          email: cleanEmail,
          isGoogle: true,
        });
        affiliate = registered.affiliate;
      }
    }

    // 4. Save to D1 edge database if available
    const userId = `usr_google_${googleId.slice(0, 10)}`;
    try {
      await executeD1(
        `INSERT OR IGNORE INTO users 
         (id, google_id, email, name, profile_picture, role, account_balance, commission_balance, available_balance, total_earned, total_withdrawn, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 0.00, 0.00, 0.00, 0.00, 0.00, CURRENT_TIMESTAMP)`,
        [userId, googleId, cleanEmail, userName, userPicture, assignedRole]
      );
    } catch (dbErr) {
      console.warn('[D1 Google Callback Sync]:', dbErr);
    }

    // 5. Create authenticated session token
    const authUser: AuthUser = {
      id: userId,
      name: userName,
      email: cleanEmail,
      role: assignedRole,
      avatarUrl: userPicture,
      permissions: ROLE_PERMISSIONS[assignedRole] || [],
    };

    const { token } = createSessionToken(authUser, 86400 * 30); // 30-day session

    // Record audit
    recordAuditEvent({
      actor: authUser,
      action: 'AUTH_GOOGLE_CALLBACK',
      resource: '/api/auth/callback/google',
      status: 'SUCCESS',
      details: `Google OAuth 2.0 code exchange successful for ${cleanEmail}`,
    });

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = getSessionCookieOptions(isProduction, 86400 * 30);

    const redirectRes = NextResponse.redirect(targetDestination);
    redirectRes.cookies.set('user_session', token, cookieOptions);
    redirectRes.cookies.set(cookieOptions.name, token, cookieOptions);

    if (isAffiliateFlow) {
      const affiliateSessionToken = Buffer.from(
        JSON.stringify({
          id: userId,
          email: cleanEmail,
          name: userName,
          role: 'AFFILIATE',
        })
      ).toString('base64');
      redirectRes.cookies.set('prosify_affiliate_session', affiliateSessionToken, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 86400 * 30,
      });
    }

    return redirectRes;
  } catch (err: any) {
    console.error('Fatal error in Google OAuth callback:', err);
    return NextResponse.redirect(
      `${origin}/?auth_error=${encodeURIComponent(err.message || 'Google authentication failed')}`
    );
  }
}

export async function POST(req: NextRequest) {
  // Pass through to GET handler or JSON verification
  return NextResponse.json({ success: true, message: 'Google OAuth callback active' });
}
