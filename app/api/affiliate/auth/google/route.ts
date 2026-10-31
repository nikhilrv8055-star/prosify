import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';
import { NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export const AFFILIATE_COOKIE_NAME = 'prosify_affiliate_session';

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return createErrorResponse('BAD_REQUEST', 'Google account email is required.', 400);
    }

    let affiliate = serverAffiliateDb.getAffiliateByEmail(email);

    if (!affiliate) {
      // Auto-provision brand new real affiliate profile with 0.00 balances and unique tracking code
      const registered = serverAffiliateDb.registerAffiliate({
        name: name || email.split('@')[0],
        email,
        isGoogle: true,
      });
      affiliate = registered.affiliate;
    } else {
      // If logging in via Google, mark email as verified and persist
      affiliate.emailVerified = true;
      serverAffiliateDb.updateAffiliate(affiliate.id, { emailVerified: true });
    }

    // Synchronize to in-memory store so all panels instantly see the newly registered affiliate
    try {
      const { store } = await import('@/lib/data/store');
      store.registerAffiliate({
        name: affiliate.name,
        email: affiliate.email,
        phone: affiliate.phone || '+91 98000 00000',
        city: affiliate.city || 'Mumbai',
        agencyName: affiliate.agencyName || 'Independent Partner',
      });
      store.addAuditLog({
        action: 'AFFILIATE_GOOGLE_LOGIN',
        entity: 'AffiliateProfile',
        user: affiliate.email,
        details: { affiliateId: affiliate.id, referralCode: affiliate.referralCode },
      });
    } catch (storeErr) {
      console.warn('[Google Affiliate Sync Notice]:', storeErr);
    }

    if (affiliate.status === 'SUSPENDED') {
      return createErrorResponse(
        'BAD_REQUEST',
        'Your affiliate account has been suspended. Please contact partner support.',
        403
      );
    }

    const referralUrl = `https://prosify.in/?ref=${affiliate.referralCode}`;

    const sessionPayload = {
      id: affiliate.id,
      email: affiliate.email,
      name: affiliate.name,
      referralCode: affiliate.referralCode,
      role: 'AFFILIATE',
    };
    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    const res = NextResponse.json(
      {
        success: true,
        message: `Signed in with Google as ${affiliate.name}!`,
        affiliate: {
          ...affiliate,
          referralUrl,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );

    res.cookies.set(AFFILIATE_COOKIE_NAME, sessionToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (error: any) {
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Google OAuth failed', 500);
  }
}
