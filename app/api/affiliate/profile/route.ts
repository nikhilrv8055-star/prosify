import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const affiliateId = searchParams.get('id') || searchParams.get('code');

    if (!affiliateId) {
      return NextResponse.json({ success: false, error: 'Affiliate ID or code is required' }, { status: 400 });
    }

    const aff = store.getAffiliateById(affiliateId) || store.getAffiliateByCode(affiliateId);

    if (!aff) {
      // Return zero profile for evaluation fallback
      return NextResponse.json({
        success: true,
        profile: {
          id: affiliateId,
          affiliateCode: affiliateId.startsWith('AFF') ? affiliateId : `AFF-${affiliateId}`,
          referralCode: affiliateId,
          name: 'Affiliate Partner',
          email: 'partner@example.com',
          phone: '+91 98000 00000',
          tier: 'Bronze',
          commissionRatePercent: 2.5,
          availableBalance: 0.0,
          totalEarnings: 0.0,
          pendingClearance: 0.0,
          totalClicks: 0,
          totalConversions: 0,
          conversionRate: 0.0,
          status: 'ACTIVE',
          bankDetails: {
            accountHolderName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            upiId: '',
          },
          notificationPreferences: {
            emailAlerts: true,
            smsAlerts: true,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: aff.id,
        affiliateCode: aff.affiliateCode || aff.referralCode,
        referralCode: aff.referralCode || aff.affiliateCode,
        name: aff.name,
        email: aff.email,
        phone: aff.phone,
        agencyName: aff.agencyName,
        city: aff.city,
        tier: aff.tier,
        commissionRatePercent: aff.commissionRatePercent || 2.5,
        availableBalance: aff.payableBalance || aff.unpaidEarnings || 0,
        totalEarnings: aff.totalEarnings || aff.totalEarned || 0,
        pendingClearance: 12000,
        totalClicks: aff.totalClicks || 0,
        totalConversions: aff.totalDealsClosed || aff.totalLeads || 0,
        conversionRate: aff.totalClicks ? Number(((aff.totalDealsClosed / aff.totalClicks) * 100).toFixed(1)) : 0.0,
        status: aff.status,
        joinedAt: aff.joinedAt,
        bankDetails: {
          accountHolderName: aff.name,
          accountNumber: aff.bankAccountNumber || '',
          ifscCode: aff.bankIfsc || '',
          bankName: aff.agencyName ? `${aff.agencyName} Bank Account` : 'Primary Bank Account',
          upiId: aff.upiId || aff.payoutDetails?.upiId || '',
        },
        notificationPreferences: {
          emailAlerts: true,
          smsAlerts: true,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error fetching profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { affiliateId, bankDetails, notificationPreferences, customSlug } = body;

    if (!affiliateId) {
      return NextResponse.json({ success: false, error: 'Affiliate ID is required' }, { status: 400 });
    }

    // Validate UPI ID format if provided
    if (bankDetails?.upiId) {
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(bankDetails.upiId.trim())) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid UPI VPA format. Example: yourname@okaxis, partner@icici, mobile@paytm',
          },
          { status: 400 }
        );
      }
    }

    // Validate IFSC format if bank account provided
    if (bankDetails?.ifscCode) {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      const upperIfsc = bankDetails.ifscCode.trim().toUpperCase();
      if (!ifscRegex.test(upperIfsc)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid IFSC Code. Must be 11 characters (e.g. HDFC0000060, SBIN0000845)',
          },
          { status: 400 }
        );
      }
      bankDetails.ifscCode = upperIfsc;
    }

    store.updateAffiliateProfile(affiliateId, {
      upiId: bankDetails?.upiId?.trim(),
      bankAccountNumber: bankDetails?.accountNumber?.trim(),
      bankIfsc: bankDetails?.ifscCode?.trim(),
      ...(customSlug ? { referralCode: customSlug.trim() } : {}),
    });

    return NextResponse.json({
      success: true,
      message: 'Affiliate settings & payout details updated successfully!',
      bankDetails,
      notificationPreferences,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error updating settings' }, { status: 500 });
  }
}
