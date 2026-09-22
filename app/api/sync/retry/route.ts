import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'jobId is required' } },
        { status: 400 }
      );
    }

    const result = store.retrySyncJob(jobId);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: 'RETRY_FAILED', message: result.error || 'Retry attempt failed' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Job ${jobId} successfully retried`,
      data: result.job,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err?.message || 'Error processing retry' } },
      { status: 500 }
    );
  }
}
