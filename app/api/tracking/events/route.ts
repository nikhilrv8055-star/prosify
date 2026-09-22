import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { partnerCode, code, targetPath, eventType, utmSource, utmMedium, utmCampaign } = body;

    let partner = undefined;
    let link = undefined;

    if (partnerCode || code) {
      const res = store.recordTrackingEvent(partnerCode || '', targetPath || '/', eventType || 'CLICK', code);
      partner = res.partner;
      link = res.link;
    }

    const effectivePartnerCode = partner ? partner.code : (partnerCode || null);

    const response = NextResponse.json({
      success: true,
      message: 'Tracking event recorded',
      attributedPartner: effectivePartnerCode,
      partner: partner
        ? {
            id: partner.id,
            code: partner.code,
            companyName: partner.companyName,
          }
        : null,
      link: link
        ? {
            id: link.id,
            code: link.code,
            targetUrl: link.targetUrl,
          }
        : null,
    });

    // Set 30-day attribution cookie if effectivePartnerCode provided
    if (effectivePartnerCode) {
      response.cookies.set('prosify_partner_ref', effectivePartnerCode, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30-day attribution window
        httpOnly: false, // Allow client scripts to verify partner attribution
        sameSite: 'lax',
      });
      // Also write legacy cookie for seamless transition
      response.cookies.set('swarna_partner_ref', effectivePartnerCode, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: false,
        sameSite: 'lax',
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'TRACKING_FAILED', message: 'Tracking failed' } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const partnerId = searchParams.get('partnerId') || undefined;
  const links = store.getTrackingLinks(partnerId);
  return NextResponse.json({ success: true, count: links.length, data: links });
}
