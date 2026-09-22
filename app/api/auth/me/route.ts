import { NextResponse } from 'next/server';
import { DEMO_USERS } from '@/lib/auth/types';

export async function GET() {
  return NextResponse.json({
    user: DEMO_USERS.SUPER_ADMIN,
  });
}
