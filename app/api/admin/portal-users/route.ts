import { NextRequest, NextResponse } from 'next/server';
import { serverUserDb } from '@/lib/auth/serverUserDb';
import { RbacUser } from '@/lib/auth/rbacStore';

function toPortalUserFormat(u: RbacUser) {
  return {
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role as any,
    password: u.password || u.passwordHash,
    phone: u.phone,
    companyOrProject: u.companyOrProject || (u.vendorProfile ? u.vendorProfile.businessName : u.agentProfile ? u.agentProfile.agencyName : ''),
    status: u.status === 'PENDING_FIRST_LOGIN' ? 'PENDING' : u.status,
    createdAt: u.createdAt,
    lastLogin: u.lastLoginAt,
    portalUrl: u.portalUrl || (u.role === 'VENDOR' ? '/vendor' : u.role === 'AGENT' ? '/agent' : '/admin'),
    assignedCode: u.assignedCode || u.secureId,
    secureId: u.secureId,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const username = searchParams.get('username');

    if (username) {
      const user = serverUserDb.findUserByLogin(username);
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found in cloud' }, { status: 404 });
      }
      return NextResponse.json({ success: true, user: toPortalUserFormat(user) });
    }

    const allUsers = serverUserDb.getAllUsers(role || undefined);
    const formatted = allUsers.map(toPortalUserFormat);

    return NextResponse.json({
      success: true,
      count: formatted.length,
      users: formatted,
      syncedToCloud: true,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, username, role, password, phone, companyOrProject, assignedCode, secureId } = body;

    if (!name || !username || !role || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required user parameters' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanRole = role.toUpperCase();
    const finalCode = assignedCode || secureId || `${cleanRole.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const savedUser = serverUserDb.saveUser({
      id: body.id || `user-${cleanRole.toLowerCase()}-${Date.now()}`,
      name: name.trim(),
      username: cleanUsername,
      email: cleanUsername.includes('@') ? cleanUsername : `${cleanUsername}@prosify.in`,
      role: cleanRole as any,
      password: password.trim(),
      passwordHash: password.trim(),
      phone: phone || '',
      companyOrProject: companyOrProject || '',
      assignedCode: finalCode,
      secureId: finalCode,
      portalUrl: cleanRole === 'VENDOR' ? '/vendor' : cleanRole === 'AGENT' ? '/agent' : '/admin',
      status: body.status === 'PENDING' ? 'PENDING_FIRST_LOGIN' : body.status || 'ACTIVE',
      vendorProfile: cleanRole === 'VENDOR' ? {
        businessName: companyOrProject || name,
        category: 'Building Materials & Contractors',
        territory: 'Mumbai MMR',
        totalSettledAmount: 0,
        pendingClearance: 0,
        activeListingsCount: 0,
      } : undefined,
      agentProfile: cleanRole === 'AGENT' ? {
        agencyName: companyOrProject || name,
        territory: 'Mumbai MMR',
        monthlyTargetInr: 20000000,
        achievedVolumeInr: 0,
        closedDealsCount: 0,
        commissionRatePercent: 2.0,
        totalCommissionEarned: 0,
        pendingCommission: 0,
      } : undefined,
    });

    const responseUser = toPortalUserFormat(savedUser);

    return NextResponse.json({
      success: true,
      message: `${cleanRole} account securely synced to Cloud Database`,
      user: responseUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to save user to cloud' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, username, password, status, name, phone, companyOrProject } = body;

    const user = (id && serverUserDb.findUserById(id)) || (username && serverUserDb.findUserByLogin(username));

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found in cloud' }, { status: 404 });
    }

    if (password !== undefined) {
      serverUserDb.updatePassword(user.id, password);
    }
    if (status !== undefined) {
      serverUserDb.updateStatus(user.id, status === 'PENDING' ? 'PENDING_FIRST_LOGIN' : status);
    }
    if (name !== undefined || phone !== undefined || companyOrProject !== undefined) {
      serverUserDb.saveUser({
        ...user,
        name: name !== undefined ? name : user.name,
        phone: phone !== undefined ? phone : user.phone,
        companyOrProject: companyOrProject !== undefined ? companyOrProject : user.companyOrProject,
      });
    }

    const updated = serverUserDb.findUserById(user.id);

    return NextResponse.json({
      success: true,
      message: 'Cloud user credentials updated successfully',
      user: updated ? toPortalUserFormat(updated) : undefined,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update cloud user' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'User id is required' }, { status: 400 });
    }

    const deleted = serverUserDb.deleteUser(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `User deleted from Cloud Database`,
      deletedId: id,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
