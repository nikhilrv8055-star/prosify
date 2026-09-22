import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { getServerUser, requireRole } from '@/lib/auth/serverAuth';
import { applyRateLimit } from '@/lib/security/rateLimit';

export async function GET(req: NextRequest) {
  const rateLimitResponse = applyRateLimit(req, { limit: 100, windowMs: 60 * 1000 }, 'commissions_get');
  if (rateLimitResponse) return rateLimitResponse;

  const user = getServerUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  let partnerId = searchParams.get('partnerId') || undefined;

  // Channel Partner can only see their own payouts
  if (user.role === 'CHANNEL_PARTNER') {
    const partner = user.partnerCode ? store.getPartnerByCode(user.partnerCode) : null;
    partnerId = partner?.id || 'NO_ACCESS';
  }

  const commissions = store.getCommissions(partnerId);
  return NextResponse.json({ success: true, count: commissions.length, data: commissions });
}

export async function PATCH(req: NextRequest) {
  const rateLimitResponse = applyRateLimit(req, { limit: 60, windowMs: 60 * 1000 }, 'commissions_patch');
  if (rateLimitResponse) return rateLimitResponse;

  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  try {
    const body = await req.json();
    const { id, status, utrNumber } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'id and status are required' } },
        { status: 400 }
      );
    }

    const updated = store.updateCommissionStatus(id, status, utrNumber);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Commission not found' } },
        { status: 404 }
      );
    }

    store.addAuditLog(
      'COMMISSION_DISBURSED',
      'Finance',
      `Commission ${id} updated to ${status} by ${auth.user.name} (UTR: ${utrNumber || 'N/A'})`,
      id
    );

    return NextResponse.json({
      success: true,
      message: `Commission marked as ${status}`,
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update commission' } },
      { status: 500 }
    );
  }
}

