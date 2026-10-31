import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export const runtime = 'edge';
export const AFFILIATE_COOKIE_NAME = 'prosify_affiliate_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, city, agencyName, panCard, reraNumber } = body;

    if (!name || !name.trim()) {
      return createErrorResponse('BAD_REQUEST', 'Full name is required.', 400);
    }

    if (!email || !email.trim()) {
      return createErrorResponse('BAD_REQUEST', 'Email address is required.', 400);
    }

    if (!password || password.length < 6) {
      return createErrorResponse('BAD_REQUEST', 'Password must be at least 6 characters long.', 400);
    }

    // 1. Cloudflare D1 Database Binding access karein
    let db: any = null;
    try {
      const { env } = getRequestContext();
      db = (env as any)?.DB;
    } catch (e) {
      console.warn('getRequestContext() fallback triggered');
    }

    if (!db && (process.env as any).DB) {
      db = (process.env as any).DB;
    }

    if (!db) {
      return createErrorResponse('INTERNAL_ERROR', 'Cloudflare D1 binding (DB) not found in runtime.', 500);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone?.trim() || '+91 98000 00000';
    const cleanCity = city?.trim() || 'Mumbai';
    const cleanAgency = agencyName?.trim() || 'Independent Partner';
    const cleanPan = panCard?.trim() || '';
    const cleanRera = reraNumber?.trim() || '';

    // 2. Check if email already exists in D1
    const existing = await db
      .prepare('SELECT id FROM affiliates WHERE LOWER(email) = ? LIMIT 1')
      .bind(cleanEmail)
      .first();

    if (existing) {
      return createErrorResponse('CONFLICT', 'An affiliate account with this email already exists.', 409);
    }

    // 3. Unique Referral Code aur ID generate karein
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referralCode = `PRO-${randomSuffix}`;
    const affiliateId = `aff_${Date.now()}_${randomSuffix}`;
    const verificationCode = String(Math.floor(100000 + Math.random() * 900000));

    // 4. Cloudflare D1 me direct INSERT statement run karein
    await db
      .prepare(`
        INSERT INTO affiliates (
          id, 
          user_name, 
          email, 
          phone, 
          password_hash, 
          city, 
          agency_name, 
          pan_card, 
          rera_number, 
          ref_code, 
          tier, 
          status, 
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Bronze (2.5%)', 'active', datetime('now'))
      `)
      .bind(
        affiliateId,
        cleanName,
        cleanEmail,
        cleanPhone,
        password.trim(),
        cleanCity,
        cleanAgency,
        cleanPan,
        cleanRera,
        referralCode
      )
      .run();

    const referralUrl = `https://prosify.in/?ref=${referralCode}`;

    const sessionPayload = {
      id: affiliateId,
      email: cleanEmail,
      name: cleanName,
      referralCode,
      role: 'AFFILIATE',
    };
    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    const affiliateData = {
      id: affiliateId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      city: cleanCity,
      agencyName: cleanAgency,
      panCard: cleanPan,
      reraNumber: cleanRera,
      referralCode,
      tier: 'Bronze (2.5%)',
      status: 'active',
      referralUrl,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: 'Affiliate account created successfully in D1 database!',
        affiliate: affiliateData,
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
    console.error('Affiliate D1 Signup Error:', error);
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Signup failed', 500);
  }
}
