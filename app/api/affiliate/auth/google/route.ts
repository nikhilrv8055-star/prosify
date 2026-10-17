import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';

export const AFFILIATE_COOKIE_NAME = 'prosify_affiliate_session';

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Google account email is required.' },
        { status: 400 }
      );
    }

    let affiliate = serverAffiliateDb.getAffiliateByEmail(email);

    if (!affiliate) {
      // Auto-provision brand new affiliate profile with 0.00 balances and unique tracking code
      const registered = serverAffiliateDb.registerAffiliate({
        name: name || email.split('@')[0],
        email,
        isGoogle: true,
      });
      affiliate = registered.affiliate;
    }

    if (affiliate.status === 'SUSPENDED') {
      return NextResponse.json(
        { success: false, error: 'Your affiliate account has been suspended. Please contact partner support.' },
        { status: 403 }
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

    const res = NextResponse.json({
      success: true,
      message: `Signed in with Google as ${affiliate.name}!`,
      affiliate: {
        ...affiliate,
        referralUrl,
      },
    });

    res.cookies.set(AFFILIATE_COOKIE_NAME, sessionToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Google OAuth failed' },
      { status: 500 }
    );
  }
}
