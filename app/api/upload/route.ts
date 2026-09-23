import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
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
          { success: false, error: 'No files provided for upload.' },
          { status: 400 }
        );
      }

      const results: { url: string; name: string; size: number; type: string }[] = [];

      for (const file of uploadFiles) {
        if (!file.type.startsWith('image/')) {
          return NextResponse.json(
            { success: false, error: `Invalid file type "${file.type}". Only images are permitted.` },
            { status: 400 }
          );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        results.push({
          url: dataUrl,
          name: file.name,
          size: file.size,
          type: file.type,
        });
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
      if (body.url) {
        return NextResponse.json({
          success: true,
          url: body.url,
          name: body.name || 'image.jpg',
        });
      }

      if (body.dataUrl) {
        return NextResponse.json({
          success: true,
          url: body.dataUrl,
          name: body.name || 'uploaded-image.png',
        });
      }

      return NextResponse.json(
        { success: false, error: 'Please provide either a file, dataUrl, or url' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported Content-Type. Use multipart/form-data or application/json.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in /api/upload:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process image upload.' },
      { status: 500 }
    );
  }
}
