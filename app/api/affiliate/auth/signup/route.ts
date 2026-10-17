import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';

export const AFFILIATE_COOKIE_NAME = 'prosify_affiliate_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, email address, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Register partner with unique tracking code and 0.00 balances
    const { affiliate, verificationCode } = serverAffiliateDb.registerAffiliate({
      name,
      email,
      phone,
      password,
      isGoogle: false,
    });

    const referralUrl = `https://prosify.in/?ref=${affiliate.referralCode}`;

    const sessionPayload = {
      id: affiliate.id,
      email: affiliate.email,
      name: affiliate.name,
      referralCode: affiliate.referralCode,
      role: 'AFFILIATE',
    };
    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    const response = NextResponse.json({
      success: true,
      message: 'Affiliate account created successfully! Please verify your email.',
      affiliate: {
        ...affiliate,
        referralUrl,
      },
      verificationCode, // For verification step display
    });

    response.cookies.set(AFFILIATE_COOKIE_NAME, sessionToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Signup failed' },
      { status: 400 }
    );
  }
}
