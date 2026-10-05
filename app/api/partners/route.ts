import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { z } from 'zod';
import { getServerUser } from '@/lib/auth/serverAuth';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { sanitizeUserInput } from '@/lib/security/sanitizer';
import { recordAuditEvent } from '@/lib/security/auditLog';

const registerPartnerSchema = z.object({
  companyName: z.string().min(2).max(100),
  partnerName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[0-9+() -]{10,20}$/, 'Invalid phone number format'),
  address: z.string().min(5).max(300),
  panNumber: z.string().min(10).max(10),
  gstNumber: z.string().max(20).optional(),
  reraNumber: z.string().max(50).optional(),
  bankName: z.string().max(100).optional(),
  accountNumber: z.string().max(30).optional(),
  ifscCode: z.string().max(20).optional(),
});

export async function GET(req: NextRequest) {
  const user = getServerUser(req);
  const partners = store.getChannelPartners();

  // If user is Privileged Admin or Finance, return full details
  if (user && ['SUPER_ADMIN', 'ADMIN', 'FINANCE'].includes(user.role)) {
    return NextResponse.json({ success: true, count: partners.length, data: partners });
  }

  // If user is Channel Partner, return only their own record
  if (user && user.role === 'CHANNEL_PARTNER') {
    const own = partners.filter((p) => p.code === user.partnerCode || p.email === user.email);
    return NextResponse.json({ success: true, count: own.length, data: own });
  }

  // For public directory, mask sensitive financial PII (PAN, Account Number, IFSC)
  const sanitized = partners.map((p) => ({
    id: p.id,
    companyName: p.companyName,
    partnerName: p.partnerName,
    city: p.city || 'Mumbai',
    reraNumber: p.reraNumber,
    status: p.status,
    totalBookings: p.totalBookings,
    tier: p.tier || 'Silver',
  }));

  return NextResponse.json({ success: true, count: sanitized.length, data: sanitized });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate limiting (10 partner registrations per hour per IP)
  const rateLimitResponse = applyRateLimit(
    req,
    { limit: 10, windowMs: 60 * 60 * 1000 },
    'partner_registration'
  );
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawBody = await req.json();

    const sanitizedData = {
      ...rawBody,
      companyName: sanitizeUserInput(rawBody.companyName || ''),
      partnerName: sanitizeUserInput(rawBody.partnerName || ''),
      address: sanitizeUserInput(rawBody.address || ''),
    };

    const validated = registerPartnerSchema.safeParse(sanitizedData);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid registration details',
            details: validated.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const created = store.createChannelPartner(validated.data);

    recordAuditEvent({
      action: 'AUTH_REGISTER',
      resource: `/api/partners/${created.id}`,
      resourceId: created.id,
      status: 'SUCCESS',
      details: `New partner application registered: ${created.companyName}`,
      ipAddress: ip,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Partner registration submitted! Status is PENDING admin verification.',
        data: created,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('Error registering partner:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to register partner' } },
      { status: 500 }
    );
  }
}
