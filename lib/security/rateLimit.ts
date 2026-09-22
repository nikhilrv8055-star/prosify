import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  limit: number; // Max requests allowed
  windowMs: number; // Time window in milliseconds
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory token bucket cache per identifier (e.g. IP or IP+route)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic garbage collection for expired entries (runs every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Checks if a request exceeds the rate limit.
 * @param identifier Unique key (e.g., client IP or composite user/route key)
 * @param config Max allowed requests and window in ms
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 60, windowMs: 60 * 1000 }
): {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(identifier, newEntry);
    return {
      allowed: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: Math.ceil(newEntry.resetAt / 1000),
    };
  }

  entry.count += 1;
  const remaining = Math.max(0, config.limit - entry.count);
  const allowed = entry.count <= config.limit;

  return {
    allowed,
    limit: config.limit,
    remaining,
    reset: Math.ceil(entry.resetAt / 1000),
  };
}

/**
 * Extracts a client identifier from NextRequest using standard headers.
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Helper to enforce rate limiting on an API route.
 * Returns null if allowed, or a 429 NextResponse with standard headers if blocked.
 */
export function applyRateLimit(
  req: NextRequest,
  config: RateLimitConfig = { limit: 60, windowMs: 60 * 1000 },
  scope = 'api'
): NextResponse | null {
  const ip = getClientIp(req);
  const key = `${scope}:${ip}`;
  const result = checkRateLimit(key, config);

  if (!result.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please slow down and try again later.',
        },
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset * 1000 - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null;
}
