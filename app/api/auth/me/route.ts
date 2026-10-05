import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth/serverAuth';

export async function GET(req: NextRequest) {
  const user = getServerUser(req);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'No active authenticated session found.',
        },
        user: null,
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user,
  });
}
