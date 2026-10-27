import { NextRequest, NextResponse } from 'next/server';
import { resetServerDataToDefaults } from '@/lib/data/serverStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const stats = resetServerDataToDefaults();
    return NextResponse.json({
      success: true,
      message: 'All property, project, developer, and CMS records have been reset to verified curated defaults.',
      stats,
    });
  } catch (error: any) {
    console.error('Error resetting server data:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to reset server data' },
      { status: 500 }
    );
  }
}
