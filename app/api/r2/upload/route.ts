import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  uploadBufferToR2,
  buildR2Key,
  R2_CONFIG,
} from '@/lib/storage/r2Client';

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const SETTINGS_FILE = path.join(DATA_DIR, 'system_settings.json');

// Permitted MIME types
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'general';
    const isWebsiteLogo =
      formData.get('isWebsiteLogo') === 'true' || type === 'logo';
    const brandName = (formData.get('brandName') as string) || '';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided in request.' },
        { status: 400 }
      );
    }

    // 1. File Type Validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file format (${file.type}). Allowed image formats: PNG, JPG, JPEG, WEBP, SVG, GIF.`,
        },
        { status: 400 }
      );
    }

    // 2. File Size Validation (Max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 10MB limit.`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || (file.type === 'image/svg+xml' ? '.svg' : '.png');

    // 3. Build Unique Key within Cloudflare R2 Photos/ folder
    const prefix = isWebsiteLogo ? 'logo' : type;
    const r2Key = buildR2Key(file.name, prefix);

    // 4. Upload directly to Cloudflare R2 Storage Bucket
    let r2UploadResult: any = null;
    let r2Success = false;
    let r2ErrorMsg = '';

    try {
      r2UploadResult = await uploadBufferToR2({
        buffer,
        key: r2Key,
        contentType: file.type || 'image/png',
        metadata: {
          originalFilename: file.name,
          uploadedAt: new Date().toISOString(),
          type,
          isWebsiteLogo: String(isWebsiteLogo),
        },
      });
      r2Success = true;
    } catch (r2Err: any) {
      console.error('[Cloudflare R2 Upload Error]:', r2Err);
      r2ErrorMsg = r2Err.message || 'R2 Upload error';
    }

    // 5. Mirror to persistent local disk for zero-downtime fallback
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });

    const localFilename = isWebsiteLogo ? `website_logo${ext}` : path.basename(r2Key);
    fs.writeFileSync(path.join(UPLOADS_DIR, localFilename), buffer);
    try {
      fs.writeFileSync(path.join(PUBLIC_UPLOADS_DIR, localFilename), buffer);
    } catch {}

    // 6. Generate Public Proxy / Media URLs
    const timestamp = Date.now();
    const mediaProxyUrl = `/api/r2/media?key=${encodeURIComponent(r2Key)}&v=${timestamp}`;
    const universalLogoUrl = `/api/brand/logo?v=${timestamp}`;

    // 7. If this is a website logo, atomically update system_settings.json
    let updatedSettings: any = null;
    if (isWebsiteLogo) {
      let currentSettings: any = {};
      try {
        if (fs.existsSync(SETTINGS_FILE)) {
          currentSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
        }
      } catch {}

      updatedSettings = {
        ...currentSettings,
        agencyName: brandName || currentSettings.agencyName || 'Prosify Technologies Private Limited',
        logoUrl: universalLogoUrl,
        r2LogoKey: r2Key,
        r2LogoUrl: mediaProxyUrl,
        r2Bucket: R2_CONFIG.bucketName,
        r2Endpoint: R2_CONFIG.endpoint,
        logoName: file.name,
        logoType: file.type,
        logoSize: file.size,
        logoUploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        published: true,
      };

      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2), 'utf-8');
    }

    return NextResponse.json(
      {
        success: true,
        message: r2Success
          ? `File successfully stored in Cloudflare R2 bucket "${R2_CONFIG.bucketName}" under folder "${R2_CONFIG.folderPath}"!`
          : `Saved locally; R2 sync notice: ${r2ErrorMsg}`,
        key: r2Key,
        bucket: R2_CONFIG.bucketName,
        folder: R2_CONFIG.folderPath,
        mediaUrl: mediaProxyUrl,
        universalLogoUrl: isWebsiteLogo ? universalLogoUrl : undefined,
        settings: updatedSettings,
        fileInfo: {
          originalName: file.name,
          contentType: file.type,
          sizeBytes: file.size,
          sizeFormatted: `${(file.size / 1024).toFixed(1)} KB`,
          etag: r2UploadResult?.etag,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('R2 upload endpoint error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server upload processing failed' },
      { status: 500 }
    );
  }
}
