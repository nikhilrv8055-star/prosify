import { NextRequest, NextResponse } from 'next/server';
import { rbacStore } from '@/lib/auth/rbacStore';
import {
  checkBruteForceLimit,
  recordFailedLogin,
  resetLoginAttempts,
  createSessionPayload,
  encodeSessionCookie,
  AGENT_COOKIE_NAME,
} from '@/lib/auth/rbacSession';

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      '127.0.0.1';

    // 1. Brute-Force Rate Limiting Check
    const rateCheck = checkBruteForceLimit(ip, 'agent');
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
        { success: false, error: 'Please enter your Agent ID or Email and password.' },
        { status: 400 }
      );
    }

    // 2. Lookup user in RBAC store
    const user = rbacStore.findUserByLogin(identifier);

    // Verify role is AGENT (or ADMIN)
    if (!user || (user.role !== 'AGENT' && user.role !== 'ADMIN')) {
      recordFailedLogin(ip, 'agent');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Agent credentials. Please check your Agent ID and password.',
        },
        { status: 401 }
      );
    }

    // Check account status
    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        {
          success: false,
          error: 'Your Agent account has been deactivated by Administration. Please contact agency-head@prosify.in.',
        },
        { status: 403 }
      );
    }

    // Verify password
    if (user.passwordHash !== password.trim()) {
      recordFailedLogin(ip, 'agent');
      return NextResponse.json(
        { success: false, error: 'Invalid password. Please check and try again.' },
        { status: 401 }
      );
    }

    // Login successful
    resetLoginAttempts(ip, 'agent');
    rbacStore.recordLogin(user.id, ip);

    // Create session cookie
    const sessionPayload = createSessionPayload(user);
    const encoded = encodeSessionCookie(sessionPayload);

    const res = NextResponse.json({
      success: true,
      message: `Welcome back, Agent ${user.name}!`,
      requirePasswordChange: user.requirePasswordChangeOnFirstLogin,
      user: {
        id: user.id,
        secureId: user.secureId,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        agentProfile: user.agentProfile,
      },
      redirect: '/agent/dashboard',
    });

    // Set cookie on response
    res.cookies.set(AGENT_COOKIE_NAME, encoded, {
      path: '/',
      httpOnly: false,
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
