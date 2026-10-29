import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireRole } from '@/lib/auth/serverAuth';
import { applyRateLimit } from '@/lib/security/rateLimit';
import { NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Rate limiting (120 req/min for admin overview)
    const rateLimitResponse = applyRateLimit(req, { limit: 120, windowMs: 60 * 1000 }, 'admin_overview');
    if (rateLimitResponse) return rateLimitResponse;

    // Authorization check (Super Admin, Admin, Sales Manager)
    const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER']);
    if (auth.errorResponse) {
      return auth.errorResponse;
    }

    const properties = store.getProperties();
    const projects = store.getProjects();
    const leads = store.getLeads();
    const units = store.getUnits();
    const partners = store.getChannelPartners();
    const commissions = store.getCommissions();
    const integrations = store.getIntegrations();
    const notifications = store.getNotifications();
    const syncSources = store.getSyncSources();

    // Aggregate high-level operational statistics
    const totalGmv = properties.reduce((acc, p) => acc + (p.price || 0), 0);
    const activeLeadsCount = leads.filter((l) => !['DROPPED', 'LOST'].includes(l.status)).length;
    const bookedUnitsCount = units.filter((u) => u.status === 'BOOKED' || u.status === 'SOLD').length;
    const availableUnitsCount = units.filter((u) => u.status === 'AVAILABLE').length;

    return NextResponse.json(
      {
        success: true,
        user: auth.user,
        integrations,
        stats: {
          totalProperties: properties.length,
          totalProjects: projects.length,
          totalUnits: units.length,
          availableUnits: availableUnitsCount,
          bookedUnits: bookedUnitsCount,
          totalLeads: leads.length,
          activeLeads: activeLeadsCount,
          totalPartners: partners.length,
          activePartners: partners.filter((p) => p.status === 'ACTIVE').length,
          totalCommissionsValue: commissions.reduce((acc, c) => acc + (c.amount || 0), 0),
          totalGmv,
          activeSyncSources: syncSources.filter((s) => s.autoSyncEnabled !== false).length,
        },
        notifications: notifications.slice(0, 10),
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal overview processing failed';
    return createErrorResponse('INTERNAL_ERROR', message, 500);
  }
}
