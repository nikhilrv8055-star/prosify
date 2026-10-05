import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { recordAuditEvent } from '@/lib/security/auditLog';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const rateLimitResponse = applyRateLimit(
    req,
    { limit: 30, windowMs: 60 * 1000 },
    'integrations_update'
  );
  if (rateLimitResponse) return rateLimitResponse;

  // Strict Admin Authorization
  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) {
    return auth.errorResponse;
  }
  const user = auth.user;

  try {
    const body = await req.json();
    const { id, updates } = body;

    if (!id || !updates || typeof updates !== 'object') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'id and updates object are required' } },
        { status: 400 }
      );
    }

    const updated = store.updateIntegration(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Integration adapter not found' } },
        { status: 404 }
      );
    }

    recordAuditEvent({
      actor: user,
      action: 'INTEGRATION_UPDATE',
      resource: `/api/integrations/${id}`,
      resourceId: id,
      status: 'SUCCESS',
      details: `Integration adapter ${id} settings updated`,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    console.error('Error updating integration adapter:', err);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'UPDATE_FAILED', message: 'Failed to update integration adapter settings' },
      },
      { status: 500 }
    );
  }
}
