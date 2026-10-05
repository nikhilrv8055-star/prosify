import crypto from 'crypto';

/**
 * Enterprise Production Cryptographic Utilities for Prosify
 * Compatible with Node.js and Cloudflare Workers/OpenNext runtimes.
 */

const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_KEYLEN = 64; // 512 bits
const PBKDF2_DIGEST = 'sha512';

/**
 * Hash a password using PBKDF2-HMAC-SHA512 with a cryptographically secure random salt.
 * Format: pbkdf2$iterations$salt$hash
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      PBKDF2_ITERATIONS,
      PBKDF2_KEYLEN,
      PBKDF2_DIGEST,
      (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`pbkdf2$${PBKDF2_ITERATIONS}$${salt}$${derivedKey.toString('hex')}`);
      }
    );
  });
}

/**
 * Verify a plaintext password against a stored PBKDF2 hash using timing-safe comparison.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!password || !storedHash) return false;

  try {
    const parts = storedHash.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
      return false;
    }

    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const expectedHash = parts[3];

    if (!iterations || !salt || !expectedHash) return false;

    return new Promise((resolve) => {
      crypto.pbkdf2(
        password,
        salt,
        iterations,
        PBKDF2_KEYLEN,
        PBKDF2_DIGEST,
        (err, derivedKey) => {
          if (err) return resolve(false);
          const computedHash = derivedKey.toString('hex');
          if (computedHash.length !== expectedHash.length) return resolve(false);
          const match = crypto.timingSafeEqual(
            Buffer.from(computedHash, 'utf8'),
            Buffer.from(expectedHash, 'utf8')
          );
          resolve(match);
        }
      );
    });
  } catch {
    return false;
  }
}

/**
 * Generate a cryptographically secure random token (e.g., session ID, API key, CSRF token).
 */
export function generateSecureToken(byteLength = 32): string {
  return crypto.randomBytes(byteLength).toString('hex');
}

/**
 * HMAC-SHA256 signature generator.
 */
export function signHmac(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Timing-safe HMAC signature verification.
 */
export function verifyHmac(data: string, signature: string, secret: string): boolean {
  if (!data || !signature || !secret) return false;
  try {
    const expected = signHmac(data, secret);
    if (expected.length !== signature.length) return false;
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'utf8'),
      Buffer.from(signature, 'utf8')
    );
  } catch {
    return false;
  }
}
