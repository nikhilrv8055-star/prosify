import { NextResponse } from 'next/server';
import { getDatabaseStatus, NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  try {
    const status = await getDatabaseStatus();

    return NextResponse.json(
      {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: status,
        cloudflare: {
          framework: '@opennextjs/cloudflare',
          database_id: 'e1e0fd5e-8efa-4b3b-aa83-53518b7d1e60',
          binding: 'DB',
          features: [
            'Cloudflare Workers / Pages Hosting',
            'Cloudflare D1 Serverless SQLite Edge DB',
            'Cloudflare R2 Object Storage for Images & Brochures',
            'Cloudflare Workers KV for Edge Caching',
            'Global CDN with Edge SSR',
          ],
        },
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Diagnostic execution failed';
    return createErrorResponse('INTERNAL_ERROR', errorMessage, 500);
  }
}
