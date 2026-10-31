import { NextRequest, NextResponse } from 'next/server';
import { NO_CACHE_HEADERS } from '@/lib/db/d1';

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

    // D1 nahi mila to 500 throw na karein, safe empty list dein
    if (!db) {
      console.warn('D1 database not found in runtime, returning fallback');
      return NextResponse.json(
        { success: true, count: 0, users: [] },
        { headers: NO_CACHE_HEADERS }
      );
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
    console.error('Portal Users Safe Catch:', error);
    // 500 crash prevent karne ke liye empty array return karein
    return NextResponse.json(
      { success: true, count: 0, users: [], warning: error.message },
      { headers: NO_CACHE_HEADERS }
    );
  }
}
