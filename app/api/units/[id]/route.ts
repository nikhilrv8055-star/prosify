import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { recordAuditEvent } from '@/lib/security/auditLog';
import { getClientIp } from '@/lib/security/rateLimit';

const VALID_UNIT_STATUSES = new Set(['AVAILABLE', 'BOOKED', 'SOLD', 'HOLD', 'BLOCKED']);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);

  // Role check: Admin, Developer, or Sales Manager
  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'SALES_MANAGER']);
  if (auth.errorResponse) return auth.errorResponse;

  const user = auth.user;

  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.status || !VALID_UNIT_STATUSES.has(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: `Status is required and must be one of: ${Array.from(VALID_UNIT_STATUSES).join(', ')}`,
          },
        },
        { status: 400 }
      );
    }

    const updated = store.updateUnitStatus(id, body.status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Unit not found' } },
        { status: 404 }
      );
    }

    recordAuditEvent({
      actor: user,
      action: 'PROPERTY_STATUS_CHANGE',
      resource: `/api/units/${id}`,
      resourceId: id,
      status: 'SUCCESS',
      details: `Unit ${id} status updated to ${body.status}`,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    console.error('Error updating unit:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update unit' } },
      { status: 500 }
    );
  }
}
