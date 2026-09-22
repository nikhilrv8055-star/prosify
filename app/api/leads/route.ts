import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { z } from 'zod';
import { getServerUser } from '@/lib/auth/serverAuth';
import { applyRateLimit } from '@/lib/security/rateLimit';

const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be a valid 10-digit number'),
  email: z.string().email().optional().or(z.literal('')),
  source: z.enum([
    'WEBSITE',
    'DIRECT_WEBSITE',
    'CHANNEL_PARTNER',
    'FACEBOOK',
    'GOOGLE',
    'PROPERTY_PORTAL',
    'SYNDICATION',
    'API',
    'MANUAL',
    'OTHER',
    'NINETY_NINE_ACRES',
    'MAGICBRICKS',
    'HOUSING',
  ]).default('WEBSITE'),
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  developerName: z.string().optional(),
  partnerId: z.string().optional(),
  partnerCode: z.string().optional(),
  partnerName: z.string().optional(),
  budget: z.string().optional(),
  requirement: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export async function GET(req: NextRequest) {
  // Rate limiting
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

  // Channel Partner can only view leads attributed to their own partnerCode/partnerId
  if (user.role === 'CHANNEL_PARTNER') {
    const partner = user.partnerCode ? store.getPartnerByCode(user.partnerCode) : null;
    partnerId = partner?.id || 'NO_ACCESS';
  }

  const leads = store.getLeads({ partnerId, status, search, source });
  return NextResponse.json({ success: true, count: leads.length, data: leads });
}

export async function POST(req: NextRequest) {
  // Rate limiting (20 submissions per minute per IP to prevent spam)
  const rateLimitResponse = applyRateLimit(req, { limit: 20, windowMs: 60 * 1000 }, 'leads_submit');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();

    // Check for partner attribution in cookie or body
    let partnerId = body.partnerId;
    let partnerCode = body.partnerCode;
    let partnerName = body.partnerName;

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
      ...body,
      partnerId,
      partnerCode,
      partnerName,
      source: partnerId ? 'CHANNEL_PARTNER' : body.source || 'WEBSITE',
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
      budget: validated.data.budget || 'Flexible',
      requirement: validated.data.requirement || 'General Enquiry',
      location: validated.data.location || 'Maharashtra',
      notes: validated.data.notes,
      utmSource: validated.data.utmSource,
      utmMedium: validated.data.utmMedium,
      utmCampaign: validated.data.utmCampaign,
      assignedTo: 'Amit Sharma (Sales Mgr)',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Enquiry received! Our property specialist will contact you shortly.',
        data: newLead,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to submit enquiry' } },
      { status: 500 }
    );
  }
}
