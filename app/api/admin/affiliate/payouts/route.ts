import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status')?.toUpperCase() || 'ALL';

    let payouts = store.getAffiliatePayoutRequests();
    if (status !== 'ALL') {
      payouts = payouts.filter((p) => p.status === status);
    }

    return NextResponse.json({
      success: true,
      payouts,
      pendingCount: store.getAffiliatePayoutRequests().filter((p) => p.status === 'PENDING').length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error fetching payouts queue' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId, action, transactionRef, rejectionReason } = body;

    if (!requestId) {
      return NextResponse.json({ success: false, error: 'Payout request ID is required' }, { status: 400 });
    }

    if (action === 'APPROVE') {
      const ref = transactionRef?.trim() || `UTR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const success = store.approveAffiliatePayout(requestId, ref);

      if (!success) {
        return NextResponse.json({ success: false, error: 'Payout request not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Payout approved and marked PAID with reference: ${ref}`,
        transactionRef: ref,
      });
    } else if (action === 'REJECT') {
      const reason = rejectionReason?.trim() || 'Payout request rejected by compliance team.';
      const success = store.rejectAffiliatePayout(requestId, reason);

      if (!success) {
        return NextResponse.json({ success: false, error: 'Payout request not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Payout request rejected. Note dispatched to affiliate: "${reason}"`,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action. Must be APPROVE or REJECT' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error processing payout action' }, { status: 500 });
  }
}
