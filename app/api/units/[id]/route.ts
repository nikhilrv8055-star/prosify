import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (body.status) {
      const updated = store.updateUnitStatus(id, body.status);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Unit not found' } },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'Status is required' } },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update unit' } },
      { status: 500 }
    );
  }
}
