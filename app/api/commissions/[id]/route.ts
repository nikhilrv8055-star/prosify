import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { recordAuditEvent } from '@/lib/security/auditLog';
import { getClientIp } from '@/lib/security/rateLimit';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);

  // Strict RBAC: Only Super Admin, Admin, and Finance can update commission statuses
  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN', 'FINANCE']);
  if (auth.errorResponse) return auth.errorResponse;

  const user = auth.user;

  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Status is required' } },
        { status: 400 }
      );
    }

    const updated = store.updateCommissionStatus(id, body.status, body.utrNumber);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Commission record not found' } },
        { status: 404 }
      );
    }

    recordAuditEvent({
      actor: user,
      action: 'COMMISSION_UPDATE',
      resource: `/api/commissions/${id}`,
      resourceId: id,
      status: 'SUCCESS',
      details: `Commission ${id} marked as ${body.status} (UTR: ${body.utrNumber || 'N/A'})`,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    console.error('Error updating commission:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update commission record.' } },
      { status: 500 }
    );
  }
}
