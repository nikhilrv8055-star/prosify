import { NextRequest, NextResponse } from 'next/server';
import { serverAdminStaffDb, AdminRoleType } from '@/lib/data/serverAdminStaffDb';
import { NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export async function GET(req: NextRequest) {
  try {
    const accounts = serverAdminStaffDb.getAllAccounts();
    return NextResponse.json(
      {
        success: true,
        count: accounts.length,
        accounts,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Failed to fetch admin accounts', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, username, email, password, role, roleTitle, allowedGroups, notes } = body;

    if (!name || !name.trim()) {
      return createErrorResponse('BAD_REQUEST', 'Staff full name is required.', 400);
    }

    if (!username || !username.trim()) {
      return createErrorResponse('BAD_REQUEST', 'Login ID / Username is required.', 400);
    }

    if (!email || !email.trim()) {
      return createErrorResponse('BAD_REQUEST', 'Email address is required.', 400);
    }

    if (!password || password.trim().length < 4) {
      return createErrorResponse('BAD_REQUEST', 'Password must be at least 4 characters.', 400);
    }

    const created = serverAdminStaffDb.createAccount({
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      role: (role as AdminRoleType) || 'CUSTOM',
      roleTitle: roleTitle?.trim(),
      allowedGroups: Array.isArray(allowedGroups) ? allowedGroups : undefined,
      notes: notes?.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: `Admin user ${created.name} (${created.username}) created successfully with role ${created.roleTitle}!`,
        account: created,
      },
      { status: 201, headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('BAD_REQUEST', error.message || 'Failed to create admin user', 400);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, email, password, role, roleTitle, allowedGroups, status, notes } = body;

    if (!id) {
      return createErrorResponse('BAD_REQUEST', 'Admin account ID is required', 400);
    }

    const updates: any = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.trim();
    if (password) updates.password = password.trim();
    if (role) updates.role = role;
    if (roleTitle) updates.roleTitle = roleTitle.trim();
    if (Array.isArray(allowedGroups)) updates.allowedGroups = allowedGroups;
    if (status) updates.status = status;
    if (typeof notes === 'string') updates.notes = notes.trim();

    const updated = serverAdminStaffDb.updateAccount(id, updates);

    return NextResponse.json(
      {
        success: true,
        message: `Admin account for ${updated.name} updated successfully!`,
        account: updated,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('BAD_REQUEST', error.message || 'Failed to update admin account', 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return createErrorResponse('BAD_REQUEST', 'Account ID is required for deletion', 400);
    }

    const deleted = serverAdminStaffDb.deleteAccount(id);
    if (!deleted) {
      return createErrorResponse('NOT_FOUND', 'Admin user not found', 404);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Admin account has been revoked successfully.',
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('BAD_REQUEST', error.message || 'Failed to delete account', 400);
  }
}
