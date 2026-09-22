import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET() {
  const weights = store.getMatchingWeights();
  return NextResponse.json({ success: true, weights });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updatedWeights = store.updateMatchingWeights(body);
    return NextResponse.json({ success: true, weights: updatedWeights });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update matching weights' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const criteria = await req.json();
    const matches = store.calculateMatches(criteria);
    return NextResponse.json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to calculate matches' } },
      { status: 500 }
    );
  }
}
