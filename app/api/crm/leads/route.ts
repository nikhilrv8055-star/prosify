import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { dispatchLeadToCrm } from '@/lib/crm/dispatcher';
import { StandardLeadPayload, getCrmConfig } from '@/lib/crm/config';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const syncStatus = searchParams.get('status')?.toUpperCase();
    const query = searchParams.get('q')?.toLowerCase();

    let leads = store.getLeads();

    if (syncStatus) {
      leads = leads.filter((l) => (l.crmSyncStatus || 'PENDING') === syncStatus);
    }

    if (query) {
      leads = leads.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.phone.includes(query) ||
          (l.email && l.email.toLowerCase().includes(query)) ||
          (l.propertyTitle && l.propertyTitle.toLowerCase().includes(query))
      );
    }

    const logs = store.getCrmSyncLogs();

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads: leads.map((l) => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        email: l.email,
        city: l.city || l.location,
        requirement: l.requirement,
        propertyTitle: l.propertyTitle,
        source: l.source,
        utmSource: l.utmSource,
        utmMedium: l.utmMedium,
        utmCampaign: l.utmCampaign,
        affiliateId: l.affiliateId,
        crmSyncStatus: l.crmSyncStatus || 'PENDING',
        crmLastSyncedAt: l.crmLastSyncedAt,
        realaticLeadId: l.realaticLeadId,
        createdAt: l.createdAt,
      })),
      recentLogs: logs.slice(0, 15),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Retry lead sync
export async function POST(req: NextRequest) {
  try {
    const { leadId } = await req.json();
    if (!leadId) {
      return NextResponse.json({ success: false, error: 'leadId is required' }, { status: 400 });
    }

    const lead = store.getLeads().find((l) => l.id === leadId);
    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found in local database' }, { status: 404 });
    }

    const payload: StandardLeadPayload = {
      name: lead.name,
      email: lead.email || '',
      phone: lead.phone,
      city: lead.city || lead.location || 'Mumbai',
      inquiryType: lead.requirement || 'Manual Retry Sync',
      message: lead.notes || '',
      sourceUrl: 'https://prosify.in/admin?tab=crm-leads',
      timestamp: new Date().toISOString(),
      utmSource: lead.utmSource || 'crm_manual_retry',
      utmMedium: lead.utmMedium || '',
      utmCampaign: lead.utmCampaign || '',
      leadTag: 'Manual_Retry',
      affiliateId: lead.affiliateId,
      propertyTitle: lead.propertyTitle,
      budget: lead.budget,
    };

    const dispatchResult = await dispatchLeadToCrm(payload);
    const newStatus = dispatchResult.status === 'SYNCED' ? 'SYNCED' : 'FAILED';

    store.updateLeadCrmSyncStatus(
      lead.id,
      newStatus,
      dispatchResult.externalLeadId,
      dispatchResult.errorMessage
    );

    store.addCrmSyncLog({
      id: `crm-retry-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      leadPhone: lead.phone,
      crmProvider: (getCrmConfig().provider.toUpperCase() as any) || 'WEBHOOK',
      requestPayload: dispatchResult.requestPayload,
      responsePayload: dispatchResult.responsePayload || { message: dispatchResult.errorMessage },
      statusCode: dispatchResult.httpStatus || (dispatchResult.success ? 200 : 500),
      errorMessage: dispatchResult.errorMessage,
      syncTimestamp: dispatchResult.lastAttemptAt,
      syncStatus: newStatus,
      idempotencyKey: `retry_${lead.id}_${Date.now()}`,
    });

    return NextResponse.json({
      success: dispatchResult.success,
      leadId: lead.id,
      crmSyncStatus: newStatus,
      externalLeadId: dispatchResult.externalLeadId,
      attempts: dispatchResult.attempts,
      durationMs: dispatchResult.durationMs,
      message: dispatchResult.success
        ? 'Lead successfully synced to CRM webhook!'
        : `Sync failed: ${dispatchResult.errorMessage || 'Check endpoint URL or network'}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
