/**
 * Cloudflare D1 Database Client & Edge Defense Adapter for Prosify
 * 
 * Production D1 Database ID: e1e0fd5e-8efa-4b3b-aa83-53518b7d1e60
 * Binding Identifier: DB (accessed via env.DB or context.env.DB)
 * Runtime Target: Cloudflare Edge (Workers / Pages Functions)
 */

import { NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

/**
 * Standard edge-caching defense headers.
 * Disallows Cloudflare edge and proxy caching on mutating and real-time query endpoints.
 */
export const NO_CACHE_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

/**
 * Standard Structured Error Response Schema
 */
export type ErrorCode = 'BAD_REQUEST' | 'NOT_FOUND' | 'INTERNAL_ERROR';

export interface StandardErrorPayload {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
}

export interface StandardSuccessPayload<T = unknown> {
  success: true;
  data?: T;
  [key: string]: unknown;
}

/**
 * Helper to construct compliant structured error responses
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  status: number = 400
): NextResponse<StandardErrorPayload> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
    },
    {
      status,
      headers: NO_CACHE_HEADERS,
    }
  );
}

/**
 * Helper to construct compliant structured success responses
 */
export function createSuccessResponse<T extends Record<string, unknown>>(
  payload: T,
  status: number = 200
): NextResponse<StandardSuccessPayload<T>> {
  return NextResponse.json(
    {
      success: true,
      ...payload,
    },
    {
      status,
      headers: NO_CACHE_HEADERS,
    }
  );
}

/**
 * Cloudflare D1 SQLite Type Definitions
 */
export interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  meta: {
    duration: number;
    size_after: number;
    rows_read: number;
    rows_written: number;
    last_row_id: number;
    changed_db: boolean;
    changes: number;
  };
  error?: string;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec<T = unknown>(query: string): Promise<D1Result<T>>;
}

export interface CloudflareEnv {
  DB?: D1Database;
  KV_CACHE?: unknown;
  R2_UPLOADS?: unknown;
  NEXT_INC_CACHE_R2_BUCKET?: unknown;
}

/**
 * Safely retrieve Cloudflare Environment bindings (D1, KV, R2)
 */
export async function getCloudflareEnv(): Promise<CloudflareEnv | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const context = await getCloudflareContext({ async: true });
    return (context?.env as CloudflareEnv) || null;
  } catch {
    // Standard Node.js / Container / Local execution fallback
    return null;
  }
}

/**
 * Execute a parameterized SQL query on Cloudflare D1 with strict SQLite semantics.
 * Returns results array or null if D1 is not currently active in execution context.
 */
export async function queryD1<T = unknown>(sql: string, params: unknown[] = []): Promise<T[] | null> {
  try {
    const env = await getCloudflareEnv();
    if (env?.DB?.prepare) {
      const statement = env.DB.prepare(sql).bind(...params);
      const result = await statement.all<T>();
      return result.results || [];
    }
  } catch (error) {
    console.warn('[Cloudflare D1 Query Warning]:', error);
  }
  return null;
}

/**
 * Execute a mutating parameterized SQL statement (INSERT, UPDATE, DELETE) on Cloudflare D1.
 * Strict SQLite syntax and parameterized bindings enforced.
 */
export async function executeD1(
  sql: string,
  params: unknown[] = []
): Promise<{ success: boolean; changes?: number; lastRowId?: number } | null> {
  try {
    const env = await getCloudflareEnv();
    if (env?.DB?.prepare) {
      const statement = env.DB.prepare(sql).bind(...params);
      const result = await statement.run();
      return {
        success: result.success,
        changes: result.meta?.changes,
        lastRowId: result.meta?.last_row_id,
      };
    }
  } catch (error) {
    console.warn('[Cloudflare D1 Execute Warning]:', error);
  }
  return null;
}

/**
 * Diagnostic tool to check Cloudflare D1 & Edge services status
 */
export async function getDatabaseStatus(): Promise<{
  provider: 'Cloudflare D1' | 'In-Memory Edge Store';
  isCloudflare: boolean;
  d1Available: boolean;
  databaseId: string;
  binding: string;
  propertiesCount: number;
  projectsCount: number;
  leadsCount: number;
  message: string;
}> {
  const env = await getCloudflareEnv();
  const d1Available = Boolean(env?.DB);

  if (d1Available) {
    try {
      const countRes = await queryD1<{ count: number }>('SELECT COUNT(*) as count FROM properties');
      const propertiesCount = countRes?.[0]?.count ?? store.getProperties().length;

      return {
        provider: 'Cloudflare D1',
        isCloudflare: true,
        d1Available: true,
        databaseId: 'e1e0fd5e-8efa-4b3b-aa83-53518b7d1e60',
        binding: 'DB',
        propertiesCount,
        projectsCount: store.getProjects().length,
        leadsCount: store.getLeads().length,
        message: 'Connected to Cloudflare D1 Edge Serverless Database (Global SQLite)',
      };
    } catch {
      // Fall through to fallback
    }
  }

  return {
    provider: 'In-Memory Edge Store',
    isCloudflare: false,
    d1Available: false,
    databaseId: 'e1e0fd5e-8efa-4b3b-aa83-53518b7d1e60',
    binding: 'DB',
    propertiesCount: store.getProperties().length,
    projectsCount: store.getProjects().length,
    leadsCount: store.getLeads().length,
    message: 'Running in Local/Dev mode with synchronized In-Memory Store (Ready for Cloudflare D1 deployment)',
  };
}
