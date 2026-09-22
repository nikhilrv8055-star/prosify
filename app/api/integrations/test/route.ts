import { NextRequest, NextResponse } from 'next/server';
import { IntegrationRegistry } from '@/lib/integrations/registry';
import { store } from '@/lib/data/store';

export async function POST(req: NextRequest) {
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

    return NextResponse.json({
      success: handshakeResult.success,
      result: handshakeResult,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'HANDSHAKE_ERROR', message: err?.message || 'Handshake failed' } },
      { status: 500 }
    );
  }
}
