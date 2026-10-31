import { NextRequest, NextResponse } from 'next/server';
import { serverAdminStaffDb } from '@/lib/data/serverAdminStaffDb';
import { NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { loginId, password } = body;

    if (!loginId || !loginId.trim()) {
      return createErrorResponse('BAD_REQUEST', 'Login ID or Email is required.', 400);
    }

    if (!password) {
      return createErrorResponse('BAD_REQUEST', 'Password is required.', 400);
    }

    const authResult = serverAdminStaffDb.authenticate(loginId, password);

    if (!authResult.success || !authResult.account) {
      return createErrorResponse('BAD_REQUEST', authResult.error || 'Invalid credentials.', 401);
    }

    const { id, name, username, email, role, roleTitle, allowedGroups, isRoot } = authResult.account;
    const sessionToken = `prosify_adm_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    return NextResponse.json(
      {
        success: true,
        message: `Welcome, ${name}! Logged in as ${roleTitle}.`,
        token: sessionToken,
        user: {
          id,
          name,
          username,
          email,
          role,
          roleTitle,
          allowedGroups,
          isRoot: Boolean(isRoot),
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Authentication error', 500);
  }
}
