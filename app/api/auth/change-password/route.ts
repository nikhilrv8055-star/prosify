import { NextRequest, NextResponse } from 'next/server';
import { rbacStore } from '@/lib/auth/rbacStore';

export async function POST(req: NextRequest) {
  try {
    const { userId, newPassword, confirmPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'User ID and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    const updated = rbacStore.updatePassword(userId, newPassword);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'User account not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated. You may now continue using your dashboard.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update password' },
      { status: 500 }
    );
  }
}
