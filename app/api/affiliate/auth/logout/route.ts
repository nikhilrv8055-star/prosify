import { NextResponse } from 'next/server';

export const AFFILIATE_COOKIE_NAME = 'prosify_affiliate_session';

export async function POST() {
  const res = NextResponse.json({
    success: true,
    message: 'Logged out successfully.',
  });

  res.cookies.set(AFFILIATE_COOKIE_NAME, '', {
    path: '/',
    expires: new Date(0),
  });

  return res;
}
