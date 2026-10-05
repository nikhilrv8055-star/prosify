import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { z } from 'zod';
import { getServerUser } from '@/lib/auth/serverAuth';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { sanitizeUserInput } from '@/lib/security/sanitizer';
import { recordAuditEvent } from '@/lib/security/auditLog';

const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^[0-9+() -]{10,20}$/, 'Phone must be a valid contact number'),
  email: z.string().email().optional().or(z.literal('')),
  source: z.enum([
    'WEBSITE',
    'DIRECT_WEBSITE',
    'BUY_REQUIREMENT',
    'PROPERTY_REQUIREMENT',
    'PROMATCH',
    'CHANNEL_PARTNER',
    'FACEBOOK',
    'META_ADS',
    'GOOGLE',
    'GOOGLE_ADS',
    'PROPERTY_PORTAL',
    'SYNDICATION',
    'API',
    'MANUAL',
    'OTHER',
    'WHATSAPP',
    'NINETY_NINE_ACRES',
    'MAGICBRICKS',
    'HOUSING',
  ]).default('WEBSITE'),
  propertyId: z.string().max(100).optional(),
  propertyTitle: z.string().max(200).optional(),
  projectId: z.string().max(100).optional(),
  projectName: z.string().max(200).optional(),
  developerName: z.string().max(200).optional(),
  partnerId: z.string().max(100).optional(),
  partnerCode: z.string().max(50).optional(),
  partnerName: z.string().max(100).optional(),
  propertyType: z.string().max(50).optional(),
  bhk: z.string().max(50).optional(),
  purpose: z.string().max(50).optional(),
  budget: z.string().max(100).optional(),
  requirement: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  preferredLocations: z.array(z.string().max(100)).max(10).optional(),
  notes: z.string().max(1000).optional(),
  hasBrochureDownload: z.boolean().optional(),
  hasWhatsappEngagement: z.boolean().optional(),
  hasSiteVisitRequest: z.boolean().optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
});

export async function GET(req: NextRequest) {
  // Rate limiting (120 req/min for leads get)
  const rateLimitResponse = applyRateLimit(req, { limit: 120, windowMs: 60 * 1000 }, 'leads_get');
  if (rateLimitResponse) return rateLimitResponse;

  // Verify auth session for leads access
  const user = getServerUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required to view leads' } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  let partnerId = searchParams.get('partnerId') || undefined;
  const status = (searchParams.get('status') as any) || undefined;
  const search = searchParams.get('q') || undefined;
  const source = searchParams.get('source') || undefined;

  // Strict RBAC & Resource Scoping (Prevent IDOR)
  if (user.role === 'CHANNEL_PARTNER') {
    const partner = user.partnerCode ? store.getPartnerByCode(user.partnerCode) : null;
    partnerId = partner?.id || 'NO_ACCESS';
  } else if (user.role === 'SALES_AGENT' || user.role === 'SALES_EXECUTIVE') {
    // Sales agents only get assigned leads
    const allLeads = store.getLeads({ status, search, source });
    const assigned = allLeads.filter(
      (l) => l.assignedTo?.toLowerCase().includes(user.name.toLowerCase()) || l.assignedTo === user.id
    );
    return NextResponse.json({ success: true, count: assigned.length, data: assigned });
  } else if (!['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'MARKETING_MANAGER'].includes(user.role)) {
    // Customers or other unauthorized roles cannot view CRM leads
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to view CRM leads.' } },
      { status: 403 }
    );
  }

  const leads = store.getLeads({ partnerId, status, search, source });
  return NextResponse.json({ success: true, count: leads.length, data: leads });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate limiting (20 submissions per minute per IP to prevent lead injection spam)
  const rateLimitResponse = applyRateLimit(req, { limit: 20, windowMs: 60 * 1000 }, 'leads_submit');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawBody = await req.json();

    // Check for partner attribution in cookie or body
    let partnerId = rawBody.partnerId;
    let partnerCode = rawBody.partnerCode;
    let partnerName = rawBody.partnerName;

    // Check cookie fallback if partner was set in session
    const partnerCookie = req.cookies.get('prosify_partner_ref')?.value || req.cookies.get('swarna_partner_ref')?.value;
    if (!partnerId && partnerCookie) {
      const partner = store.getPartnerByCode(partnerCookie);
      if (partner) {
        partnerId = partner.id;
        partnerCode = partner.code;
        partnerName = partner.companyName;
      }
    } else if (partnerCode && !partnerId) {
      const partner = store.getPartnerByCode(partnerCode);
      if (partner) {
        partnerId = partner.id;
        partnerName = partner.companyName;
      }
    }

    const validated = createLeadSchema.safeParse({
      ...rawBody,
      name: sanitizeUserInput(rawBody.name || ''),
      notes: rawBody.notes ? sanitizeUserInput(rawBody.notes) : undefined,
      requirement: rawBody.requirement ? sanitizeUserInput(rawBody.requirement) : undefined,
      partnerId,
      partnerCode,
      partnerName,
      source: partnerId ? 'CHANNEL_PARTNER' : rawBody.source || 'WEBSITE',
    });

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Please provide valid contact information (Name & 10-digit Phone)',
            details: validated.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const newLead = store.createLead({
      name: validated.data.name,
      phone: validated.data.phone,
      email: validated.data.email || '',
      source: validated.data.source,
      propertyId: validated.data.propertyId,
      propertyTitle: validated.data.propertyTitle,
      projectId: validated.data.projectId,
      projectName: validated.data.projectName,
      developerName: validated.data.developerName,
      partnerId: validated.data.partnerId,
      partnerCode: validated.data.partnerCode,
      partnerName: validated.data.partnerName,
      propertyType: validated.data.propertyType,
      bhk: validated.data.bhk,
      purpose: validated.data.purpose || 'Buy',
      budget: validated.data.budget || 'Flexible',
      requirement: validated.data.requirement || 'General Enquiry',
      location: validated.data.location || 'Maharashtra',
      preferredLocations: validated.data.preferredLocations,
      notes: validated.data.notes,
      hasBrochureDownload: validated.data.hasBrochureDownload,
      hasWhatsappEngagement: validated.data.hasWhatsappEngagement,
      hasSiteVisitRequest: validated.data.hasSiteVisitRequest,
      utmSource: validated.data.utmSource,
      utmMedium: validated.data.utmMedium,
      utmCampaign: validated.data.utmCampaign,
      assignedTo: 'Amit Sharma (Senior Relationship Mgr)',
    });

    recordAuditEvent({
      action: 'LEAD_CREATE',
      resource: `/api/leads/${newLead.id}`,
      resourceId: newLead.id,
      status: 'SUCCESS',
      details: `Inbound lead created from ${newLead.source}`,
      ipAddress: ip,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          newLead.qualification === 'HOT'
            ? 'Priority inquiry received! A senior property director has been assigned.'
            : 'Enquiry received! Our property specialist will contact you shortly.',
        data: newLead,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('Error creating lead:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to submit enquiry' } },
      { status: 500 }
    );
  }
}
