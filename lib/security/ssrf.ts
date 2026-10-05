/**
 * Server-Side Request Forgery (SSRF) Protection Filter
 * Validates destination URLs before outbound fetching in integrations, webhooks, and image scrapers.
 */

export interface UrlValidationResult {
  valid: boolean;
  reason?: string;
  sanitizedUrl?: string;
}

/**
 * Validates whether a target URL is safe for server-side outbound HTTP requests.
 * Blocks private IP subnets, loopbacks, link-local addresses, and cloud metadata services.
 */
export function validateOutboundUrl(rawUrl: string, allowHttp = false): UrlValidationResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, reason: 'URL must be a non-empty string' };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { valid: false, reason: 'Malformed URL' };
  }

  // 1. Enforce allowed schemes
  const allowedProtocols = allowHttp ? ['https:', 'http:'] : ['https:'];
  if (!allowedProtocols.includes(parsed.protocol)) {
    return {
      valid: false,
      reason: `Disallowed protocol "${parsed.protocol}". Only ${allowedProtocols.join(', ')} permitted.`,
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 2. Reject localhost & metadata keywords
  const blockedHostnames = [
    'localhost',
    'localhost.localdomain',
    'ip6-localhost',
    'ip6-loopback',
    'metadata.google.internal',
    'metadata',
    'instance-data',
  ];

  if (blockedHostnames.includes(hostname)) {
    return { valid: false, reason: 'Access to local or metadata hostnames is forbidden.' };
  }

  // 3. Reject IPv6 loopback and private scopes
  if (
    hostname === '::1' ||
    hostname.startsWith('fe80:') ||
    hostname.startsWith('fc00:') ||
    hostname.startsWith('fd00:') ||
    hostname === '[::1]'
  ) {
    return { valid: false, reason: 'Access to IPv6 private/loopback addresses is forbidden.' };
  }

  // 4. Reject IPv4 private, loopback, and link-local ranges
  // Check if hostname is an IPv4 address
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = hostname.match(ipv4Regex);

  if (match) {
    const octet1 = parseInt(match[1], 10);
    const octet2 = parseInt(match[2], 10);
    const octet3 = parseInt(match[3], 10);
    const octet4 = parseInt(match[4], 10);

    if (octet1 > 255 || octet2 > 255 || octet3 > 255 || octet4 > 255) {
      return { valid: false, reason: 'Invalid IP address format' };
    }

    // 0.0.0.0/8 (Broadcast/Current network)
    if (octet1 === 0) {
      return { valid: false, reason: 'Access to 0.0.0.0/8 subnet is forbidden.' };
    }

    // 127.0.0.0/8 (Loopback)
    if (octet1 === 127) {
      return { valid: false, reason: 'Access to loopback subnet 127.0.0.0/8 is forbidden.' };
    }

    // 10.0.0.0/8 (Private Network)
    if (octet1 === 10) {
      return { valid: false, reason: 'Access to private 10.0.0.0/8 subnet is forbidden.' };
    }

    // 172.16.0.0/12 (Private Network 172.16.0.0 - 172.31.255.255)
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
      return { valid: false, reason: 'Access to private 172.16.0.0/12 subnet is forbidden.' };
    }

    // 192.168.0.0/16 (Private Network)
    if (octet1 === 192 && octet2 === 168) {
      return { valid: false, reason: 'Access to private 192.168.0.0/16 subnet is forbidden.' };
    }

    // 169.254.0.0/16 (Link-Local & Cloud Metadata, e.g. 169.254.169.254)
    if (octet1 === 169 && octet2 === 254) {
      return { valid: false, reason: 'Access to link-local/cloud metadata 169.254.0.0/16 is strictly forbidden.' };
    }

    // 100.64.0.0/10 (Carrier-Grade NAT)
    if (octet1 === 100 && octet2 >= 64 && octet2 <= 127) {
      return { valid: false, reason: 'Access to CGNAT 100.64.0.0/10 subnet is forbidden.' };
    }
  }

  // 5. Block sensitive internal ports (e.g., 22 SSH, 3306 MySQL, 5432 Postgres, 6379 Redis, 27017 Mongo)
  const port = parsed.port ? parseInt(parsed.port, 10) : parsed.protocol === 'https:' ? 443 : 80;
  const blockedPorts = [21, 22, 23, 25, 110, 143, 3306, 5432, 6379, 11211, 27017, 28017];
  if (blockedPorts.includes(port)) {
    return { valid: false, reason: `Port ${port} is restricted.` };
  }

  return {
    valid: true,
    sanitizedUrl: parsed.toString(),
  };
}
