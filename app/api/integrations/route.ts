import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { applyRateLimit } from '@/lib/security/rateLimit';

export async function GET(req: NextRequest) {
  const rateLimitResponse = applyRateLimit(req, { limit: 100, windowMs: 60 * 1000 }, 'integrations_get');
  if (rateLimitResponse) return rateLimitResponse;

  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  const integrations = store.getIntegrations();
  return NextResponse.json({ success: true, data: integrations });
}
