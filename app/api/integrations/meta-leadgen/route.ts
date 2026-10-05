import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

// Meta Webhook Verification Token (configured in Meta Business App dashboard)
const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'prosify_meta_leadgen_secure_token_2026';

/**
 * GET Handler: Meta Webhook Endpoint Verification Handshake
 * Meta sends hub.mode, hub.verify_token, and hub.challenge to verify ownership
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[Meta LeadGen Webhook] Verified successfully.');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification token mismatch' }, { status: 403 });
}

/**
 * POST Handler: Inbound Meta Native Instant Form Lead Ingestion
 * Handles payload with pre-filled user contact details and pre-qualifying friction answers
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if this is a lead simulation or direct client submission
    const {
      leadgen_id,
      form_id,
      page_id,
      fullName,
      phone,
      email,
      budgetRange,
      timeline,
      purpose,
      financingStatus,
      projectTitle = 'Godrej Riviera - Waterfront Luxury Towers',
      city = 'Mumbai NCR',
    } = body;

    const leadName = fullName || body.full_name || 'Meta Ad Prospect';
    const leadPhone = phone || body.phone_number || '+91 98201 12345';
    const leadEmail = email || body.email || 'prospect@meta.in';
    const leadBudget = budgetRange || body.preferred_budget || '₹1 Cr - ₹2 Cr';
    const leadTimeline = timeline || body.purchase_timeline || '1 - 3 Months';
    const leadPurpose = purpose || body.purchase_purpose || 'Family Residence';
    const leadFinancing = financingStatus || body.financing_status || 'Pre-Approved';

    // Calculate qualification intent score based on friction filter answers
    let score = 55;
    if (leadTimeline.includes('Immediate') || leadTimeline.includes('30 Days')) score += 30;
    else if (leadTimeline.includes('1 - 3 Months')) score += 20;
    else if (leadTimeline.includes('3 - 6 Months')) score += 10;

    if (leadFinancing.includes('Pre-Approved') || leadFinancing.includes('Self-Funded') || leadFinancing.includes('Ready Cash')) score += 15;

    const qualification = score >= 80 ? 'HOT' : score >= 60 ? 'WARM' : 'COLD';
    const frictionNotes = `[Meta Instant Form Webhook]: LeadGen ID: ${leadgen_id || 'META-' + Date.now()} | Budget: ${leadBudget} | Timeline: ${leadTimeline} | Purpose: ${leadPurpose} | Finance: ${leadFinancing}`;

    // Ingest into real-time store
    const createdLead = store.createLead({
      name: leadName,
      phone: leadPhone,
      email: leadEmail,
      source: 'META_ADS',
      budget: leadBudget,
      location: city,
      propertyTitle: projectTitle,
      notes: frictionNotes,
      status: 'NEW',
      leadScore: score,
      qualification,
    });

    return NextResponse.json({
      success: true,
      message: 'Meta Lead Ingested & Qualified Successfully',
      leadId: createdLead.id,
      leadScore: score,
      qualification,
      frictionFilterPassed: true,
      instantFormId: form_id || 'FORM-INSTANT-01',
    });
  } catch (error: any) {
    console.error('[Meta LeadGen Webhook Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process Meta Lead' },
      { status: 500 }
    );
  }
}
