import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { recordAuditEvent } from '@/lib/security/auditLog';
import { getClientIp } from '@/lib/security/rateLimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) return auth.errorResponse;

  store.clearSyncLogs();

  recordAuditEvent({
    actor: auth.user,
    action: 'INTEGRATION_UPDATE',
    resource: '/api/sync/clear-logs',
    status: 'SUCCESS',
    details: 'Developer sync logs cleared by administrator',
    ipAddress: ip,
  });

  return NextResponse.json({ success: true, message: 'Sync logs cleared' });
}
