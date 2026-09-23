import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || undefined;
    const type = searchParams.get('type') || undefined;
    const q = searchParams.get('q') || undefined;

    const properties = store.getProperties({
      city: city === 'ALL' ? undefined : city,
      listingType: (type === 'ALL' || !type) ? undefined : (type as any),
      query: q,
    });

    return NextResponse.json({ success: true, count: properties.length, properties });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
