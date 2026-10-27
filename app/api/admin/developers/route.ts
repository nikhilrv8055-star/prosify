import { NextRequest, NextResponse } from 'next/server';
import {
  getServerDevelopers,
  createServerDeveloper,
  updateServerDeveloper,
  deleteServerDeveloper,
} from '@/lib/data/serverStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const developers = getServerDevelopers();
    return NextResponse.json(
      { success: true, count: developers.length, developers },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    console.error('Error fetching admin developers:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch developers' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Developer name is required' },
        { status: 400 }
      );
    }

    const newDev = createServerDeveloper(body);
    return NextResponse.json(
      {
        success: true,
        message: 'Developer created and persisted successfully',
        developer: newDev,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating developer:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create developer' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Developer ID is required for update' },
        { status: 400 }
      );
    }

    const updated = updateServerDeveloper(id, data);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Developer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Developer updated and persisted successfully',
      developer: updated,
    });
  } catch (error: any) {
    console.error('Error updating developer:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update developer' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Developer ID query param is required' },
        { status: 400 }
      );
    }

    const success = deleteServerDeveloper(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Developer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Developer deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting developer:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete developer' },
      { status: 500 }
    );
  }
}
