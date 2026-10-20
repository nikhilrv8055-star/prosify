import { NextRequest, NextResponse } from 'next/server';
import {
  generateR2PresignedUploadUrl,
  buildR2Key,
  R2_CONFIG,
} from '@/lib/storage/r2Client';
import fs from 'fs';
import path from 'path';

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'system_settings.json');

/**
 * POST /api/r2/presigned-url
 * Generates a presigned PUT URL using @aws-sdk/s3-request-presigner
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, contentType, type = 'general', isWebsiteLogo = false } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { success: false, error: 'Both filename and contentType are required.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(contentType.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported image format (${contentType}). Only PNG, JPG, WEBP, SVG, and GIF are allowed.`,
        },
        { status: 400 }
      );
    }

    const prefix = isWebsiteLogo ? 'logo' : type;
    const key = buildR2Key(filename, prefix);

    // Generate Presigned PUT URL valid for 5 minutes
    const { presignedUrl } = await generateR2PresignedUploadUrl({
      key,
      contentType,
      expiresInSeconds: 300,
    });

    const targetMediaUrl = `/api/r2/media?key=${encodeURIComponent(key)}&v=${Date.now()}`;

    return NextResponse.json({
      success: true,
      presignedUrl,
      key,
      bucket: R2_CONFIG.bucketName,
      folder: R2_CONFIG.folderPath,
      targetMediaUrl,
      universalLogoUrl: isWebsiteLogo ? `/api/brand/logo?v=${Date.now()}` : undefined,
      expiresInSeconds: 300,
    });
  } catch (error: any) {
    console.error('Error generating presigned URL for R2:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate presigned upload URL' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/r2/presigned-url
 * Confirmation callback after direct client-to-R2 presigned upload
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, filename, isWebsiteLogo, brandName } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: 'Key is required' }, { status: 400 });
    }

    if (isWebsiteLogo) {
      let currentSettings: any = {};
      try {
        if (fs.existsSync(SETTINGS_FILE)) {
          currentSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
        }
      } catch {}

      const timestamp = Date.now();
      const universalLogoUrl = `/api/brand/logo?v=${timestamp}`;
      const r2LogoUrl = `/api/r2/media?key=${encodeURIComponent(key)}&v=${timestamp}`;

      const updatedSettings = {
        ...currentSettings,
        agencyName: brandName || currentSettings.agencyName || 'Prosify Technologies Private Limited',
        logoUrl: universalLogoUrl,
        r2LogoKey: key,
        r2LogoUrl,
        r2Bucket: R2_CONFIG.bucketName,
        logoName: filename || 'Website Logo',
        logoUploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        published: true,
      };

      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2), 'utf-8');

      return NextResponse.json({
        success: true,
        message: 'R2 Logo upload confirmed and published to website!',
        settings: updatedSettings,
        universalLogoUrl,
      });
    }

    return NextResponse.json({ success: true, message: 'Upload confirmed' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Confirmation failed' },
      { status: 500 }
    );
  }
}
