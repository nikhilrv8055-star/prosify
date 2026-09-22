import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data/service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const unit = await dataService.getUnitById(id);
    if (!unit) {
      return NextResponse.json({ success: false, error: 'Unit not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: unit });
  } catch (error) {
    console.error('API Error in GET /api/inventory/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch unit' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await dataService.updateUnit(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Unit not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API Error in PATCH /api/inventory/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to update unit' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await dataService.deleteUnit(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Unit not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Unit status set to BLOCKED' });
  } catch (error) {
    console.error('API Error in DELETE /api/inventory/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete unit' }, { status: 500 });
  }
}
