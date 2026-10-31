import { NextRequest, NextResponse } from 'next/server';
import { NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export const dynamic = 'force-dynamic';
export const AFFILIATE_COOKIE_NAME = 'prosify_affiliate_session';

async function getD1(): Promise<any> {
  try {
    // 1. OpenNext runtime binding
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext({ async: true });
    if (ctx?.env?.DB) return ctx.env.DB;
  } catch (e) {
    // Fallback for direct edge worker context
  }

  if ((process.env as any)?.DB) return (process.env as any).DB;
  if ((globalThis as any)?.__cloudflare_context__?.env?.DB) {
    return (globalThis as any).__cloudflare_context__.env.DB;
  }
  if ((globalThis as any)?.DB) return (globalThis as any).DB;

  return null;
}

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

    const db = await getD1();
    if (!db) {
      console.error('CRITICAL: Cloudflare D1 binding DB is undefined');
      return createErrorResponse('INTERNAL_ERROR', 'Database binding not active. Check Cloudflare Pages D1 settings.', 500);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone?.trim() || '+91 98000 00000';
    const cleanCity = city?.trim() || 'Mumbai';
    const cleanAgency = agencyName?.trim() || 'Independent Partner';
    const cleanPan = panCard?.trim() || '';
    const cleanRera = reraNumber?.trim() || '';

    // Check duplicate
    const existing = await db
      .prepare('SELECT id FROM affiliates WHERE LOWER(email) = ? LIMIT 1')
      .bind(cleanEmail)
      .first();

    if (existing) {
      return createErrorResponse('CONFLICT', 'An affiliate account with this email already exists.', 409);
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referralCode = `PRO-${randomSuffix}`;
    const affiliateId = `aff_${Date.now()}_${randomSuffix}`;
    const defaultPassword = password?.trim() || 'prosify@123';

    await db
      .prepare(`
        INSERT INTO affiliates (
          id, user_name, email, phone, password_hash, city, agency_name, pan_card, rera_number, ref_code, tier, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Bronze (2.5%)', 'active')
      `)
      .bind(
        affiliateId,
        cleanName,
        cleanEmail,
        cleanPhone,
        defaultPassword,
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

    const response = NextResponse.json(
      {
        success: true,
        message: 'Affiliate registered successfully in D1 database!',
        affiliate: {
          id: affiliateId,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          city: cleanCity,
          agencyName: cleanAgency,
          referralCode,
          tier: 'Bronze (2.5%)',
          status: 'active',
          referralUrl,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );

    response.cookies.set(AFFILIATE_COOKIE_NAME, sessionToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    console.error('Affiliate Signup Error Details:', error);
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Signup failed', 500);
  }
}
