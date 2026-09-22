import { NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function POST() {
  store.clearSyncLogs();
  return NextResponse.json({ success: true, message: 'Sync logs cleared' });
}
