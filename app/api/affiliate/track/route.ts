import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

// In-memory IP rate limiter: max 15 clicks per IP per minute
const clickRateMap = new Map<string, { count: number; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { refCode, targetPath, selfEmail } = body;

    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const now = Date.now();

    // IP Throttling check
    const existingRate = clickRateMap.get(ip);
    if (existingRate && existingRate.expiresAt > now) {
      if (existingRate.count >= 15) {
        return NextResponse.json(
          {
            success: false,
            fraudBlocked: true,
            reason: 'Excessive referral click rate detected. Request throttled for fraud prevention.',
          },
          { status: 429 }
        );
      }
      existingRate.count += 1;
    } else {
      clickRateMap.set(ip, { count: 1, expiresAt: now + 60000 });
    }

    if (!refCode) {
      return NextResponse.json({ success: false, error: 'Referral code missing' }, { status: 400 });
    }

    const result = store.recordReferralClick({
      referralCode: refCode,
      ipAddress: ip,
      targetPath: targetPath || '/',
      selfEmail,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          fraudBlocked: true,
          reason: result.reason || 'Referral attribution blocked.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Referral click attributed successfully',
      refCode,
      totalClicks: result.totalClicks,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Tracking error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get('ref');

  if (ref) {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    store.recordReferralClick({ referralCode: ref, ipAddress: ip, targetPath: '/' });
  }

  return NextResponse.redirect(new URL('/', req.url));
}
