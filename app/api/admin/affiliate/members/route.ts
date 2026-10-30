import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';
import { NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const all = serverAffiliateDb.getAllAffiliates(search, status);
    const total = all.length;
    const startIndex = (page - 1) * limit;
    const paginated = all.slice(startIndex, startIndex + limit);

    return NextResponse.json(
      {
        success: true,
        count: paginated.length,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
        affiliates: paginated,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Error querying affiliates', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      city,
      referralCode,
      tier,
      commissionRatePercent,
      upiId,
      bankAccount,
      ifsc,
      panCard,
      reraNumber,
    } = body;

    if (!name || !name.trim()) {
      return createErrorResponse('BAD_REQUEST', 'Affiliate name is required.', 400);
    }

    if (!email || !email.trim()) {
      return createErrorResponse('BAD_REQUEST', 'Affiliate email address is required.', 400);
    }

    const { affiliate, verificationCode } = serverAffiliateDb.registerAffiliate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '+91 98000 00000',
      city: city?.trim() || 'Mumbai',
      referralCode: referralCode?.trim() || undefined,
      tier: tier || 'Bronze',
      commissionRatePercent: commissionRatePercent ? Number(commissionRatePercent) : 2.5,
      panCard: panCard?.trim() || '',
      reraNumber: reraNumber?.trim() || '',
      bankDetails: {
        accountHolderName: name.trim(),
        accountNumber: bankAccount?.trim() || '',
        ifscCode: ifsc?.trim() || '',
        bankName: '',
        upiId: upiId?.trim() || '',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Real affiliate ${affiliate.name} (Code: ${affiliate.referralCode}) onboarded successfully!`,
        affiliate,
        verificationCode,
      },
      { status: 201, headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('BAD_REQUEST', error.message || 'Failed to onboard affiliate', 400);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;

    if (!id) {
      return createErrorResponse('BAD_REQUEST', 'Affiliate ID is required', 400);
    }

    if (action === 'toggle_status') {
      const updated = serverAffiliateDb.toggleStatus(id);
      if (!updated) {
        return createErrorResponse('NOT_FOUND', 'Affiliate not found', 404);
      }
      return NextResponse.json(
        {
          success: true,
          message: `Affiliate account is now ${updated.status}`,
          affiliate: updated,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    return createErrorResponse('BAD_REQUEST', 'Invalid action specified', 400);
  } catch (error: any) {
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Failed to update affiliate', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return createErrorResponse('BAD_REQUEST', 'Affiliate ID is required for deletion', 400);
    }

    const success = serverAffiliateDb.deleteAffiliate(id);
    if (!success) {
      return createErrorResponse('NOT_FOUND', 'Affiliate not found', 404);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Affiliate removed successfully',
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Failed to delete affiliate', 500);
  }
}
