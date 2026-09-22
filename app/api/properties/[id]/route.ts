import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data/service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = (await dataService.getPropertyById(id)) || (await dataService.getPropertyBySlug(id));
    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error('API Error in GET /api/properties/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await dataService.updateProperty(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API Error in PUT /api/properties/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await dataService.deleteProperty(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('API Error in DELETE /api/properties/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete property' }, { status: 500 });
  }
}
