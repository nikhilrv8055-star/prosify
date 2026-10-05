import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { DeveloperPushPayload } from '@/lib/types';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { recordAuditEvent } from '@/lib/security/auditLog';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate limiting (60 push syncs per minute per IP)
  const rateLimitResponse = applyRateLimit(
    req,
    { limit: 60, windowMs: 60 * 1000 },
    'developer_push'
  );
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // 1. Extract API Key from headers (x-api-key or Authorization: Bearer ...)
    const apiKeyHeader =
      req.headers.get('x-api-key') ||
      req.headers.get('authorization') ||
      req.headers.get('x-developer-token');

    if (!apiKeyHeader) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_REQUIRED',
            message:
              'Missing Developer API Key. Please provide your authenticated API key via "x-api-key" or "Authorization: Bearer <KEY>" header.',
            docsUrl: 'https://docs.prosify.in/developers/realtime-inventory-push',
          },
        },
        { status: 401 }
      );
    }

    const cleanApiKey = apiKeyHeader.trim().replace(/^Bearer\s+/i, '');

    // 2. Parse request body with size check
    let body: DeveloperPushPayload;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Invalid JSON payload in push request body.',
          },
        },
        { status: 400 }
      );
    }

    if (!body.action && !body.project && (!body.units || body.units.length === 0)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMPTY_PAYLOAD',
            message:
              'Push payload must contain either a "project" object for project upsert, or "units" array for unit status updates.',
          },
        },
        { status: 400 }
      );
    }

    // 3. Process push in store
    const result = store.processDeveloperInboundPush(cleanApiKey, body);

    recordAuditEvent({
      action: 'DEVELOPER_PUSH_SYNC',
      resource: '/api/developer-api/push',
      status: 'SUCCESS',
      details: `Processed push for ${result.developerName} (action: ${result.action})`,
      ipAddress: ip,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    const isAuth = err.message?.toLowerCase().includes('unauthorized') || err.message?.toLowerCase().includes('invalid');
    const isPerm = err.message?.toLowerCase().includes('forbidden') || err.message?.toLowerCase().includes('inactive');

    recordAuditEvent({
      action: 'DEVELOPER_PUSH_SYNC',
      resource: '/api/developer-api/push',
      status: 'FAILURE',
      details: `Inbound push rejected: ${err.message}`,
      ipAddress: ip,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: isAuth ? 'UNAUTHORIZED' : isPerm ? 'FORBIDDEN' : 'PUSH_SYNC_FAILED',
          message: err.message || 'An error occurred while processing developer inbound push.',
        },
      },
      { status: isAuth ? 401 : isPerm ? 403 : 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'Prosify Enterprise Real-Time Inventory & Project Push API',
    version: 'v2.4.0',
    description:
      'Direct authenticated ingestion endpoint for Grade-A developers to securely push project registrations and real-time inventory unit status changes directly into CRM.',
    authMethod: 'API Key (x-api-key) or Bearer Token',
    samplePayloads: {
      projectUpsert: {
        action: 'SYNC_PROJECT',
        project: {
          name: 'Godrej Palm Retreat',
          reraNumber: 'PRM/KA/RERA/1251/310/PR/200115/003188',
          city: 'Bengaluru',
          location: 'Whitefield',
          priceMin: 12500000,
          priceMax: 34000000,
          bhkTypes: ['2 BHK', '3 BHK'],
          totalUnits: 350,
          towers: ['Tower A', 'Tower B', 'Tower C'],
          completionDate: '2027-12-31',
          status: 'UNDER_CONSTRUCTION',
        },
      },
      unitInventoryPush: {
        action: 'UPDATE_INVENTORY',
        projectId: 'proj-1',
        units: [
          {
            unitNumber: 'A-402',
            tower: 'Tower A',
            floor: 4,
            bhk: '3 BHK',
            area: 1450,
            price: 14500000,
            status: 'BOOKED',
            bookingReference: 'BK-2026-GD-0912',
          },
        ],
      },
    },
  });
}
