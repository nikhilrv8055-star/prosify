import { NextRequest, NextResponse } from 'next/server';
import { DEMO_USERS, UserRole, ROLE_PERMISSIONS } from '@/lib/auth/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role, password } = body;

    const matchedRole: UserRole =
      role ||
      (Object.keys(DEMO_USERS).find(
        (r) => DEMO_USERS[r as UserRole].email.toLowerCase() === (email || '').toLowerCase()
      ) as UserRole) ||
      'CUSTOMER';

    const baseUser = DEMO_USERS[matchedRole];
    const user = {
      ...baseUser,
      email: email || baseUser.email,
      name: email ? email.split('@')[0].toUpperCase() : baseUser.name,
      permissions: ROLE_PERMISSIONS[matchedRole],
    };

    return NextResponse.json({
      success: true,
      token: `mock_jwt_token_${user.id}_${Date.now()}`,
      user,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Authentication failed' },
      { status: 400 }
    );
  }
}
