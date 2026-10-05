import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { IntegrationRegistry } from '@/lib/integrations/registry';
import { requireRole } from '@/lib/auth/serverAuth';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { recordAuditEvent } from '@/lib/security/auditLog';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const rateLimitResponse = applyRateLimit(req, { limit: 20, windowMs: 60 * 1000 }, 'simulate_lead');
  if (rateLimitResponse) return rateLimitResponse;

  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER']);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const { provider, leadPayload } = body;

    if (!provider) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'provider is required' } },
        { status: 400 }
      );
    }

    // Try parsing with modular adapter if available
    let parsedLead = IntegrationRegistry.parseInboundWebhook(provider, leadPayload);
    if (!parsedLead) {
      parsedLead = {
        name: leadPayload?.name || 'Verified Ad Inquirer',
        phone: leadPayload?.phone || '+91 98201 55667',
        email: leadPayload?.email || 'buyer@metaleads.in',
        source: provider.toUpperCase() as any,
        budget: leadPayload?.budget || '₹1.8 Cr - ₹3 Cr',
        location: leadPayload?.location || 'Thane West',
        bhk: leadPayload?.bhk || '3 BHK',
        propertyTitle: leadPayload?.propertyTitle || 'Godrej Ascend Luxury',
        notes: leadPayload?.notes || `Inbound webhook lead from ${provider}`,
      };
    }

    const createdLead = store.simulateInboundLead(provider, parsedLead);

    recordAuditEvent({
      actor: auth.user,
      action: 'LEAD_CREATE',
      resource: `/api/leads/${createdLead.id}`,
      resourceId: createdLead.id,
      status: 'SUCCESS',
      details: `Simulated inbound lead from ${provider}`,
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message: `Lead ingested successfully from ${provider}`,
      lead: createdLead,
    });
  } catch (err: unknown) {
    console.error('Lead simulation error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INGEST_ERROR', message: 'Failed to ingest lead' } },
      { status: 500 }
    );
  }
}
