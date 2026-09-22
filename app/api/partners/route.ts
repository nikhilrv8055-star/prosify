import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { z } from 'zod';

const registerPartnerSchema = z.object({
  companyName: z.string().min(2),
  partnerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  panNumber: z.string().min(10),
  gstNumber: z.string().optional(),
  reraNumber: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
});

export async function GET() {
  const partners = store.getChannelPartners();
  return NextResponse.json({ success: true, count: partners.length, data: partners });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerPartnerSchema.safeParse(body);

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
    return NextResponse.json(
      {
        success: true,
        message: 'Partner registration submitted! Status is PENDING admin verification.',
        data: created,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to register partner' } },
      { status: 500 }
    );
  }
}
