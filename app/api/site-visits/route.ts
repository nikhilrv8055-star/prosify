import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const partnerId = searchParams.get('partnerId') || undefined;
  const visits = store.getSiteVisits(partnerId);
  return NextResponse.json({ success: true, count: visits.length, data: visits });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.leadName || !body.leadPhone || !body.visitDate || !body.visitTime) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing visit booking details' } },
        { status: 400 }
      );
    }

    // 1. Create or retrieve lead, applying ProLead scoring (+25 for site visit request)
    const existingLead = store.getLeads().find(
      (l) => l.phone.replace(/[^0-9]/g, '') === body.leadPhone.replace(/[^0-9]/g, '')
    );

    let leadId = existingLead?.id;
    let finalLead = existingLead;

    if (existingLead) {
      const newScore = Math.min(100, (existingLead.leadScore || 50) + 25);
      const newQual = newScore >= 81 ? 'HOT' : newScore >= 61 ? 'QUALIFIED' : 'WARM';
      finalLead = store.updateLead(existingLead.id, {
        status: 'SITE_VISIT_SCHEDULED',
        leadScore: newScore,
        qualification: newQual,
        notes: `${existingLead.notes || ''} | [Site Visit Scheduled for ${body.visitDate} at ${body.visitTime}] ${body.notes || ''}`.trim(),
      }) || existingLead;
    } else {
      finalLead = store.createLead({
        name: body.leadName,
        phone: body.leadPhone,
        email: body.email || 'lead@prosify.in',
        source: body.partnerCode ? 'CHANNEL_PARTNER' : 'WEBSITE',
        status: 'SITE_VISIT_SCHEDULED',
        propertyTitle: body.propertyTitle || body.projectName,
        budget: '₹1.0 Cr - ₹2.5 Cr',
        notes: `Direct Site Visit booking on ${body.visitDate} at ${body.visitTime}. ${body.notes || ''}`,
        hasSiteVisitRequest: true,
      });
      leadId = finalLead.id;
    }

    // 2. Schedule site visit record
    const created = store.createSiteVisit({
      leadId: leadId || `lead-${Date.now()}`,
      leadName: body.leadName,
      leadPhone: body.leadPhone,
      projectId: body.projectId,
      projectName: body.projectName,
      propertyId: body.propertyId,
      propertyTitle: body.propertyTitle,
      partnerId: body.partnerId,
      partnerCode: body.partnerCode,
      salesExecutive: body.salesExecutive || 'Rohan Mehra (Site Experience Manager)',
      visitDate: body.visitDate,
      visitTime: body.visitTime,
      notes: body.notes,
    });

    return NextResponse.json(
      { success: true, message: 'Site visit scheduled successfully!', data: { visit: created, lead: finalLead } },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message || 'Failed to schedule site visit' } },
      { status: 500 }
    );
  }
}

