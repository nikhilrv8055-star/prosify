import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { recordAuditEvent } from '@/lib/security/auditLog';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);

  const rateLimitResponse = applyRateLimit(req, { limit: 20, windowMs: 60 * 1000 }, 'sync_trigger');
  if (rateLimitResponse) return rateLimitResponse;

  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER']);
  if (auth.errorResponse) return auth.errorResponse;

  const user = auth.user;

  try {
    const { id } = await params;

    // Developer can only trigger sync for their own source
    const source = store.getSyncSources().find((s) => s.id === id);
    if (user.role === 'DEVELOPER' && user.developerId && source && source.developerId !== user.developerId) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'You can only trigger sync for your own developer organization.' } },
        { status: 403 }
      );
    }

    let simulateError = false;
    try {
      const body = await req.json();
      simulateError = Boolean(body?.simulateError);
    } catch {
      // empty body is acceptable
    }

    const job = store.runSyncJob(id, simulateError);

    recordAuditEvent({
      actor: user,
      action: 'DEVELOPER_PUSH_SYNC',
      resource: `/api/sync/developer/${id}`,
      resourceId: id,
      status: 'SUCCESS',
      details: `Sync job initiated for source ${id}`,
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message: `Sync initiated successfully for source ${id}`,
      data: job,
    });
  } catch (err: unknown) {
    console.error('Error running sync job:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SYNC_FAILED', message: 'Failed to run sync job' } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);

  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;
    const body = await req.json();
    const updated = store.updateSyncSource(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Sync source not found' } },
        { status: 404 }
      );
    }

    recordAuditEvent({
      actor: auth.user,
      action: 'INTEGRATION_UPDATE',
      resource: `/api/sync/developer/${id}`,
      resourceId: id,
      status: 'SUCCESS',
      details: `Developer sync source ${id} configuration updated`,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    console.error('Error updating sync source:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update sync source' } },
      { status: 500 }
    );
  }
}
