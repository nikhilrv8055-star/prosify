/**
 * Enterprise XSS & Input Sanitization Utilities
 */

/**
 * Escapes HTML control characters in strings to prevent reflected and stored XSS.
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Strips script tags, event handlers, and dangerous protocols from user-provided text.
 */
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove javascript: and data: pseudo-protocols in links
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html/gi, '')
    // Remove inline event handlers (e.g. onload=, onerror=, onclick=)
    .replace(/on\w+\s*=/gi, '')
    // Remove <script> tags and enclosed content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove dangerous HTML tags
    .replace(/<\/?(iframe|object|embed|applet|meta|link|style)[^>]*>/gi, '');
}

/**
 * Validates and sanitizes filenames to prevent path traversal attacks (../, %2e%2e, etc.).
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return `upload_${Date.now()}`;
  }

  // Strip null bytes and directory traversal symbols
  const clean = filename
    .replace(/\0/g, '')
    .replace(/\.\.+/g, '.')
    .replace(/[/\\]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 100);

  return clean || `upload_${Date.now()}`;
}

/**
 * Sanitizes SVG image content by stripping scripts, external entity declarations, and event attributes.
 */
export function sanitizeSvgContent(svgString: string): { safe: boolean; sanitized?: string; reason?: string } {
  if (!svgString || typeof svgString !== 'string') {
    return { safe: false, reason: 'Invalid SVG content' };
  }

  // Check for XML External Entity (XXE) injection
  if (/<!DOCTYPE\s+[^>]*SYSTEM/i.test(svgString) || /<!ENTITY/i.test(svgString)) {
    return { safe: false, reason: 'XXE entities are forbidden in SVG uploads.' };
  }

  // Check for inline script tags
  if (/<script/i.test(svgString)) {
    return { safe: false, reason: 'Executable <script> elements are forbidden in SVG uploads.' };
  }

  // Strip event handlers
  let sanitized = svgString
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');

  return {
    safe: true,
    sanitized,
  };
}
