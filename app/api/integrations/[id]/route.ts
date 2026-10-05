import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { recordAuditEvent } from '@/lib/security/auditLog';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);

  const rateLimitResponse = applyRateLimit(req, { limit: 30, windowMs: 60 * 1000 }, 'integration_patch');
  if (rateLimitResponse) return rateLimitResponse;

  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = store.updateIntegration(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Integration not found' } },
        { status: 404 }
      );
    }

    recordAuditEvent({
      actor: auth.user,
      action: 'INTEGRATION_UPDATE',
      resource: `/api/integrations/${id}`,
      resourceId: id,
      status: 'SUCCESS',
      details: `Integration adapter ${id} modified`,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    console.error('Error updating integration:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Could not update integration' } },
      { status: 500 }
    );
  }
}
