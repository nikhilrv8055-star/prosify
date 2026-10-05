import { NextRequest, NextResponse } from 'next/server';
import { IntegrationRegistry } from '@/lib/integrations/registry';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { recordAuditEvent } from '@/lib/security/auditLog';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const rateLimitResponse = applyRateLimit(req, { limit: 20, windowMs: 60 * 1000 }, 'integration_test');
  if (rateLimitResponse) return rateLimitResponse;

  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const { provider, credentials, adapterId } = body;

    if (!provider) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'provider is required' } },
        { status: 400 }
      );
    }

    const handshakeResult = await IntegrationRegistry.testProviderHandshake(
      provider,
      credentials || {}
    );

    // Update adapter record in store if adapterId provided
    if (adapterId) {
      store.updateIntegration(adapterId, {
        lastTestStatus: handshakeResult.success ? 'SUCCESS' : 'FAILED',
        lastTestLatencyMs: handshakeResult.latencyMs,
        lastTestMessage: handshakeResult.message,
        statusText: handshakeResult.success ? 'Connected & Verified' : 'Handshake Failed',
        isConnected: handshakeResult.success,
      });
    }

    recordAuditEvent({
      actor: auth.user,
      action: 'INTEGRATION_UPDATE',
      resource: `/api/integrations/test/${provider}`,
      status: handshakeResult.success ? 'SUCCESS' : 'FAILURE',
      details: `Handshake test executed for ${provider}`,
      ipAddress: ip,
    });

    return NextResponse.json({
      success: handshakeResult.success,
      result: handshakeResult,
    });
  } catch (err: unknown) {
    console.error('Handshake test error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'HANDSHAKE_ERROR', message: 'Handshake verification failed' } },
      { status: 500 }
    );
  }
}
