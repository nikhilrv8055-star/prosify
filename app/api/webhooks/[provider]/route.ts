import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import crypto from 'crypto';
import { applyRateLimit } from '@/lib/security/rateLimit';

// Cache for idempotency keys to prevent duplicate leads within 24 hours
const processedIdempotencyKeys = new Set<string>();

/**
 * Validates HMAC SHA-256 signature using constant-time comparison to prevent timing attacks.
 */
function verifyHmacSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader || !secret) return false;

  try {
    const cleanSignature = signatureHeader.startsWith('sha256=')
      ? signatureHeader.substring(7)
      : signatureHeader;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (cleanSignature.length !== expectedSignature.length) {
      return false;
    }

    return crypto.timingSafeEqual(
      Buffer.from(cleanSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (err) {
    console.error('HMAC verification error:', err);
    return false;
  }
}

/**
 * GET Handler for Meta (Facebook / Instagram / WhatsApp) Webhook Subscription Verification
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const providerUpper = provider.toUpperCase();

  if (providerUpper === 'META' || providerUpper === 'WHATSAPP') {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const expectedSecret = process.env.META_WEBHOOK_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'META_WEBHOOK_SECRET is not configured on the server' },
        { status: 500 }
      );
    }

    if (mode === 'subscribe' && token === expectedSecret) {
      return new Response(challenge || 'VERIFIED', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Verification token mismatch or invalid mode' },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { success: true, message: `Webhook endpoint active for provider: ${providerUpper}` },
    { status: 200 }
  );
}

/**
 * POST Handler for Inbound Webhooks
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  // Rate limiting (100 req/min for webhooks)
  const rateLimitResponse = applyRateLimit(req, { limit: 100, windowMs: 60 * 1000 }, 'webhooks');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { provider } = await params;
    const providerUpper = provider.toUpperCase();

    const signature =
      req.headers.get('x-hub-signature-256') ||
      req.headers.get('x-webhook-signature') ||
      req.headers.get('x-signature');

    const idempotencyKey =
      req.headers.get('x-idempotency-key') ||
      req.headers.get('idempotency-key');

    // Check idempotency cache
    if (idempotencyKey && processedIdempotencyKeys.has(idempotencyKey)) {
      return NextResponse.json(
        { success: true, message: 'Event already processed (idempotent duplicate skipped)' },
        { status: 200 }
      );
    }

    const rawBodyText = await req.text();
    let payload: any;
    try {
      payload = JSON.parse(rawBodyText);
    } catch {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_JSON', message: 'Payload must be valid JSON' } },
        { status: 400 }
      );
    }

    // Optional cryptographic verification if provider secret is configured
    const providerSecret =
      providerUpper === 'META'
        ? process.env.META_WEBHOOK_SECRET
        : providerUpper === 'GOOGLE'
        ? process.env.GOOGLE_WEBHOOK_SECRET
        : process.env[`${providerUpper}_WEBHOOK_SECRET`];

    let signatureValid = true;
    if (providerSecret && signature) {
      signatureValid = verifyHmacSignature(rawBodyText, signature, providerSecret);
      if (!signatureValid) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_SIGNATURE',
              message: 'HMAC signature verification failed. Unauthorized webhook dispatch.',
            },
          },
          { status: 401 }
        );
      }
    }

    // Map lead fields according to provider adapter schema
    let leadData: any = null;

    if (providerUpper === 'META') {
      leadData = {
        name: payload.full_name || payload.name || 'Meta Ad Lead',
        phone: payload.phone_number || payload.phone || '+91 99999 00000',
        email: payload.email || '',
        source: 'FACEBOOK',
        budget: payload.budget || '₹50 Lakh - ₹1 Cr',
        requirement: payload.requirement || 'Enquiry via Instagram/Facebook Lead Ad',
        location: payload.city || 'Mumbai MMR',
        utmSource: 'facebook_lead_ad',
        utmCampaign: payload.campaign_name || 'meta_campaign',
      };
    } else if (providerUpper === 'GOOGLE') {
      leadData = {
        name: payload.lead_name || payload.name || 'Google Ads Lead',
        phone: payload.phone || '+91 99999 00000',
        email: payload.email || '',
        source: 'GOOGLE',
        budget: payload.budget || 'Flexible',
        requirement: payload.requirement || 'Google Search Ad Lead Extension',
        location: payload.location || 'Maharashtra',
        utmSource: 'google_cpc',
      };
    } else if (providerUpper === 'REALATIC') {
      // Realatic CRM Inbound Mapping (Build Pack v1.0 Isolation Layer)
      leadData = {
        name: payload.contact_name || payload.first_name || payload.name || 'Realatic CRM Lead',
        phone: payload.mobile_number || payload.phone || '+91 99999 00000',
        email: payload.email || '',
        source: 'REALATIC_CRM',
        budget: payload.budget_max ? `₹${payload.budget_max}` : (payload.budget || '₹1.25 Cr - ₹2.5 Cr'),
        requirement: payload.requirement || `Realatic Lead Stage: ${payload.lead_stage || 'NEW'}`,
        location: payload.preferred_location || payload.location || 'Mumbai MMR',
        utmSource: 'realatic_crm_sync',
        realaticCrmLeadId: payload.lead_id || payload.external_lead_id,
      };
    } else {
      // Syndication Portals / Custom CRM Ingress
      leadData = {
        name: payload.name || `${providerUpper} Inbound Lead`,
        phone: payload.phone || '+91 99999 00000',
        email: payload.email || '',
        source: 'PROPERTY_PORTAL',
        budget: payload.budget || 'Enquiry',
        requirement: payload.requirement || `Inquiry routed via ${providerUpper}`,
        location: payload.location || 'Maharashtra',
      };
    }

    if (idempotencyKey) {
      processedIdempotencyKeys.add(idempotencyKey);
    }

    // Idempotent lead handling: update if existing phone exists, else create new
    const existingLead = store.getLeads().find((l) => l.phone && l.phone === leadData.phone);
    let targetLeadId: string;

    if (existingLead) {
      existingLead.updatedAt = new Date().toISOString();
      if (leadData.budget) existingLead.budget = leadData.budget;
      if (leadData.location) existingLead.location = leadData.location;
      if (leadData.realaticCrmLeadId) existingLead.realaticLeadId = leadData.realaticCrmLeadId;
      existingLead.notes = `${existingLead.notes || ''} | Re-engaged via ${providerUpper}`;
      targetLeadId = existingLead.id;

      store.addAuditLog(
        'WEBHOOK_INGESTION_UPDATE',
        'Integration',
        `Existing lead updated via ${providerUpper} webhook: ${existingLead.name} (${existingLead.phone})`,
        existingLead.id
      );
    } else {
      const newLead = store.createLead({
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        source: leadData.source as any,
        budget: leadData.budget,
        requirement: leadData.requirement,
        location: leadData.location,
        notes: `Webhook ingested via ${providerUpper} (Signature Verified: ${Boolean(signature && signatureValid)})`,
        utmSource: leadData.utmSource,
        utmCampaign: leadData.utmCampaign,
      });
      targetLeadId = newLead.id;

      store.addAuditLog(
        'WEBHOOK_INGESTION',
        'Integration',
        `Lead received via ${providerUpper} webhook: ${newLead.name} (${newLead.phone})`,
        newLead.id
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Webhook received and lead attributed successfully from ${providerUpper}`,
        leadId: targetLeadId,
        isDuplicateUpdated: Boolean(existingLead),
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'WEBHOOK_ERROR', message: err.message || 'Failed to process webhook' },
      },
      { status: 500 }
    );
  }
}
