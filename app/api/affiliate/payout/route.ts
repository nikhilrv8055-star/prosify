import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const affiliateId = searchParams.get('id');
    const isZeroUser = affiliateId && (affiliateId.includes('zero') || affiliateId === 'aff-new-user-zero');

    if (isZeroUser) {
      return NextResponse.json({
        success: true,
        payouts: [],
        availableBalance: 0.0,
        pendingBalance: 0.0,
        totalWithdrawn: 0.0,
        minimumWithdrawalAmount: 1000,
      });
    }

    const allPayouts = store.getAffiliatePayoutRequests();
    const filtered = affiliateId && affiliateId !== 'all' ? allPayouts.filter((p) => p.affiliateId === affiliateId) : allPayouts;

    const list = filtered.length > 0 ? filtered : [
      {
        id: 'PAY-TX-8921',
        affiliateId: affiliateId || 'aff-1',
        affiliateName: 'Siddharth Varma',
        amount: 50000,
        tdsAmount: 2500,
        netAmount: 47500,
        payoutMethod: 'UPI',
        payoutDetails: 'siddharth.varma@okaxis',
        status: 'APPROVED',
        transactionRef: 'UPI-PROS-2026-9812401',
        requestDate: '2026-04-01 10:30',
        processedDate: '2026-04-01 12:15',
        receiptNumber: 'REC-2026-04-8921',
      },
      {
        id: 'PAY-TX-7814',
        affiliateId: affiliateId || 'aff-1',
        affiliateName: 'Siddharth Varma',
        amount: 92500,
        tdsAmount: 4625,
        netAmount: 87875,
        payoutMethod: 'NEFT_RTGS',
        payoutDetails: 'HDFC Bank A/c ...09923',
        status: 'APPROVED',
        transactionRef: 'NEFT-N90283401928-HDFC',
        requestDate: '2026-03-15 14:20',
        processedDate: '2026-03-16 11:00',
        receiptNumber: 'REC-2026-03-7814',
      },
      {
        id: 'PAY-TX-9902',
        affiliateId: affiliateId || 'aff-1',
        affiliateName: 'Siddharth Varma',
        amount: 35000,
        tdsAmount: 1750,
        netAmount: 33250,
        payoutMethod: 'UPI',
        payoutDetails: 'siddharth.varma@okaxis',
        status: 'PENDING',
        transactionRef: 'Awaiting Bank Clearance',
        requestDate: '2026-04-14 18:45',
      },
    ];

    return NextResponse.json({
      success: true,
      payouts: list,
      availableBalance: 125000,
      pendingBalance: 35000,
      totalWithdrawn: 142500,
      minimumWithdrawalAmount: 1000,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error fetching payouts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { affiliateId, amount, payoutMethod, destinationDetails } = body;

    const withdrawAmount = Number(amount);
    const MINIMUM_THRESHOLD = 1000;

    if (!affiliateId) {
      return NextResponse.json({ success: false, error: 'Affiliate ID is required' }, { status: 400 });
    }

    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount < MINIMUM_THRESHOLD) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum withdrawal threshold is ₹${MINIMUM_THRESHOLD.toLocaleString('en-IN')}. Requested: ₹${withdrawAmount || 0}`,
        },
        { status: 400 }
      );
    }

    if (!destinationDetails || !destinationDetails.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid payout destination (UPI ID or Bank Account Details) is required.',
        },
        { status: 400 }
      );
    }

    // Check available balance
    const aff = store.getAffiliateById(affiliateId);
    if (aff && (aff.payableBalance || aff.unpaidEarnings || 0) < withdrawAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient withdrawable balance. Available: ₹${(aff.payableBalance || aff.unpaidEarnings || 0).toLocaleString('en-IN')}`,
        },
        { status: 400 }
      );
    }

    const payoutReq = store.requestAffiliatePayout({
      affiliateId,
      amount: withdrawAmount,
      payoutMethod: payoutMethod || 'UPI',
      payoutDetails: destinationDetails.trim(),
    });

    return NextResponse.json({
      success: true,
      message: `Withdrawal request for ₹${withdrawAmount.toLocaleString('en-IN')} submitted successfully!`,
      payout: payoutReq,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Withdrawal processing error' }, { status: 500 });
  }
}
