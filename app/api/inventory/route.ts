import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data/service';
import { UnitStatus } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId') || undefined;
    const tower = searchParams.get('tower') || undefined;
    const status = (searchParams.get('status') as UnitStatus) || undefined;
    const isHierarchy = searchParams.get('hierarchy') === 'true';

    if (isHierarchy && projectId) {
      const hierarchy = await dataService.getInventoryHierarchy(projectId);
      return NextResponse.json({ success: true, data: hierarchy });
    }

    const units = await dataService.getUnits(projectId, tower, status);
    return NextResponse.json({ success: true, count: units.length, data: units });
  } catch (error) {
    console.error('API Error in GET /api/inventory:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch inventory units' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.projectId || !body.tower || !body.unitNumber || !body.price) {
      return NextResponse.json({
        success: false,
        error: 'projectId, tower, unitNumber and price are required',
      }, { status: 400 });
    }

    const newUnit = await dataService.createUnit({
      projectId: body.projectId,
      tower: body.tower,
      floor: Number(body.floor) || 1,
      unitNumber: body.unitNumber,
      bhk: body.bhk || '2 BHK',
      configuration: body.configuration || '2 BHK Luxury',
      carpetArea: Number(body.carpetArea) || 750,
      builtUpArea: Number(body.builtUpArea) || 980,
      balconyArea: body.balconyArea ? Number(body.balconyArea) : 65,
      price: Number(body.price),
      parking: body.parking || '1 Covered',
      facing: body.facing || 'East',
      status: (body.status as UnitStatus) || 'AVAILABLE',
      possession: body.possession || 'Ready to Move',
    });

    return NextResponse.json({ success: true, data: newUnit }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/inventory:', error);
    return NextResponse.json({ success: false, error: 'Failed to create inventory unit' }, { status: 500 });
  }
}
