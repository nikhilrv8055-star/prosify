import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';

const ATTRIBUTION_COOKIE = 'prosify_partner_ref';
const AFFILIATE_REF_COOKIE = 'prosify_affiliate_ref';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      dealAmount,
      description,
      buyerName,
      buyerPhone,
    } = body;

    // Referral code from body or 30-day attribution cookie
    const referralCode =
      body.referralCode ||
      req.cookies.get(AFFILIATE_REF_COOKIE)?.value ||
      req.cookies.get(ATTRIBUTION_COOKIE)?.value;

    if (!orderId || !dealAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: orderId and dealAmount' },
        { status: 400 }
      );
    }

    if (!referralCode) {
      return NextResponse.json({
        success: true,
        attributed: false,
        message: 'No referral tracking code or attribution cookie present for this conversion',
      });
    }

    const commission = serverAffiliateDb.recordConversion({
      referralCode,
      orderId: String(orderId),
      dealAmount: Number(dealAmount),
      description: description || `Property Booking Order #${orderId}`,
      buyerName,
      buyerPhone,
    });

    if (!commission) {
      return NextResponse.json({
        success: true,
        attributed: false,
        message: `No active affiliate found for referral code ${referralCode}`,
      });
    }

    return NextResponse.json({
      success: true,
      attributed: true,
      message: `Conversion successfully attributed to ${referralCode}! Commission: ₹${commission.commissionAmount.toLocaleString('en-IN')}`,
      commission,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Conversion webhook processing error' },
      { status: 500 }
    );
  }
}
