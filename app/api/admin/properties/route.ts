import { NextRequest, NextResponse } from 'next/server';
import {
  getServerProperties,
  createServerProperty,
  updateServerProperty,
  deleteServerProperty,
} from '@/lib/data/serverStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const properties = getServerProperties();
    return NextResponse.json(
      { success: true, count: properties.length, properties },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    console.error('Error fetching admin properties:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Property title is required' },
        { status: 400 }
      );
    }

    const newProp = createServerProperty(body);
    return NextResponse.json(
      {
        success: true,
        message: 'Property created and persisted successfully',
        property: newProp,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create property' },
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
        { success: false, error: 'Property ID is required for update' },
        { status: 400 }
      );
    }

    const updated = updateServerProperty(id, data);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Property updated and persisted successfully',
      property: updated,
    });
  } catch (error: any) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update property' },
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
        { success: false, error: 'Property ID query param is required' },
        { status: 400 }
      );
    }

    const success = deleteServerProperty(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete property' },
      { status: 500 }
    );
  }
}
