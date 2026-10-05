import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireAuth } from '@/lib/auth/serverAuth';
import { recordAuditEvent } from '@/lib/security/auditLog';
import { getClientIp } from '@/lib/security/rateLimit';
import { sanitizeUserInput } from '@/lib/security/sanitizer';

const VALID_VISIT_STATUSES = new Set([
  'SCHEDULED',
  'CONFIRMED',
  'CAB_DISPATCHED',
  'VISITED',
  'COMPLETED',
  'CANCELLED',
  'RESCHEDULED',
  'NO_SHOW',
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);
  const auth = requireAuth(req);
  if (auth.errorResponse) return auth.errorResponse;

  const user = auth.user;

  try {
    const { id } = await params;
    const body = await req.json();

    const isPrivileged = ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_AGENT', 'SALES_EXECUTIVE'].includes(
      user.role
    );
    if (!isPrivileged) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to manage site visits.' } },
        { status: 403 }
      );
    }

    if (!body.status || !VALID_VISIT_STATUSES.has(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: `Status required and must be one of: ${Array.from(VALID_VISIT_STATUSES).join(', ')}`,
          },
        },
        { status: 400 }
      );
    }

    const cleanNotes = body.notes ? sanitizeUserInput(body.notes) : undefined;
    const updated = store.updateSiteVisitStatus(id, body.status, cleanNotes);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Site visit not found' } },
        { status: 404 }
      );
    }

    recordAuditEvent({
      actor: user,
      action: 'LEAD_STATUS_UPDATE',
      resource: `/api/site-visits/${id}`,
      resourceId: id,
      status: 'SUCCESS',
      details: `Site visit status updated to ${body.status}`,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    console.error('Error updating site visit:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Could not update site visit' } },
      { status: 500 }
    );
  }
}
