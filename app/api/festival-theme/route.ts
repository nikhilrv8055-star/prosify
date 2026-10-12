import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_FESTIVAL_CONFIG, type FestivalThemeConfig } from '@/lib/theme/festivalThemeStore';

// In-memory cache for server-side persistence
let cachedThemeConfig: FestivalThemeConfig = { ...DEFAULT_FESTIVAL_CONFIG };

export async function GET() {
  return NextResponse.json({
    success: true,
    config: cachedThemeConfig,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    cachedThemeConfig = {
      ...cachedThemeConfig,
      ...body,
      holidayCustomizations: {
        ...cachedThemeConfig.holidayCustomizations,
        ...(body.holidayCustomizations || {}),
      },
      updatedAt: new Date().toISOString(),
      updatedBy: body.updatedBy || 'Admin (Live Sync)',
    };

    return NextResponse.json({
      success: true,
      message: 'Festival celebration theme updated and synced successfully',
      config: cachedThemeConfig,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update festival theme' },
      { status: 400 }
    );
  }
}
