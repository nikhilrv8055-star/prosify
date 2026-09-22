import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId') || undefined;
  const tower = searchParams.get('tower') || undefined;

  const units = store.getUnits(projectId, tower);
  return NextResponse.json({ success: true, count: units.length, data: units });
}
