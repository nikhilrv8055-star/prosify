import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';

export const AFFILIATE_COOKIE_NAME = 'prosify_affiliate_session';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please enter your registered email and password.' },
        { status: 400 }
      );
    }

    const affiliate = serverAffiliateDb.getAffiliateByEmail(email);

    if (!affiliate) {
      return NextResponse.json(
        { success: false, error: 'No affiliate account found with this email address.' },
        { status: 401 }
      );
    }

    if (affiliate.status === 'SUSPENDED') {
      return NextResponse.json(
        { success: false, error: 'Your affiliate account has been suspended. Please contact partner support.' },
        { status: 403 }
      );
    }

    // Verify password
    if (affiliate.passwordHash !== password.trim()) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please verify your credentials.' },
        { status: 401 }
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
      message: `Welcome back, ${affiliate.name}!`,
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
      { success: false, error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
