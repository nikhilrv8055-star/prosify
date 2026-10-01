import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { DeveloperProjectSyncItem } from '@/lib/types';

// GET: Developer API Documentation & Schema Discovery
export async function GET(req: NextRequest) {
  const apiKey =
    req.headers.get('x-api-key') ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    '';

  const connection = apiKey ? store.getDeveloperApiConnectionByApiKey(apiKey) : null;

  return NextResponse.json({
    service: 'ENI Real Estate Platform - Builder & Developer Inbound Sync API',
    version: 'v1',
    authenticated: Boolean(connection),
    developer: connection ? connection.developerName : null,
    documentation: {
      endpoint: 'POST /api/v1/developer/sync',
      authentication: {
        method: 'API Key Header',
        headers: [
          'x-api-key: <YOUR_ENI_BUILDER_API_KEY>',
          'Authorization: Bearer <YOUR_ENI_BUILDER_API_KEY>',
        ],
      },
      acceptedFormat: 'JSON (Single project object OR Array of projects OR { projects: [...] })',
      samplePayload: [
        {
          name: 'Godrej Sky Greens',
          developerName: 'Godrej Properties Ltd',
          reraNumber: 'P52100022417',
          city: 'Pune',
          locality: 'Kharadi Manjari Road',
          address: 'Next to EON IT Park, Kharadi, Pune, Maharashtra 411014',
          priceStartingFrom: '₹82 Lakhs',
          minPrice: 8200000,
          maxPrice: 19500000,
          constructionStatus: 'UNDER_CONSTRUCTION',
          possessionDate: 'Dec 2027',
          totalUnits: 240,
          availableUnits: 72,
          description: 'Luxury high-rise residential residences featuring forest clubhouse and sky walkway.',
          coverImage: 'https://picsum.photos/seed/godrejpune/1200/800',
          images: [
            'https://picsum.photos/seed/godrej1/1200/800',
            'https://picsum.photos/seed/godrej2/1200/800',
          ],
          amenities: ['Olympic Pool', 'Badminton Court', 'EV Charging', 'Sky Lounge', 'Herb Garden'],
          bhkTypes: ['2 BHK', '3 BHK'],
          towers: ['Tower Aqua', 'Tower Terra'],
        },
      ],
    },
  });
}

// POST: Real-Time Inbound Project Sync from Builders / Developers
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Developer API Key
    const apiKey =
      req.headers.get('x-api-key') ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
      req.headers.get('x-developer-token') ||
      '';

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_API_KEY',
          message:
            'Missing developer API Key. Provide header "x-api-key" or "Authorization: Bearer <key>". Manage keys in Admin Panel (/admin).',
        },
        { status: 401 }
      );
    }

    const connection = store.getDeveloperApiConnectionByApiKey(apiKey);
    if (!connection) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_API_KEY',
          message:
            'Invalid or expired Developer API Key. Please verify your credentials inside Admin Panel > Builder API Sync.',
        },
        { status: 403 }
      );
    }

    if (connection.status === 'PAUSED') {
      return NextResponse.json(
        {
          success: false,
          error: 'CONNECTION_PAUSED',
          message: 'This Builder API connection is currently paused by admin.',
        },
        { status: 403 }
      );
    }

    // 2. Parse Payload
    const body = await req.json();

    let items: DeveloperProjectSyncItem[] = [];
    if (Array.isArray(body)) {
      items = body;
    } else if (body.projects && Array.isArray(body.projects)) {
      items = body.projects;
    } else if (body.name) {
      items = [body];
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_PAYLOAD',
          message: 'Payload must contain a project object, an array of projects, or { projects: [...] }',
        },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'EMPTY_PAYLOAD',
          message: 'No project items found in sync request',
        },
        { status: 400 }
      );
    }

    // 3. Process Sync & Auto-Registration
    const result = store.syncDeveloperProjects(
      connection.id,
      items,
      `Developer API Inbound (Key: ${apiKey.slice(0, 14)}...)`
    );

    return NextResponse.json(
      {
        success: result.success,
        developer: connection.developerName,
        connectionId: connection.id,
        createdCount: result.createdCount,
        updatedCount: result.updatedCount,
        totalProcessed: result.totalProcessed,
        syncedProjects: result.syncedProjects.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          city: p.city,
          reraNumber: p.reraNumber,
          priceRange: p.priceRange || 'On Request',
          availableUnits: p.availableUnits,
          verificationStatus: p.verificationStatus,
          marketplaceUrl: `/projects/${p.slug}`,
        })),
        errors: result.errors,
        timestamp: new Date().toISOString(),
      },
      { status: result.success ? 200 : 207 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: error.message || 'Failed to process developer project sync',
      },
      { status: 500 }
    );
  }
}
