import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';
import { NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export const AFFILIATE_COOKIE_NAME = 'prosify_affiliate_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, city, agencyName, panCard, reraNumber, bankDetails } = body;

    if (!name || !name.trim()) {
      return createErrorResponse('BAD_REQUEST', 'Full name is required.', 400);
    }

    if (!email || !email.trim()) {
      return createErrorResponse('BAD_REQUEST', 'Email address is required.', 400);
    }

    if (!password || password.length < 6) {
      return createErrorResponse('BAD_REQUEST', 'Password must be at least 6 characters long.', 400);
    }

    // Register real affiliate with unique tracking code and default 0.00 balances
    const { affiliate, verificationCode } = serverAffiliateDb.registerAffiliate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '+91 98000 00000',
      password: password.trim(),
      city: city?.trim() || 'Mumbai',
      agencyName: agencyName?.trim() || 'Independent Partner',
      panCard: panCard?.trim() || '',
      reraNumber: reraNumber?.trim() || '',
      isGoogle: false,
      bankDetails: bankDetails || undefined,
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

    const response = NextResponse.json(
      {
        success: true,
        message: 'Affiliate account created successfully! Your profile is registered and live.',
        affiliate: {
          ...affiliate,
          referralUrl,
        },
        verificationCode,
      },
      { headers: NO_CACHE_HEADERS }
    );

    response.cookies.set(AFFILIATE_COOKIE_NAME, sessionToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    return createErrorResponse('BAD_REQUEST', error.message || 'Signup failed', 400);
  }
}
