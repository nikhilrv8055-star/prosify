import { NextRequest, NextResponse } from 'next/server';
import { rbacStore } from '@/lib/auth/rbacStore';
import {
  checkBruteForceLimit,
  recordFailedLogin,
  resetLoginAttempts,
  createSessionPayload,
  encodeSessionCookie,
  VENDOR_COOKIE_NAME,
} from '@/lib/auth/rbacSession';

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      '127.0.0.1';

    // 1. Brute-Force Rate Limiting Check
    const rateCheck = checkBruteForceLimit(ip, 'vendor');
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Please wait ${rateCheck.waitSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Please enter your Vendor ID or Email and password.' },
        { status: 400 }
      );
    }

    // 2. Lookup user in RBAC store
    const user = rbacStore.findUserByLogin(identifier);

    // Verify role is VENDOR (or ADMIN)
    if (!user || (user.role !== 'VENDOR' && user.role !== 'ADMIN')) {
      recordFailedLogin(ip, 'vendor');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Vendor credentials. Please check your Vendor ID and password.',
        },
        { status: 401 }
      );
    }

    // Check account status
    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        {
          success: false,
          error: 'Your Vendor account has been suspended by Administration. Please contact partner-support@prosify.in.',
        },
        { status: 403 }
      );
    }

    // Verify password
    const enteredPass = password.trim();
    const isPasswordValid =
      (user.passwordHash && user.passwordHash === enteredPass) ||
      (user.password && user.password === enteredPass);

    if (!isPasswordValid) {
      recordFailedLogin(ip, 'vendor');
      return NextResponse.json(
        { success: false, error: 'Invalid password. Please check and try again.' },
        { status: 401 }
      );
    }

    // Login successful
    resetLoginAttempts(ip, 'vendor');
    rbacStore.recordLogin(user.id, ip);

    // Create session cookie
    const sessionPayload = createSessionPayload(user);
    const encoded = encodeSessionCookie(sessionPayload);

    const res = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      requirePasswordChange: user.requirePasswordChangeOnFirstLogin,
      user: {
        id: user.id,
        secureId: user.secureId,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        vendorProfile: user.vendorProfile,
      },
      redirect: '/vendor/dashboard',
    });

    // Set cookie on response
    res.cookies.set(VENDOR_COOKIE_NAME, encoded, {
      path: '/',
      httpOnly: false, // Accessible by client and middleware
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
