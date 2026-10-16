import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET() {
  try {
    const settings = store.getAffiliateSettings();
    return NextResponse.json({
      success: true,
      settings: {
        cookieDurationDays: settings.cookieDurationDays || 60,
        defaultCommissionRate: settings.defaultCommissionRate || settings.defaultCommissionPercent || 2.5,
        leadRewardAmount: settings.leadRewardAmount || 250,
        siteVisitRewardAmount: settings.siteVisitRewardAmount || 1500,
        minimumPayoutAmount: settings.minimumPayoutAmount || 1000,
        autoApproveAffiliates: settings.autoApproveAffiliates ?? true,
        fraudThrottlingPerMinute: 15,
        selfReferralBlocked: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error fetching affiliate settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      cookieDurationDays,
      defaultCommissionRate,
      leadRewardAmount,
      siteVisitRewardAmount,
      minimumPayoutAmount,
      autoApproveAffiliates,
    } = body;

    const updated = store.updateAffiliateSettings({
      ...(cookieDurationDays !== undefined ? { cookieDurationDays: Number(cookieDurationDays) } : {}),
      ...(defaultCommissionRate !== undefined ? { defaultCommissionRate: Number(defaultCommissionRate), defaultCommissionPercent: Number(defaultCommissionRate) } : {}),
      ...(leadRewardAmount !== undefined ? { leadRewardAmount: Number(leadRewardAmount) } : {}),
      ...(siteVisitRewardAmount !== undefined ? { siteVisitRewardAmount: Number(siteVisitRewardAmount) } : {}),
      ...(minimumPayoutAmount !== undefined ? { minimumPayoutAmount: Number(minimumPayoutAmount) } : {}),
      ...(autoApproveAffiliates !== undefined ? { autoApproveAffiliates: Boolean(autoApproveAffiliates) } : {}),
    });

    return NextResponse.json({
      success: true,
      message: 'Affiliate commission rules and attribution engine configuration saved successfully!',
      settings: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error updating settings' }, { status: 500 });
  }
}
