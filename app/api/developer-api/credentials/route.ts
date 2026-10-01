import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET() {
  const credentials = store.getDeveloperApiCredentials();
  return NextResponse.json({
    success: true,
    total: credentials.length,
    data: credentials,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.developerName) {
      return NextResponse.json(
        { success: false, error: 'Developer name is required' },
        { status: 400 }
      );
    }

    const created = store.createDeveloperApiCredential({
      developerId: body.developerId || `dev-${Date.now()}`,
      developerName: body.developerName,
      tier: body.tier || 'GRADE_A',
      apiKey: body.apiKey,
      apiSecret: body.apiSecret,
      webhookSecret: body.webhookSecret,
      status: body.status || 'ACTIVE',
      permissions: body.permissions || {
        canPushProjects: true,
        canPushInventoryStatus: true,
        canUpdatePricing: true,
        canSyncBhkLayouts: true,
      },
      outboundApiConfig: body.outboundApiConfig,
      inboundPushEndpoint: '/api/developer-api/push',
      ipWhitelist: body.ipWhitelist,
      rateLimitPerMin: body.rateLimitPerMin || 120,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create developer credential' },
      { status: 500 }
    );
  }
}
