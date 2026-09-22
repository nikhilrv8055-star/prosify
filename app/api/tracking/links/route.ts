import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const partnerId = searchParams.get('partnerId') || undefined;
  const links = store.getTrackingLinks(partnerId);
  return NextResponse.json({ success: true, count: links.length, data: links });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.partnerId || !body.targetUrl) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'partnerId and targetUrl are required' } },
        { status: 400 }
      );
    }

    const created = store.createTrackingLink({
      partnerId: body.partnerId,
      targetUrl: body.targetUrl,
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
      utmCampaign: body.utmCampaign,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create tracking link' } },
      { status: 500 }
    );
  }
}
