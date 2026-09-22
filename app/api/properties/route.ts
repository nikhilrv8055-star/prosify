import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data/service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || undefined;
    const propertyType = searchParams.get('type') || undefined;
    const listingType = searchParams.get('listingType') || undefined;
    const bhk = searchParams.get('bhk') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const possessionStatus = searchParams.get('possession') || undefined;
    const verifiedOnly = searchParams.get('verified') === 'true';
    const searchQuery = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;

    const properties = await dataService.getProperties({
      city,
      propertyType,
      listingType,
      bhk,
      minPrice,
      maxPrice,
      possessionStatus,
      verifiedOnly,
      searchQuery,
      sort,
    });

    return NextResponse.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    console.error('API Error in GET /api/properties:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.price || !body.city) {
      return NextResponse.json({ success: false, error: 'Title, price and city are required' }, { status: 400 });
    }

    const newProperty = await dataService.createProperty(body);
    return NextResponse.json({ success: true, data: newProperty }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/properties:', error);
    return NextResponse.json({ success: false, error: 'Failed to create property' }, { status: 500 });
  }
}
