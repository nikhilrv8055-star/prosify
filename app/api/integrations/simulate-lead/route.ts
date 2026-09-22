import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { IntegrationRegistry } from '@/lib/integrations/registry';

export async function POST(req: NextRequest) {
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

    return NextResponse.json({
      success: true,
      message: `Lead ingested successfully from ${provider}`,
      lead: createdLead,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'INGEST_ERROR', message: err?.message || 'Failed to ingest lead' } },
      { status: 500 }
    );
  }
}
