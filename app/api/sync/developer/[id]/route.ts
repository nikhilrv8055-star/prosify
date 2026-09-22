import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let simulateError = false;
    try {
      const body = await req.json();
      simulateError = Boolean(body?.simulateError);
    } catch {
      // body empty or non-JSON is ok
    }

    const job = store.runSyncJob(id, simulateError);
    return NextResponse.json({
      success: true,
      message: `Sync initiated successfully for source ${id}`,
      data: job,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SYNC_FAILED', message: err?.message || 'Failed to run sync job' } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = store.updateSyncSource(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Sync source not found' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: err?.message || 'Failed to update sync source' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = store.deleteSyncSource(id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_FAILED', message: err?.message || 'Failed to delete sync source' } },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sources = store.getSyncSources();
  const source = sources.find((s) => s.id === id);
  const jobs = store.getSyncJobs().filter((j) => j.sourceId === id);
  return NextResponse.json({ success: true, source, jobs });
}
