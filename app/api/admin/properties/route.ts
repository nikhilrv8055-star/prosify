import { NextRequest, NextResponse } from 'next/server';
import {
  getServerProperties,
  createServerProperty,
  updateServerProperty,
  deleteServerProperty,
} from '@/lib/data/serverStore';
import {
  NO_CACHE_HEADERS,
  createErrorResponse,
  createSuccessResponse,
  executeD1,
} from '@/lib/db/d1';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const properties = getServerProperties();

    if (id) {
      const property = properties.find((p) => p.id === id);
      if (!property) {
        return createErrorResponse('NOT_FOUND', `Property with ID ${id} was not found`, 404);
      }
      return createSuccessResponse({ property });
    }

    return NextResponse.json(
      {
        success: true,
        count: properties.length,
        properties,
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve properties';
    return createErrorResponse('INTERNAL_ERROR', message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object' || !body.title) {
      return createErrorResponse('BAD_REQUEST', 'Property title is required', 400);
    }

    const newProp = createServerProperty(body);

    // Attempt D1 write if DB binding is active (SQLite parameterization)
    try {
      await executeD1(
        `INSERT OR REPLACE INTO properties (
          id, title, slug, type, category, price, location, city, featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newProp.id,
          newProp.title,
          newProp.slug || newProp.id,
          newProp.type || 'BUY',
          newProp.category || 'APARTMENT',
          newProp.price || 0,
          newProp.location || 'Pan-India',
          newProp.city || 'Mumbai',
          newProp.featured ? 1 : 0,
        ]
      );
    } catch (d1Err) {
      console.warn('[D1 Sync Notice]: Non-blocking D1 write:', d1Err);
    }

    return createSuccessResponse(
      {
        message: 'Property created and persisted successfully',
        property: newProp,
      },
      201
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create property';
    return createErrorResponse('INTERNAL_ERROR', message, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return createErrorResponse('BAD_REQUEST', 'Invalid request body', 400);
    }

    const { id, ...data } = body;
    if (!id) {
      return createErrorResponse('BAD_REQUEST', 'Property ID is required for update', 400);
    }

    const updated = updateServerProperty(id, data);
    if (!updated) {
      return createErrorResponse('NOT_FOUND', `Property with ID ${id} was not found`, 404);
    }

    // Synchronize to Cloudflare D1
    try {
      await executeD1(
        `UPDATE properties SET 
          title = ?, price = ?, location = ?, city = ?, featured = ?
         WHERE id = ?`,
        [
          updated.title,
          updated.price || 0,
          updated.location || 'Mumbai',
          updated.city || 'Mumbai',
          updated.featured ? 1 : 0,
          id,
        ]
      );
    } catch (d1Err) {
      console.warn('[D1 Sync Notice]: Non-blocking D1 update:', d1Err);
    }

    return createSuccessResponse({
      message: 'Property updated and persisted successfully',
      property: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update property';
    return createErrorResponse('INTERNAL_ERROR', message, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return createErrorResponse('BAD_REQUEST', 'Property ID query param is required', 400);
    }

    const success = deleteServerProperty(id);
    if (!success) {
      return createErrorResponse('NOT_FOUND', `Property with ID ${id} was not found`, 404);
    }

    // Synchronize to Cloudflare D1
    try {
      await executeD1('DELETE FROM properties WHERE id = ?', [id]);
    } catch (d1Err) {
      console.warn('[D1 Sync Notice]: Non-blocking D1 delete:', d1Err);
    }

    return createSuccessResponse({
      message: 'Property deleted successfully',
      deletedId: id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete property';
    return createErrorResponse('INTERNAL_ERROR', message, 500);
  }
}
