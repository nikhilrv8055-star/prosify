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

    const created = store.createSiteVisit({
      leadId: body.leadId || `lead-${Date.now()}`,
      leadName: body.leadName,
      leadPhone: body.leadPhone,
      projectId: body.projectId,
      projectName: body.projectName,
      propertyId: body.propertyId,
      propertyTitle: body.propertyTitle,
      partnerId: body.partnerId,
      partnerCode: body.partnerCode,
      salesExecutive: body.salesExecutive || 'Rohan Mehra (Site Manager)',
      visitDate: body.visitDate,
      visitTime: body.visitTime,
      notes: body.notes,
    });

    return NextResponse.json(
      { success: true, message: 'Site visit scheduled successfully!', data: created },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to schedule site visit' } },
      { status: 500 }
    );
  }
}
