import { NextRequest, NextResponse } from 'next/server';
import { rbacStore, UserRole, AccountStatus } from '@/lib/auth/rbacStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role')?.toUpperCase() as UserRole | undefined;
    const users = rbacStore.getUsers(role);

    return NextResponse.json({
      success: true,
      count: users.length,
      users: users.map((u) => ({
        id: u.id,
        secureId: u.secureId,
        username: u.username,
        email: u.email,
        name: u.name,
        phone: u.phone,
        role: u.role,
        status: u.status,
        requirePasswordChange: u.requirePasswordChangeOnFirstLogin,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        vendorProfile: u.vendorProfile,
        agentProfile: u.agentProfile,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      role,
      name,
      businessOrAgencyName,
      email,
      phone,
      territory,
      categoryOrRera,
      officialIdOrGst,
      customSecureId,
      password,
      requirePasswordChange,
    } = body;

    if (!role || (role !== 'VENDOR' && role !== 'AGENT')) {
      return NextResponse.json(
        { success: false, error: 'Role must be either VENDOR or AGENT' },
        { status: 400 }
      );
    }

    if (!name || !businessOrAgencyName || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Full Name, Business/Agency Name, Email, and Phone are required.',
        },
        { status: 400 }
      );
    }

    // Check if email or username already taken
    const existing = rbacStore.findUserByLogin(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: `An account with email ${email} already exists.` },
        { status: 400 }
      );
    }

    const { user, temporaryPassword } = rbacStore.createUser({
      role,
      name,
      businessOrAgencyName,
      email,
      phone,
      territory: territory || 'Mumbai MMR',
      categoryOrRera,
      officialIdOrGst,
      customSecureId,
      password,
      requirePasswordChange,
    });

    const loginUrl = role === 'VENDOR' ? 'https://prosify.in/vendor/login' : 'https://prosify.in/agent/login';

    return NextResponse.json({
      success: true,
      message: `${role} account provisioned successfully!`,
      user: {
        id: user.id,
        secureId: user.secureId,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        loginUrl,
      },
      temporaryPassword,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, action, status, newPassword, profileUpdates } = await req.json();

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: 'User ID and action are required.' },
        { status: 400 }
      );
    }

    const user = rbacStore.getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    if (action === 'toggle_status') {
      const targetStatus: AccountStatus = status || (user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
      rbacStore.updateStatus(user.id, targetStatus);
      return NextResponse.json({
        success: true,
        message: `Account status updated to ${targetStatus}`,
        status: targetStatus,
      });
    }

    if (action === 'reset_password') {
      const generatedPass =
        newPassword?.trim() ||
        `${user.role.slice(0, 3)}#${Math.floor(1000 + Math.random() * 9000)}!Reset`;
      rbacStore.updatePassword(user.id, generatedPass);
      user.requirePasswordChangeOnFirstLogin = true;
      user.status = 'PENDING_FIRST_LOGIN';

      return NextResponse.json({
        success: true,
        message: 'Password successfully reset.',
        temporaryPassword: generatedPass,
      });
    }

    if (action === 'edit_profile' && profileUpdates) {
      if (profileUpdates.name) user.name = profileUpdates.name;
      if (profileUpdates.phone) user.phone = profileUpdates.phone;
      if (profileUpdates.email) user.email = profileUpdates.email;

      if (user.role === 'VENDOR' && user.vendorProfile) {
        if (profileUpdates.businessName) user.vendorProfile.businessName = profileUpdates.businessName;
        if (profileUpdates.gstNumber) user.vendorProfile.gstNumber = profileUpdates.gstNumber;
        if (profileUpdates.territory) user.vendorProfile.territory = profileUpdates.territory;
        if (profileUpdates.category) user.vendorProfile.category = profileUpdates.category;
      }

      if (user.role === 'AGENT' && user.agentProfile) {
        if (profileUpdates.agencyName) user.agentProfile.agencyName = profileUpdates.agencyName;
        if (profileUpdates.reraNumber) user.agentProfile.reraNumber = profileUpdates.reraNumber;
        if (profileUpdates.territory) user.agentProfile.territory = profileUpdates.territory;
      }

      return NextResponse.json({
        success: true,
        message: 'Profile details updated successfully.',
        user,
      });
    }

    return NextResponse.json({ success: false, error: 'Unsupported action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const deleted = rbacStore.deleteUser(userId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
