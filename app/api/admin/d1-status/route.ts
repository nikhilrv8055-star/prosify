import { NextResponse } from 'next/server';
import { getDatabaseStatus } from '@/lib/db/d1';

export async function GET() {
  const status = await getDatabaseStatus();
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: status,
    cloudflare: {
      framework: '@opennextjs/cloudflare',
      features: [
        'Cloudflare Workers / Pages Hosting',
        'Cloudflare D1 Serverless SQLite Edge DB',
        'Cloudflare R2 Object Storage for Images & Brochures',
        'Cloudflare Workers KV for Edge Caching',
        'Global CDN with Edge SSR',
      ],
    },
  });
}
