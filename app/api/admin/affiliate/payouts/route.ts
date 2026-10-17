import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';

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

    return NextResponse.json({
      success: true,
      count: enriched.length,
      pendingCount,
      payouts: enriched,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { payoutId, action, transactionRef, rejectionNote } = body;

    if (!payoutId || !action) {
      return NextResponse.json(
        { success: false, error: 'payoutId and action (APPROVE | PROCESS | REJECT) are required.' },
        { status: 400 }
      );
    }

    if (action === 'PROCESS' && (!transactionRef || !transactionRef.trim())) {
      return NextResponse.json(
        { success: false, error: 'Transaction reference (UTR / Bank Ref Number) is required to mark as processed.' },
        { status: 400 }
      );
    }

    const updatedPayout = serverAffiliateDb.adminProcessPayout({
      payoutId,
      action,
      transactionRef,
      rejectionNote,
    });

    // Get fresh affiliate profile to return updated balance
    const updatedAffiliate = serverAffiliateDb.getAffiliateById(updatedPayout.affiliateId);

    return NextResponse.json({
      success: true,
      message:
        action === 'PROCESS'
          ? `Payout of ₹${updatedPayout.amount.toLocaleString('en-IN')} marked as Processed! Affiliate balance debited in real-time.`
          : action === 'APPROVE'
          ? `Payout request approved.`
          : `Payout request rejected.`,
      payout: updatedPayout,
      updatedAffiliateBalance: updatedAffiliate?.availableBalance,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing payout' },
      { status: 400 }
    );
  }
}
