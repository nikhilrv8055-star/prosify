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
      const updated = store.updateSiteVisitStatus(id, body.status, body.notes);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Site visit not found' } },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'Status required' } },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Could not update site visit' } },
      { status: 500 }
    );
  }
}
