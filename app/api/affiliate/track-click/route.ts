import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';

const ATTRIBUTION_COOKIE = 'prosify_partner_ref';
const AFFILIATE_REF_COOKIE = 'prosify_affiliate_ref';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { referralCode, targetPath, utmSource, utmMedium, utmCampaign } = body;

    if (!referralCode) {
      return NextResponse.json({ success: false, error: 'Referral code missing' }, { status: 400 });
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || undefined;

    const result = serverAffiliateDb.recordClick({
      referralCode,
      ipAddress: ip,
      userAgent,
      landingPage: targetPath || '/',
      utmSource,
      utmMedium,
      utmCampaign,
    });

    if (!result.success || !result.affiliate) {
      return NextResponse.json(
        { success: false, error: 'Invalid or suspended affiliate code' },
        { status: 404 }
      );
    }

    const res = NextResponse.json({
      success: true,
      message: 'Click successfully attributed to partner',
      affiliateName: result.affiliate.name,
      referralCode: result.affiliate.referralCode,
      totalClicks: result.affiliate.totalClicks,
    });

    // 30-Day Cookie Window
    const maxAge = 60 * 60 * 24 * 30; // 30 days in seconds
    res.cookies.set(ATTRIBUTION_COOKIE, result.affiliate.referralCode, {
      path: '/',
      maxAge,
      sameSite: 'lax',
      httpOnly: false,
    });
    res.cookies.set(AFFILIATE_REF_COOKIE, result.affiliate.referralCode, {
      path: '/',
      maxAge,
      sameSite: 'lax',
      httpOnly: false,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Tracking error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get('ref') || searchParams.get('partner');
  const target = searchParams.get('target') || '/';

  if (!ref) {
    return NextResponse.redirect(new URL(target, req.url));
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('cf-connecting-ip') ||
    '127.0.0.1';
  const userAgent = req.headers.get('user-agent') || undefined;

  const result = serverAffiliateDb.recordClick({
    referralCode: ref,
    ipAddress: ip,
    userAgent,
    landingPage: target,
  });

  const res = NextResponse.redirect(new URL(target, req.url));
  if (result.success && result.affiliate) {
    const maxAge = 60 * 60 * 24 * 30;
    res.cookies.set(ATTRIBUTION_COOKIE, result.affiliate.referralCode, {
      path: '/',
      maxAge,
      sameSite: 'lax',
      httpOnly: false,
    });
    res.cookies.set(AFFILIATE_REF_COOKIE, result.affiliate.referralCode, {
      path: '/',
      maxAge,
      sameSite: 'lax',
      httpOnly: false,
    });
  }
  return res;
}
