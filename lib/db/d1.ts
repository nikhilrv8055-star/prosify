/**
 * Cloudflare D1 Database Client Adapter for Prosify
 * 
 * Provides unified access to Cloudflare D1 Serverless SQLite Edge Database
 * with automatic fallback to high-fidelity store when running outside Cloudflare.
 */

import { store } from '@/lib/data/store';

export interface CloudflareEnv {
  DB?: any;
  KV_CACHE?: any;
  R2_UPLOADS?: any;
  NEXT_INC_CACHE_R2_BUCKET?: any;
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
    // Running in standard Node.js / Local Dev / Cloud Run environment
    return null;
  }
}

/**
 * Execute a SQL query on Cloudflare D1
 * If D1 is not available, returns null so caller can use fallback
 */
export async function queryD1<T = any>(sql: string, params: any[] = []): Promise<T[] | null> {
  try {
    const env = await getCloudflareEnv();
    if (env?.DB?.prepare) {
      const statement = env.DB.prepare(sql).bind(...params);
      const result = await statement.all();
      return (result.results as T[]) || [];
    }
  } catch (error) {
    console.warn('[Cloudflare D1] Direct query failed, falling back to local store:', error);
  }
  return null;
}

/**
 * Execute a SQL statement (INSERT, UPDATE, DELETE) on Cloudflare D1
 */
export async function executeD1(sql: string, params: any[] = []): Promise<{ success: boolean; meta?: any } | null> {
  try {
    const env = await getCloudflareEnv();
    if (env?.DB?.prepare) {
      const statement = env.DB.prepare(sql).bind(...params);
      const result = await statement.run();
      return { success: result.success, meta: result.meta };
    }
  } catch (error) {
    console.warn('[Cloudflare D1] Statement execution failed:', error);
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
    propertiesCount: store.getProperties().length,
    projectsCount: store.getProjects().length,
    leadsCount: store.getLeads().length,
    message: 'Running in Local/Dev mode with synchronized In-Memory Store (Ready for Cloudflare D1 deployment)',
  };
}
