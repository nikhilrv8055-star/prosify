import { NextRequest, NextResponse } from 'next/server';
import { NO_CACHE_HEADERS, createErrorResponse } from '@/lib/db/d1';

export const dynamic = 'force-dynamic';

function getD1Database(): any {
  try {
    const globalContext = (globalThis as any).__cloudflare_context__?.env?.DB;
    if (globalContext) return globalContext;
  } catch (e) {}

  if ((process.env as any)?.DB) return (process.env as any).DB;
  if ((globalThis as any)?.DB) return (globalThis as any).DB;
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const db = getD1Database();
    if (!db) {
      return createErrorResponse('INTERNAL_ERROR', 'Cloudflare D1 binding (DB) not found in runtime.', 500);
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role')?.toUpperCase();

    let query = 'SELECT * FROM portal_users';
    const params: any[] = [];

    if (role && (role === 'VENDOR' || role === 'AGENT')) {
      query += ' WHERE role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC';

    const { results } = await db.prepare(query).bind(...params).all();
    const rows = (results as any[]) || [];

    const formattedUsers = rows.map((u) => ({
      id: u.id,
      secureId: u.secure_id || u.id,
      username: u.username || u.email,
      email: u.email,
      name: u.name,
      phone: u.phone,
      role: u.role,
      status: u.status || 'ACTIVE',
      requirePasswordChange: Boolean(u.require_password_change),
      createdAt: u.created_at,
      lastLoginAt: u.last_login_at,
      vendorProfile:
        u.role === 'VENDOR'
          ? {
              businessName: u.business_or_agency_name,
              category: u.category_or_rera,
              gstNumber: u.official_id_or_gst,
              territory: u.territory,
            }
          : undefined,
      agentProfile:
        u.role === 'AGENT'
          ? {
              agencyName: u.business_or_agency_name,
              reraNumber: u.category_or_rera,
              officialId: u.official_id_or_gst,
              territory: u.territory,
            }
          : undefined,
    }));

    return NextResponse.json(
      {
        success: true,
        count: formattedUsers.length,
        users: formattedUsers,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Fetch Portal Users Error:', error);
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

    const db = getD1Database();
    if (!db) {
      return createErrorResponse('INTERNAL_ERROR', 'Cloudflare D1 binding (DB) not found in runtime.', 500);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    // Check duplicate email
    const existing = await db
      .prepare('SELECT id FROM portal_users WHERE LOWER(email) = ? LIMIT 1')
      .bind(cleanEmail)
      .first();

    if (existing) {
      return NextResponse.json(
        { success: false, error: `An account with email ${cleanEmail} already exists.` },
        { status: 400 }
      );
    }

    const userId = `usr_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const secureId = customSecureId?.trim() || `${role.slice(0, 3)}-${Math.floor(10000 + Math.random() * 90000)}`;
    const temporaryPassword =
      password?.trim() || `${role.toLowerCase()}@${Math.floor(1000 + Math.random() * 9000)}`;

    await db
      .prepare(`
        INSERT INTO portal_users (
          id,
          secure_id,
          username,
          email,
          password_hash,
          name,
          phone,
          role,
          status,
          business_or_agency_name,
          territory,
          category_or_rera,
          official_id_or_gst,
          require_password_change,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?, ?, ?, datetime('now'))
      `)
      .bind(
        userId,
        secureId,
        cleanEmail,
        cleanEmail,
        temporaryPassword,
        cleanName,
        cleanPhone,
        role,
        businessOrAgencyName.trim(),
        territory?.trim() || 'Mumbai MMR',
        categoryOrRera?.trim() || '',
        officialIdOrGst?.trim() || '',
        requirePasswordChange ? 1 : 0
      )
      .run();

    const loginUrl = role === 'VENDOR' ? '/vendor/login' : '/agent/login';

    return NextResponse.json(
      {
        success: true,
        message: `${role} account provisioned successfully!`,
        user: {
          id: userId,
          secureId,
          username: cleanEmail,
          email: cleanEmail,
          name: cleanName,
          role,
          status: 'ACTIVE',
          loginUrl,
        },
        temporaryPassword,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Provision User Error:', error);
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

    const db = getD1Database();
    if (!db) {
      return createErrorResponse('INTERNAL_ERROR', 'Cloudflare D1 binding (DB) not found in runtime.', 500);
    }

    const existingUser = await db
      .prepare('SELECT * FROM portal_users WHERE id = ? LIMIT 1')
      .bind(userId)
      .first();

    if (!existingUser) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    if (action === 'toggle_status') {
      const currentStatus = existingUser.status || 'ACTIVE';
      const targetStatus = status || (currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');

      await db
        .prepare('UPDATE portal_users SET status = ? WHERE id = ?')
        .bind(targetStatus, userId)
        .run();

      return NextResponse.json(
        {
          success: true,
          message: `Account status updated to ${targetStatus}`,
          status: targetStatus,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    if (action === 'reset_password') {
      const generatedPass =
        newPassword?.trim() ||
        `${existingUser.role.slice(0, 3)}#${Math.floor(1000 + Math.random() * 9000)}!Reset`;

      await db
        .prepare('UPDATE portal_users SET password_hash = ?, require_password_change = 1, status = ? WHERE id = ?')
        .bind(generatedPass, 'PENDING_FIRST_LOGIN', userId)
        .run();

      return NextResponse.json(
        {
          success: true,
          message: 'Password successfully reset.',
          temporaryPassword: generatedPass,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    if (action === 'edit_profile' && profileUpdates) {
      const updates: string[] = [];
      const params: any[] = [];

      if (profileUpdates.name) {
        updates.push('name = ?');
        params.push(profileUpdates.name.trim());
      }
      if (profileUpdates.phone) {
        updates.push('phone = ?');
        params.push(profileUpdates.phone.trim());
      }
      if (profileUpdates.email) {
        updates.push('email = ?');
        params.push(profileUpdates.email.trim().toLowerCase());
      }
      if (profileUpdates.businessName || profileUpdates.agencyName) {
        updates.push('business_or_agency_name = ?');
        params.push((profileUpdates.businessName || profileUpdates.agencyName).trim());
      }
      if (profileUpdates.territory) {
        updates.push('territory = ?');
        params.push(profileUpdates.territory.trim());
      }
      if (profileUpdates.category || profileUpdates.reraNumber) {
        updates.push('category_or_rera = ?');
        params.push((profileUpdates.category || profileUpdates.reraNumber).trim());
      }
      if (profileUpdates.gstNumber || profileUpdates.officialId) {
        updates.push('official_id_or_gst = ?');
        params.push((profileUpdates.gstNumber || profileUpdates.officialId).trim());
      }

      if (updates.length > 0) {
        params.push(userId);
        await db
          .prepare(`UPDATE portal_users SET ${updates.join(', ')} WHERE id = ?`)
          .bind(...params)
          .run();
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Profile details updated successfully.',
        },
        { headers: NO_CACHE_HEADERS }
      );
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

    const db = getD1Database();
    if (!db) {
      return createErrorResponse('INTERNAL_ERROR', 'Cloudflare D1 binding (DB) not found in runtime.', 500);
    }

    await db.prepare('DELETE FROM portal_users WHERE id = ?').bind(userId).run();

    return NextResponse.json(
      { success: true, message: 'Account deleted successfully' },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
