import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { LeadSourceType, LeadStatus } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const leads = store.getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve leads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      mobile,
      email,
      propertyId,
      propertyTitle,
      budget,
      location,
      requirement,
      propertyType,
      bhk,
      purpose,
      source = 'WEBSITE_FORM',
      partnerId,
      partnerName,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    if (!name || !mobile) {
      return NextResponse.json(
        { success: false, error: 'Name and mobile number are required' },
        { status: 400 }
      );
    }

    const lead = store.createLead({
      name,
      mobile,
      email,
      propertyId,
      propertyTitle,
      budget,
      location,
      requirement,
      propertyType,
      bhk,
      purpose: purpose || 'Buy',
      source: source as LeadSourceType,
      partnerId,
      partnerName,
      utmSource,
      utmMedium,
      utmCampaign,
      status: 'NEW',
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error processing lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Lead ID and status are required' },
        { status: 400 }
      );
    }

    const updated = store.updateLeadStatus(id, status as LeadStatus);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update lead status' },
      { status: 500 }
    );
  }
}
