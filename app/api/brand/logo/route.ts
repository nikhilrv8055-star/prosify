import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const SETTINGS_FILE = path.join(DATA_DIR, 'system_settings.json');

const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

export async function GET(req: NextRequest) {
  try {
    // 1. Check if custom uploaded logo file exists in data/uploads
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif'];
    for (const ext of allowedExtensions) {
      const candidate = path.join(UPLOADS_DIR, `website_logo${ext}`);
      if (fs.existsSync(candidate)) {
        const buffer = fs.readFileSync(candidate);
        const mimeType = MIME_MAP[ext] || 'image/png';
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=30, must-revalidate',
          },
        });
      }
    }

    // 2. Check system_settings.json for a direct URL
    if (fs.existsSync(SETTINGS_FILE)) {
      try {
        const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
        if (settings.logoUrl && !settings.logoUrl.startsWith('/api/brand/logo')) {
          return NextResponse.redirect(new URL(settings.logoUrl, req.url));
        }
      } catch {}
    }

    // 3. Fallback: Check public/logo.png
    const defaultLogoPath = path.join(process.cwd(), 'public', 'logo.png');
    if (fs.existsSync(defaultLogoPath)) {
      const buffer = fs.readFileSync(defaultLogoPath);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=30, must-revalidate',
        },
      });
    }

    // 4. Fallback transparent 1x1 png or 404
    return new NextResponse(null, { status: 404 });
  } catch (error: any) {
    console.error('Error serving brand logo:', error);
    return new NextResponse(null, { status: 500 });
  }
}
