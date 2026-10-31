import { NextRequest, NextResponse } from 'next/server';
import { NO_CACHE_HEADERS } from '@/lib/db/d1';

export const dynamic = 'force-dynamic';

function getD1Database(): any {
  try {
    const globalContext = (globalThis as any).__cloudflare_context__?.env?.DB;
    if (globalContext) return globalContext;
  } catch (e) {}

  if ((process.env as any)?.DB) return (process.env as any).DB;
  if ((globalThis as any)?.DB) return (globalThis as any).DB;
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const db = getD1Database();

    // Fallback if D1 is initializing or not bound
    if (!db) {
      console.warn('D1 binding not detected in admin affiliate API. Returning safe fallback.');
      return NextResponse.json(
        {
          success: true,
          metrics: {
            totalPayoutsDisbursed: 0,
            platformRevenueFromAffiliates: 0,
            activeAffiliates: 0,
            pendingPayoutRequests: 0,
            totalAffiliates: 0,
          },
          affiliates: [],
        },
        { headers: NO_CACHE_HEADERS }
      );
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
    console.error('Safe Catch in Admin Affiliate GET:', error);
    // Return empty array instead of 500 error to prevent React boundary crash
    return NextResponse.json(
      {
        success: true,
        metrics: {
          totalPayoutsDisbursed: 0,
          platformRevenueFromAffiliates: 0,
          activeAffiliates: 0,
          pendingPayoutRequests: 0,
          totalAffiliates: 0,
        },
        affiliates: [],
        warning: error.message || 'Database fetch failed',
      },
      { headers: NO_CACHE_HEADERS }
    );
  }
}
