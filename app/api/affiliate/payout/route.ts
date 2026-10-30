import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';
import { NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const affiliateId = searchParams.get('id');

    if (!affiliateId || affiliateId === 'all') {
      const allPayouts = serverAffiliateDb.getPayouts();
      return NextResponse.json(
        {
          success: true,
          payouts: allPayouts,
          availableBalance: 0.0,
          pendingBalance: 0.0,
          totalWithdrawn: 0.0,
          minimumWithdrawalAmount: 1000,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    const affiliate = serverAffiliateDb.getAffiliateById(affiliateId);
    const payouts = serverAffiliateDb.getPayouts(affiliateId);

    return NextResponse.json(
      {
        success: true,
        payouts,
        availableBalance: affiliate?.availableBalance || 0.0,
        pendingBalance: affiliate?.pendingBalance || 0.0,
        totalWithdrawn: Math.max(0, (affiliate?.lifetimeEarnings || 0) - (affiliate?.availableBalance || 0)),
        minimumWithdrawalAmount: 1000,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Error fetching payouts', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { affiliateId, amount, payoutMethod, destinationDetails } = body;

    const withdrawAmount = Number(amount);
    const MINIMUM_THRESHOLD = 1000;

    if (!affiliateId) {
      return createErrorResponse('BAD_REQUEST', 'Affiliate ID is required', 400);
    }

    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount < MINIMUM_THRESHOLD) {
      return createErrorResponse(
        'BAD_REQUEST',
        `Minimum withdrawal threshold is ₹${MINIMUM_THRESHOLD.toLocaleString('en-IN')}. Requested: ₹${withdrawAmount || 0}`,
        400
      );
    }

    const affiliate = serverAffiliateDb.getAffiliateById(affiliateId);
    if (!affiliate) {
      return createErrorResponse('NOT_FOUND', 'Affiliate account not found', 404);
    }

    if (affiliate.availableBalance < withdrawAmount) {
      return createErrorResponse(
        'BAD_REQUEST',
        `Insufficient available balance. You have ₹${affiliate.availableBalance.toLocaleString('en-IN')} available.`,
        400
      );
    }

    const payout = serverAffiliateDb.requestPayout({
      affiliateId,
      amount: withdrawAmount,
      payoutMethod: (payoutMethod as any) || 'UPI',
      payoutDetails: destinationDetails || affiliate.bankDetails.upiId || 'Direct Bank/UPI',
    });

    return NextResponse.json(
      {
        success: true,
        message: `Payout request for ₹${withdrawAmount.toLocaleString('en-IN')} submitted successfully!`,
        payout,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('BAD_REQUEST', error.message || 'Error creating payout request', 400);
  }
}
