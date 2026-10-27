import { NextRequest, NextResponse } from 'next/server';
import {
  getServerHomepageCms,
  saveServerHomepageCms,
  CmsSectionConfig,
} from '@/lib/data/serverStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sections = getServerHomepageCms();
    return NextResponse.json(
      { success: true, count: sections.length, sections },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    console.error('Error fetching homepage CMS:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch CMS settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body.sections)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: sections must be an array' },
        { status: 400 }
      );
    }

    saveServerHomepageCms(body.sections as CmsSectionConfig[]);
    return NextResponse.json({
      success: true,
      message: 'Homepage CMS saved and published live to website',
      sections: body.sections,
    });
  } catch (error: any) {
    console.error('Error saving homepage CMS:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save CMS settings' },
      { status: 500 }
    );
  }
}
