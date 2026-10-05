import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { recordAuditEvent } from '@/lib/security/auditLog';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const rateLimitResponse = applyRateLimit(req, { limit: 20, windowMs: 60 * 1000 }, 'sync_retry');
  if (rateLimitResponse) return rateLimitResponse;

  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER']);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'jobId is required' } },
        { status: 400 }
      );
    }

    const result = store.retrySyncJob(jobId);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: 'RETRY_FAILED', message: result.error || 'Retry attempt failed' } },
        { status: 400 }
      );
    }

    recordAuditEvent({
      actor: auth.user,
      action: 'DEVELOPER_PUSH_SYNC',
      resource: `/api/sync/retry/${jobId}`,
      resourceId: jobId,
      status: 'SUCCESS',
      details: `Retried sync job ${jobId}`,
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message: `Job ${jobId} successfully retried`,
      data: result.job,
    });
  } catch (err: unknown) {
    console.error('Error retrying sync job:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error processing retry' } },
      { status: 500 }
    );
  }
}
