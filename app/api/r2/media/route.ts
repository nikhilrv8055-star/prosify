import { NextRequest, NextResponse } from 'next/server';
import { getR2Object, R2_CONFIG } from '@/lib/storage/r2Client';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ success: false, error: 'Key is required' }, { status: 400 });
    }

    // 1. Try to fetch directly from Cloudflare R2
    try {
      const r2Response = await getR2Object({ key });

      if (r2Response.Body) {
        // Convert stream to Buffer / Uint8Array
        const streamToBuffer = async (stream: any): Promise<Buffer> => {
          const chunks: any[] = [];
          for await (const chunk of stream) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          }
          return Buffer.concat(chunks);
        };

        const buffer = await streamToBuffer(r2Response.Body);

        return new NextResponse(buffer, {
          headers: {
            'Content-Type': r2Response.ContentType || 'image/png',
            'Content-Length': String(buffer.length),
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
            ETag: r2Response.ETag || '',
            'X-Source-Storage': 'Cloudflare-R2',
            'X-R2-Bucket': R2_CONFIG.bucketName,
          },
        });
      }
    } catch (r2Err: any) {
      console.warn(`[R2 Media Fetch Notice for ${key}]:`, r2Err.message);
    }

    // 2. Fallback to local mirrored disk storage if available
    const basename = path.basename(key);
    const localCandidate = path.join(UPLOADS_DIR, basename);
    if (fs.existsSync(localCandidate)) {
      const buffer = fs.readFileSync(localCandidate);
      const ext = path.extname(basename).toLowerCase();
      const mime =
        ext === '.svg'
          ? 'image/svg+xml'
          : ext === '.webp'
          ? 'image/webp'
          : ext === '.jpg' || ext === '.jpeg'
          ? 'image/jpeg'
          : 'image/png';

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mime,
          'Content-Length': String(buffer.length),
          'Cache-Control': 'public, max-age=86400',
          'X-Source-Storage': 'Local-Fallback-Cache',
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Requested image not found in Cloudflare R2' },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Error serving R2 media:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to retrieve media' },
      { status: 500 }
    );
  }
}
