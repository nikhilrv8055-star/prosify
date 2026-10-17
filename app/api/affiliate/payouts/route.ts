import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';

export const AFFILIATE_COOKIE_NAME = 'prosify_affiliate_session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let affiliateId = searchParams.get('id');

    if (!affiliateId) {
      const cookie = req.cookies.get(AFFILIATE_COOKIE_NAME)?.value;
      if (cookie) {
        try {
          const decoded = JSON.parse(Buffer.from(cookie, 'base64').toString('utf-8'));
          affiliateId = decoded.id;
        } catch {}
      }
    }

    if (!affiliateId) {
      return NextResponse.json(
        { success: false, error: 'Affiliate authentication required' },
        { status: 401 }
      );
    }

    const payouts = serverAffiliateDb.getPayouts(affiliateId);
    const affiliate = serverAffiliateDb.getAffiliateById(affiliateId);

    return NextResponse.json({
      success: true,
      payouts,
      availableBalance: affiliate?.availableBalance || 0.0,
      pendingBalance: affiliate?.pendingBalance || 0.0,
      lifetimeEarnings: affiliate?.lifetimeEarnings || 0.0,
      minimumWithdrawalAmount: 1000,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { affiliateId } = body;
    const { amount, payoutMethod, payoutDetails } = body;

    if (!affiliateId) {
      const cookie = req.cookies.get(AFFILIATE_COOKIE_NAME)?.value;
      if (cookie) {
        try {
          const decoded = JSON.parse(Buffer.from(cookie, 'base64').toString('utf-8'));
          affiliateId = decoded.id;
        } catch {}
      }
    }

    if (!affiliateId) {
      return NextResponse.json(
        { success: false, error: 'Affiliate authentication required to request payouts.' },
        { status: 401 }
      );
    }

    const requestedAmount = Number(amount);
    if (!requestedAmount || isNaN(requestedAmount) || requestedAmount < 1000) {
      return NextResponse.json(
        { success: false, error: 'Minimum withdrawal amount is ₹1,000.00' },
        { status: 400 }
      );
    }

    if (!payoutDetails || !payoutDetails.trim()) {
      return NextResponse.json(
        { success: false, error: 'Valid payout details (UPI ID or Bank Account Details) are required.' },
        { status: 400 }
      );
    }

    const payout = serverAffiliateDb.requestPayout({
      affiliateId,
      amount: requestedAmount,
      payoutMethod: payoutMethod || 'UPI',
      payoutDetails: payoutDetails.trim(),
    });

    return NextResponse.json({
      success: true,
      message: `Withdrawal request for ₹${requestedAmount.toLocaleString('en-IN')} submitted successfully!`,
      payout,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit withdrawal request' },
      { status: 400 }
    );
  }
}
