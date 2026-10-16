import { NextResponse } from 'next/server';
import { VENDOR_COOKIE_NAME } from '@/lib/auth/rbacSession';

export async function POST() {
  const res = NextResponse.json({ success: true, redirect: '/vendor/login' });
  res.cookies.set(VENDOR_COOKIE_NAME, '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
  return res;
}
