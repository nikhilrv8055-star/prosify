import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const credential = store.getDeveloperApiCredentialById(id);
  if (!credential) {
    return NextResponse.json({ success: false, error: 'Credential not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: credential });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = store.updateDeveloperApiCredential(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Credential not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
