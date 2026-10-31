import { NextRequest, NextResponse } from 'next/server';
import { NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export const dynamic = 'force-dynamic';

async function getD1(): Promise<any> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext({ async: true });
    if (ctx?.env?.DB) return ctx.env.DB;
  } catch (e) {}

  if ((process.env as any)?.DB) return (process.env as any).DB;
  if ((globalThis as any)?.__cloudflare_context__?.env?.DB) {
    return (globalThis as any).__cloudflare_context__.env.DB;
  }
  if ((globalThis as any)?.DB) return (globalThis as any).DB;

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const db = await getD1();
    if (!db) {
      return createErrorResponse('INTERNAL_ERROR', 'Cloudflare D1 binding (DB) not found in runtime.', 500);
    }

    const { results } = await db.prepare(`
      SELECT 
        id,
        user_name AS name,
        email,
        phone,
        city,
        agency_name AS agencyName,
        pan_card AS panCard,
        rera_number AS reraNumber,
        ref_code AS referralCode,
        tier,
        status,
        created_at AS createdAt
      FROM affiliates
      ORDER BY id DESC
    `).all();

    const rawList = (results as any[]) || [];

    const affiliates = rawList.map((item) => ({
      id: item.id || `aff_${item.referralCode}`,
      name: item.name || 'Partner',
      email: item.email || '',
      phone: item.phone || '+91 98000 00000',
      city: item.city || 'Mumbai',
      agencyName: item.agencyName || 'Independent Partner',
      panCard: item.panCard || '',
      reraNumber: item.reraNumber || '',
      referralCode: item.referralCode || '',
      referralUrl: `https://prosify.in/?ref=${item.referralCode}`,
      tier: item.tier || 'Bronze (2.5%)',
      status: (item.status || 'ACTIVE').toUpperCase(),
      createdAt: item.createdAt || new Date().toISOString(),
      lifetimeEarnings: 0,
      availableBalance: 0,
      totalClicks: 0,
      leadsGenerated: 0,
      conversions: 0,
    }));

    return NextResponse.json(
      {
        success: true,
        metrics: {
          totalPayoutsDisbursed: 0,
          platformRevenueFromAffiliates: 0,
          activeAffiliates: affiliates.filter((a) => a.status === 'ACTIVE').length,
          pendingPayoutRequests: 0,
          totalAffiliates: affiliates.length,
        },
        affiliates,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Admin Affiliate GET Error:', error);
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Error fetching affiliates', 500);
  }
}
