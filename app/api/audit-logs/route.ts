import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { applyRateLimit } from '@/lib/security/rateLimit';

export async function GET(req: NextRequest) {
  const rateLimitResponse = applyRateLimit(req, { limit: 60, windowMs: 60 * 1000 }, 'audit_logs');
  if (rateLimitResponse) return rateLimitResponse;

  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  const logs = store.getAuditLogs();
  return NextResponse.json({ success: true, count: logs.length, data: logs });
}
