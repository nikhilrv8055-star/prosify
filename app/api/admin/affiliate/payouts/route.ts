import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';
import { NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const all = serverAffiliateDb.getPayouts();

    let filtered = all;
    if (status && status !== 'ALL') {
      filtered = all.filter((p) => p.status === status);
    }

    // Attach current affiliate available balance to each payout request for admin review
    const enriched = filtered.map((p) => {
      const affiliate = serverAffiliateDb.getAffiliateById(p.affiliateId);
      return {
        ...p,
        affiliateAvailableBalance: affiliate?.availableBalance || 0.0,
        affiliateTier: affiliate?.tier || 'Bronze',
        affiliatePhone: affiliate?.phone || '',
      };
    });

    const pendingCount = all.filter((p) => p.status === 'PENDING').length;

    return NextResponse.json(
      {
        success: true,
        count: enriched.length,
        pendingCount,
        payouts: enriched,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Error fetching payouts', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { payoutId, action, transactionRef, rejectionNote } = body;

    if (!payoutId || !action) {
      return createErrorResponse('BAD_REQUEST', 'payoutId and action (APPROVE | PROCESS | REJECT) are required.', 400);
    }

    if (action === 'PROCESS' && (!transactionRef || !transactionRef.trim())) {
      return createErrorResponse('BAD_REQUEST', 'Transaction reference (UTR / Bank Ref Number) is required to mark as processed.', 400);
    }

    const updatedPayout = serverAffiliateDb.adminProcessPayout({
      payoutId,
      action,
      transactionRef,
      rejectionNote,
    });

    // Get fresh affiliate profile to return updated balance
    const updatedAffiliate = serverAffiliateDb.getAffiliateById(updatedPayout.affiliateId);

    return NextResponse.json(
      {
        success: true,
        message:
          action === 'PROCESS'
            ? `Payout of ₹${updatedPayout.amount.toLocaleString('en-IN')} marked as Processed! Affiliate balance debited in real-time.`
            : action === 'APPROVE'
            ? `Payout request approved.`
            : `Payout request rejected.`,
        payout: updatedPayout,
        updatedAffiliateBalance: updatedAffiliate?.availableBalance,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('BAD_REQUEST', error.message || 'Error processing payout', 400);
  }
}
