import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const partnerId = searchParams.get('partnerId') || undefined;
  const bookings = store.getBookings(partnerId);
  return NextResponse.json({ success: true, count: bookings.length, data: bookings });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerName || !body.customerPhone || !body.unitNumber || !body.totalAgreementValue) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing booking fields' } },
        { status: 400 }
      );
    }

    const created = store.createBooking({
      leadId: body.leadId || `lead-${Date.now()}`,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      projectId: body.projectId,
      projectName: body.projectName,
      propertyId: body.propertyId,
      propertyTitle: body.propertyTitle,
      unitNumber: body.unitNumber,
      partnerId: body.partnerId,
      partnerCode: body.partnerCode,
      partnerName: body.partnerName,
      bookingDate: body.bookingDate || new Date().toISOString().split('T')[0],
      bookingAmount: Number(body.bookingAmount) || 100000,
      totalAgreementValue: Number(body.totalAgreementValue),
      ratePercent: Number(body.ratePercent) || 2.0,
      status: body.status || 'CONFIRMED',
    });

    return NextResponse.json(
      { success: true, message: 'Booking confirmed and commission ledger updated', data: created },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to record booking' } },
      { status: 500 }
    );
  }
}
