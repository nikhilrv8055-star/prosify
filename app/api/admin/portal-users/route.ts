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

// 1. GET: Page load / refresh par D1 se users fetch karne ke liye
export async function GET() {
  try {
    const db = getD1Database();
    if (!db) {
      return createErrorResponse('INTERNAL_ERROR', 'Cloudflare D1 binding (DB) not found in runtime.', 500);
    }

    const { results } = await db
      .prepare('SELECT id, name, email, department, role, status, created_at AS createdAt FROM department_users ORDER BY created_at DESC')
      .all();

    return NextResponse.json(
      {
        success: true,
        users: results || [],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Fetch Portal Users Error:', error);
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Failed to fetch department users', 500);
  }
}

// 2. POST: Admin panel se naya ID/Password D1 me permanently save karne ke liye
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
    const cleanName = name.trim();
    const cleanDept = department.trim().toLowerCase();
    const cleanRole = (role || 'STAFF').toUpperCase();
    const userId = `dept_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Check duplicate email
    const existing = await db
      .prepare('SELECT id FROM department_users WHERE LOWER(email) = ? LIMIT 1')
      .bind(cleanEmail)
      .first();

    if (existing) {
      return createErrorResponse('CONFLICT', 'User with this email already exists.', 409);
    }

    // Insert into D1 SQL
    await db
      .prepare(`
        INSERT INTO department_users (
          id, name, email, password_hash, department, role, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'active', datetime('now'))
      `)
      .bind(userId, cleanName, cleanEmail, password.trim(), cleanDept, cleanRole)
      .run();

    return NextResponse.json(
      {
        success: true,
        message: 'Department user created successfully in D1 database!',
        user: {
          id: userId,
          name: cleanName,
          email: cleanEmail,
          department: cleanDept,
          role: cleanRole,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Create Portal User Error:', error);
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Failed to create user', 500);
  }
}

// 3. DELETE: User access delete/revoke karne ke liye
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
      { success: true, message: 'User removed successfully.' },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return createErrorResponse('INTERNAL_ERROR', error.message || 'Failed to delete user', 500);
  }
}
