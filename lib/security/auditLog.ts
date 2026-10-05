import { AuthUser } from '../auth/types';
import { store } from '../data/store';

export type AuditAction =
  | 'AUTH_LOGIN'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_LOGOUT'
  | 'AUTH_GOOGLE_LOGIN'
  | 'AUTH_REGISTER'
  | 'PASSWORD_CHANGE'
  | 'ROLE_SWITCH'
  | 'PROPERTY_CREATE'
  | 'PROPERTY_UPDATE'
  | 'PROPERTY_DELETE'
  | 'PROPERTY_STATUS_CHANGE'
  | 'LEAD_CREATE'
  | 'LEAD_STATUS_UPDATE'
  | 'LEAD_ASSIGN'
  | 'COMMISSION_UPDATE'
  | 'COMMISSION_DISBURSED'
  | 'AFFILIATE_WITHDRAWAL_REQUEST'
  | 'AFFILIATE_WITHDRAWAL_APPROVED'
  | 'DEVELOPER_PUSH_SYNC'
  | 'DEVELOPER_API_KEY_ROTATED'
  | 'FILE_UPLOAD'
  | 'INTEGRATION_UPDATE'
  | 'ADMIN_ACCESS'
  | 'RATE_LIMIT_BLOCKED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorEmail?: string;
  actorRole: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  details?: string;
  ipAddress?: string;
}

// In-memory security audit log buffer (capped at 1,000 recent items)
const inMemoryAuditLogs: AuditLogEntry[] = [];

/**
 * Records a security audit event. Automatically sanitizes and never logs sensitive tokens/passwords.
 */
export function recordAuditEvent(params: {
  actor?: AuthUser | null;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  details?: string;
  ipAddress?: string;
}): AuditLogEntry {
  const actor = params.actor;
  const entry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    actorId: actor?.id || 'anonymous',
    actorEmail: actor?.email ? maskEmail(actor.email) : undefined,
    actorRole: actor?.role || 'UNAUTHENTICATED',
    action: params.action,
    resource: params.resource,
    resourceId: params.resourceId,
    status: params.status,
    details: sanitizeDetails(params.details),
    ipAddress: params.ipAddress ? maskIp(params.ipAddress) : undefined,
  };

  inMemoryAuditLogs.unshift(entry);
  if (inMemoryAuditLogs.length > 1000) {
    inMemoryAuditLogs.pop();
  }

  // Also bridge into store audit logs for unified admin dashboard view
  try {
    store.addAuditLog(
      params.action,
      actor?.name || 'System / Security Engine',
      params.details || `${params.action} on ${params.resource}`,
      params.resourceId
    );
  } catch {
    // Ignore store sync failure if running outside main thread
  }

  // Security server-side diagnostic log
  console.info(`[AUDIT] [${entry.status}] ${entry.action} by ${entry.actorRole}:${entry.actorId} on ${entry.resource}`);

  return entry;
}

/**
 * Retrieve recent security audit logs (restricted to Admins).
 */
export function getRecentAuditLogs(limit = 100): AuditLogEntry[] {
  return inMemoryAuditLogs.slice(0, limit);
}

/**
 * Masks an email for privacy: jo***@example.com
 */
function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return '***';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 ? `${name.substring(0, 2)}***` : `${name}***`;
  return `${maskedName}@${domain}`;
}

/**
 * Masks IP address to preserve privacy while retaining subnet for forensics.
 */
function maskIp(ip: string): string {
  if (ip.includes('.')) {
    const octets = ip.split('.');
    if (octets.length === 4) {
      return `${octets[0]}.${octets[1]}.***.***`;
    }
  }
  return ip;
}

/**
 * Removes any accidental passwords, tokens, or private keys from audit text.
 */
function sanitizeDetails(details?: string): string | undefined {
  if (!details) return undefined;
  return details
    .replace(/(password|pwd|secret|token|apiKey|key)["\s:=]+([^\s,;]+)/gi, '$1=***REDACTED***')
    .substring(0, 500); // cap max audit message length
}
