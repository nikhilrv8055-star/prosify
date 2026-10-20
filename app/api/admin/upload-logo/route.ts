import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const SETTINGS_FILE = path.join(DATA_DIR, 'system_settings.json');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('logo') as File | null;
    const brandName = formData.get('brandName') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No logo file provided' }, { status: 400 });
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Ensure directories exist
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
      fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.png';
    const filename = `website_logo${ext}`;
    const targetFilePath = path.join(UPLOADS_DIR, filename);
    const publicFilePath = path.join(PUBLIC_UPLOADS_DIR, filename);

    // Save to persistent storage and public directory
    fs.writeFileSync(targetFilePath, buffer);
    try {
      fs.writeFileSync(publicFilePath, buffer);
    } catch (e) {
      console.warn('Could not mirror to public uploads directory:', e);
    }

    // Timestamped universal logo URL for cache-busting
    const timestamp = Date.now();
    const universalLogoUrl = `/api/brand/logo?v=${timestamp}`;

    // Update system_settings.json atomically
    let currentSettings: any = {};
    try {
      if (fs.existsSync(SETTINGS_FILE)) {
        currentSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      }
    } catch {}

    const updatedSettings = {
      ...currentSettings,
      agencyName: brandName || currentSettings.agencyName || 'Prosify Technologies Private Limited',
      logoUrl: universalLogoUrl,
      logoName: file.name,
      logoType: file.type || 'image/png',
      logoUploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: true,
    };

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2), 'utf-8');

    return NextResponse.json(
      {
        success: true,
        message: 'Logo uploaded and published universally across all browsers and devices!',
        logoUrl: universalLogoUrl,
        settings: updatedSettings,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to upload logo' },
      { status: 500 }
    );
  }
}
