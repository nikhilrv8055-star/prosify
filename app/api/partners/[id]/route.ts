import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { recordAuditEvent } from '@/lib/security/auditLog';
import { getClientIp } from '@/lib/security/rateLimit';

const VALID_PARTNER_STATUSES = new Set(['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED']);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);

  // Strict Admin Authorization: Only Super Admin and Admin can approve or update partner status
  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) return auth.errorResponse;

  const user = auth.user;

  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.status || !VALID_PARTNER_STATUSES.has(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: `Status must be one of: ${Array.from(VALID_PARTNER_STATUSES).join(', ')}`,
          },
        },
        { status: 400 }
      );
    }

    const updated = store.updatePartnerStatus(id, body.status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Partner record not found' } },
        { status: 404 }
      );
    }

    recordAuditEvent({
      actor: user,
      action: 'ROLE_SWITCH',
      resource: `/api/partners/${id}`,
      resourceId: id,
      status: 'SUCCESS',
      details: `Partner ${id} status updated to ${body.status}`,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    console.error('Error updating partner:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Could not update partner' } },
      { status: 500 }
    );
  }
}
