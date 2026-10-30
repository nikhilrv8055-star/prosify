import { NextRequest, NextResponse } from 'next/server';
import { getServerUser, requireAuth } from '@/lib/auth/serverAuth';
import { store } from '@/lib/data/store';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { recordAuditEvent } from '@/lib/security/auditLog';
import { z } from 'zod';
import { INITIAL_AFFILIATE_MEMBERS, INITIAL_AFFILIATE_PAYOUTS } from '@/lib/data/affiliateStore';
import { AffiliatePayoutRecord } from '@/lib/types';

// In-memory affiliate balances & payout request store
const affiliateBalances = new Map<string, { totalEarned: number; payableBalance: number; paidAmount: number }>();
const payoutRequests: AffiliatePayoutRecord[] = [...INITIAL_AFFILIATE_PAYOUTS];

// Seed initial balances from affiliate store
INITIAL_AFFILIATE_MEMBERS.forEach((m) => {
  affiliateBalances.set(m.id, {
    totalEarned: m.totalEarned,
    payableBalance: m.payableBalance,
    paidAmount: m.paidAmount,
  });
  if (m.referralCode) {
    affiliateBalances.set(m.referralCode.toUpperCase(), {
      totalEarned: m.totalEarned,
      payableBalance: m.payableBalance,
      paidAmount: m.paidAmount,
    });
  }
});

const withdrawSchema = z.object({
  amount: z.number().min(1000, 'Minimum withdrawal amount is ₹1,000'),
  payoutMethod: z.enum(['UPI', 'BANK_TRANSFER', 'NEFT_RTGS']),
  upiId: z.string().optional(),
  accountHolderName: z.string().min(2, 'Account holder name is required').optional(),
  accountNumber: z.string().min(8, 'Bank account number must be at least 8 digits').optional(),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format').optional(),
  bankName: z.string().optional(),
  notes: z.string().max(200).optional(),
});

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth.errorResponse) return auth.errorResponse;

  const user = auth.user;
  const userKey = user.partnerCode?.toUpperCase() || user.id;

  // Retrieve or initialize balance (starts clean at zero)
  let balance = affiliateBalances.get(userKey);
  if (!balance) {
    balance = { totalEarned: 0, payableBalance: 0, paidAmount: 0 };
    affiliateBalances.set(userKey, balance);
  }

  // Filter payouts for this user (or all if admin)
  const isPrivileged = ['SUPER_ADMIN', 'ADMIN', 'FINANCE'].includes(user.role);
  const userPayouts = isPrivileged
    ? payoutRequests
    : payoutRequests.filter(
        (p) => p.affiliateId === user.id || p.affiliateName.toLowerCase().includes(user.name.toLowerCase())
      );

  return NextResponse.json({
    success: true,
    data: {
      userId: user.id,
      name: user.name,
      partnerCode: user.partnerCode || 'AFFILIATE',
      ...balance,
      history: userPayouts.slice(0, 50),
    },
  });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate limiting (max 10 withdrawal requests per hour per IP)
  const rateLimitResponse = applyRateLimit(
    req,
    { limit: 10, windowMs: 60 * 60 * 1000 },
    'affiliate_withdraw'
  );
  if (rateLimitResponse) return rateLimitResponse;

  const auth = requireAuth(req);
  if (auth.errorResponse) return auth.errorResponse;

  const user = auth.user;
  const userKey = user.partnerCode?.toUpperCase() || user.id;

  try {
    const rawBody = await req.json();
    const parseResult = withdrawSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: parseResult.error.issues[0]?.message || 'Invalid withdrawal parameters',
          },
        },
        { status: 400 }
      );
    }

    const { amount, payoutMethod, upiId, accountHolderName, accountNumber, ifscCode, bankName, notes } =
      parseResult.data;

    // Validate method specifics
    if (payoutMethod === 'UPI' && !upiId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_UPI', message: 'UPI ID is required for UPI payout' } },
        { status: 400 }
      );
    }

    if ((payoutMethod === 'BANK_TRANSFER' || payoutMethod === 'NEFT_RTGS') && (!accountNumber || !ifscCode)) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_BANK_DETAILS', message: 'Account Number and IFSC Code are required' } },
        { status: 400 }
      );
    }

    // Check balance
    let balance = affiliateBalances.get(userKey);
    if (!balance) {
      balance = { totalEarned: 485000, payableBalance: 65000, paidAmount: 420000 };
      affiliateBalances.set(userKey, balance);
    }

    if (amount > balance.payableBalance) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INSUFFICIENT_FUNDS',
            message: `Requested amount ₹${amount.toLocaleString('en-IN')} exceeds available payable balance ₹${balance.payableBalance.toLocaleString('en-IN')}`,
          },
        },
        { status: 400 }
      );
    }

    // Deduct balance and create payout record
    balance.payableBalance -= amount;
    balance.paidAmount += amount;
    affiliateBalances.set(userKey, balance);

    const payoutId = `pay-${Date.now()}`;
    const recipientDetails =
      payoutMethod === 'UPI'
        ? `UPI: ${upiId}`
        : `${bankName || 'Bank'} A/C: ${accountNumber} (IFSC: ${ifscCode})`;

    const newPayout: AffiliatePayoutRecord = {
      id: payoutId,
      affiliateId: user.id,
      affiliateName: user.name,
      amount,
      payoutMethod,
      status: 'PENDING',
      recipientDetails,
      requestedAt: new Date().toISOString().split('T')[0],
      notes: notes || `Direct withdrawal requested by ${user.name}`,
    };

    payoutRequests.unshift(newPayout);

    // Audit logging
    recordAuditEvent({
      actor: user,
      action: 'AFFILIATE_WITHDRAWAL_REQUEST',
      resource: '/api/affiliate/withdraw',
      resourceId: payoutId,
      status: 'SUCCESS',
      details: `Withdrawal of ₹${amount} requested via ${payoutMethod}`,
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message: `Withdrawal request of ₹${amount.toLocaleString('en-IN')} submitted successfully. It will be verified and disbursed within 24 hours.`,
      payout: newPayout,
      balance,
    });
  } catch (err: unknown) {
    console.error('Error in /api/affiliate/withdraw:', err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while processing your withdrawal request.',
        },
      },
      { status: 500 }
    );
  }
}
