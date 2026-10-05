import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAuth } from '@/lib/auth/serverAuth';
import { applyRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { validateOutboundUrl } from '@/lib/security/ssrf';
import { sanitizeFilename, sanitizeSvgContent } from '@/lib/security/sanitizer';
import { recordAuditEvent } from '@/lib/security/auditLog';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file
const MAX_TOTAL_SIZE = 15 * 1024 * 1024; // 15 MB total
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/svg+xml',
  'application/pdf',
]);

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg', 'pdf']);

// Blocked dangerous extensions
const FORBIDDEN_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'php', 'phtml', 'asp', 'aspx', 'jsp',
  'js', 'mjs', 'ts', 'html', 'htm', 'xhtml', 'vbs', 'py', 'pl', 'cgi',
]);

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 1. Rate limiting (20 uploads per minute per IP)
  const rateLimitResponse = applyRateLimit(
    req,
    { limit: 20, windowMs: 60 * 1000 },
    'file_upload'
  );
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Authentication check: only authenticated users can upload files
  const auth = requireAuth(req);
  if (auth.errorResponse) {
    return auth.errorResponse;
  }
  const user = auth.user;

  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle multipart/form-data upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const files = formData.getAll('files') as File[];
      const singleFile = formData.get('file') as File | null;

      const uploadFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

      if (uploadFiles.length === 0) {
        return NextResponse.json(
          { success: false, error: { code: 'EMPTY_FILES', message: 'No files provided for upload.' } },
          { status: 400 }
        );
      }

      let totalSize = 0;
      const results: { url: string; name: string; size: number; type: string }[] = [];

      for (const file of uploadFiles) {
        totalSize += file.size;

        // Size check
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'FILE_TOO_LARGE',
                message: `File "${file.name}" exceeds the maximum allowed size of 5 MB.`,
              },
            },
            { status: 400 }
          );
        }

        // Extension check
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        if (FORBIDDEN_EXTENSIONS.has(ext) || !ALLOWED_EXTENSIONS.has(ext)) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'FORBIDDEN_FILE_EXTENSION',
                message: `File extension ".${ext}" is not permitted. Allowed: ${Array.from(ALLOWED_EXTENSIONS).join(', ')}`,
              },
            },
            { status: 400 }
          );
        }

        // MIME type check
        if (!ALLOWED_MIME_TYPES.has(file.type)) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'INVALID_MIME_TYPE',
                message: `File type "${file.type}" is not supported. Allowed: JPEG, PNG, WEBP, AVIF, SVG, PDF.`,
              },
            },
            { status: 400 }
          );
        }

        const arrayBuffer = await file.arrayBuffer();
        let buffer = Buffer.from(arrayBuffer);

        // SVG Sanitization
        if (file.type === 'image/svg+xml') {
          const svgContent = buffer.toString('utf8');
          const sanitizeRes = sanitizeSvgContent(svgContent);
          if (!sanitizeRes.safe) {
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: 'MALICIOUS_SVG_DETECTED',
                  message: `SVG security verification failed: ${sanitizeRes.reason}`,
                },
              },
              { status: 400 }
            );
          }
          if (sanitizeRes.sanitized) {
            buffer = Buffer.from(sanitizeRes.sanitized, 'utf8');
          }
        }

        // Randomized safe filename to prevent collision and path traversal
        const randomId = crypto.randomBytes(16).toString('hex');
        const safeName = `${randomId}.${ext}`;
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        results.push({
          url: dataUrl,
          name: sanitizeFilename(file.name),
          size: buffer.length,
          type: file.type,
        });

        // Audit log each file upload
        recordAuditEvent({
          actor: user,
          action: 'FILE_UPLOAD',
          resource: `/api/upload/${safeName}`,
          status: 'SUCCESS',
          details: `Uploaded ${file.type} (${buffer.length} bytes)`,
          ipAddress: ip,
        });
      }

      if (totalSize > MAX_TOTAL_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'TOTAL_SIZE_EXCEEDED',
              message: 'Total upload batch size exceeds 15 MB limit.',
            },
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        count: results.length,
        data: results.length === 1 ? results[0] : results,
        url: results[0]?.url,
      });
    }

    // Handle JSON payload with base64 dataUrl or remote URL
    if (contentType.includes('application/json')) {
      const body = await req.json();

      // Remote URL validation against SSRF
      if (body.url) {
        const urlValidation = validateOutboundUrl(body.url);
        if (!urlValidation.valid) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'SSRF_BLOCKED',
                message: `Remote URL rejected: ${urlValidation.reason}`,
              },
            },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          url: urlValidation.sanitizedUrl,
          name: sanitizeFilename(body.name || 'image.jpg'),
        });
      }

      if (body.dataUrl) {
        const match = body.dataUrl.match(/^data:([^;]+);base64,/);
        if (!match) {
          return NextResponse.json(
            { success: false, error: { code: 'INVALID_DATA_URL', message: 'Malformed dataUrl format.' } },
            { status: 400 }
          );
        }

        const mime = match[1];
        if (!ALLOWED_MIME_TYPES.has(mime)) {
          return NextResponse.json(
            { success: false, error: { code: 'DISALLOWED_MIME', message: `Data URL MIME "${mime}" is not permitted.` } },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          url: body.dataUrl,
          name: sanitizeFilename(body.name || 'uploaded-image.png'),
        });
      }

      return NextResponse.json(
        { success: false, error: { code: 'MISSING_PAYLOAD', message: 'Please provide either a file, dataUrl, or url' } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Unsupported Content-Type.' } },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in /api/upload:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: 'Failed to process secure file upload.',
        },
      },
      { status: 500 }
    );
  }
}
