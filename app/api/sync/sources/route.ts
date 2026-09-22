import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { applyRateLimit } from '@/lib/security/rateLimit';

export async function GET(req: NextRequest) {
  const rateLimitResponse = applyRateLimit(req, { limit: 100, windowMs: 60 * 1000 }, 'sync_sources_get');
  if (rateLimitResponse) return rateLimitResponse;

  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  const sources = store.getSyncSources();
  const jobs = store.getSyncJobs();
  return NextResponse.json({ success: true, sources, jobs });
}

export async function POST(req: NextRequest) {
  const rateLimitResponse = applyRateLimit(req, { limit: 60, windowMs: 60 * 1000 }, 'sync_sources_post');
  if (rateLimitResponse) return rateLimitResponse;

  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  try {
    const body = await req.json();
    const {
      developerName,
      developerId,
      sourceType,
      feedFormat,
      authType,
      apiUrl,
      apiKeyMasked,
      syncFrequency,
      autoSyncEnabled,
      retryPolicy,
    } = body;

    if (!developerName || !apiUrl) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Developer Name and Endpoint/Feed URL are required' } },
        { status: 400 }
      );
    }

    const newSource = store.createSyncSource({
      developerName,
      developerId: developerId || `dev-${Date.now()}`,
      sourceType: sourceType || 'API',
      feedFormat: feedFormat || 'JSON_REST',
      authType: authType || 'BEARER_TOKEN',
      apiUrl,
      apiKeyMasked: apiKeyMasked ? `••••••••${apiKeyMasked.slice(-4)}` : '••••••••',
      syncFrequency: syncFrequency || 'HOURLY',
      autoSyncEnabled: autoSyncEnabled !== false,
      status: 'IDLE',
      retryPolicy: retryPolicy || { maxRetries: 3, backoffSeconds: 30 },
      unitsMappedCount: 0,
    });

    return NextResponse.json({ success: true, data: newSource });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: err?.message || 'Failed to create sync source' } },
      { status: 500 }
    );
  }
}
