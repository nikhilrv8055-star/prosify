import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'id and updates are required' } },
        { status: 400 }
      );
    }

    const updated = store.updateIntegration(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Adapter not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: err?.message || 'Failed to update adapter' } },
      { status: 500 }
    );
  }
}
