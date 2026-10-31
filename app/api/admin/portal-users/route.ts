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

// 1. Naya Department User Banane ke liye (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, department, role } = body;

    if (!name || !email || !password || !department) {
      return createErrorResponse('BAD_REQUEST', 'Name, email, password, and department are required.', 400);
    }

    const db = getD1Database();
    if (!db) {
      return createErrorResponse('INTERNAL_ERROR', 'Cloudflare D1 binding (DB) not found in runtime.', 500);
    }

    const cleanEmail = email.trim().toLowerCase();
    const userId = `dept_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Existing check
    const existing = await db
      .prepare('SELECT id FROM department_users WHERE LOWER(email) = ? LIMIT 1')
      .bind(cleanEmail)
      .first();

    if (existing) {
      return createErrorResponse('CONFLICT', 'User with this email already exists in department.', 409);
    }

    // Direct D1 Database me insert
    await db
      .prepare(`
        INSERT INTO department_users (
          id, name, email, password_hash, department, role, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'active', datetime('now'))
      `)
      .bind(
        userId,
        name.trim(),
        cleanEmail,
        password.trim(),
        department.trim().toLowerCase(),
        (role || 'STAFF').toUpperCase()
      )
      .run();

    return NextResponse.json(
      {
        success: true,
        message: 'Department user provisioned successfully in D1 database!',
        user: {
          id: userId,
          name: name.trim(),
          email: cleanEmail,
          department: department.trim().toLowerCase(),
          role: (role || 'STAFF').toUpperCase(),
          status: 'active',
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Provision Department User Error:', error);
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Failed to provision user', 500);
  }
}

// 2. Refresh karne par list show karne ke liye (GET)
export async function GET(req: NextRequest) {
  try {
    const db = getD1Database();
    if (!db) {
      return createErrorResponse('INTERNAL_ERROR', 'Cloudflare D1 binding (DB) not found in runtime.', 500);
    }

    const { results } = await db
      .prepare('SELECT id, name, email, department, role, status, created_at FROM department_users ORDER BY created_at DESC')
      .all();

    return NextResponse.json(
      {
        success: true,
        users: results || [],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Get Department Users Error:', error);
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Failed to fetch department users', 500);
  }
}

// 3. User Delete / Revoke karne ke liye (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return createErrorResponse('BAD_REQUEST', 'User ID is required', 400);
    }

    const db = getD1Database();
    if (!db) {
      return createErrorResponse('INTERNAL_ERROR', 'Cloudflare D1 binding (DB) not found in runtime.', 500);
    }

    await db.prepare('DELETE FROM department_users WHERE id = ?').bind(userId).run();

    return NextResponse.json(
      { success: true, message: 'User access revoked successfully' },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Failed to delete user', 500);
  }
}
