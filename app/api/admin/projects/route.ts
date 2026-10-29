import { NextRequest, NextResponse } from 'next/server';
import {
  getServerProjects,
  createServerProject,
  updateServerProject,
  deleteServerProject,
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

    const projects = getServerProjects();

    if (id) {
      const project = projects.find((p) => p.id === id);
      if (!project) {
        return createErrorResponse('NOT_FOUND', `Project with ID ${id} was not found`, 404);
      }
      return createSuccessResponse({ project });
    }

    return NextResponse.json(
      {
        success: true,
        count: projects.length,
        projects,
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve projects';
    return createErrorResponse('INTERNAL_ERROR', message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object' || !body.name) {
      return createErrorResponse('BAD_REQUEST', 'Project name is required', 400);
    }

    const newProj = createServerProject(body);

    // Synchronize to Cloudflare D1 with parameterized bindings
    try {
      await executeD1(
        `INSERT OR REPLACE INTO projects (
          id, name, slug, developer_id, developer_name, location, city, starting_price, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newProj.id,
          newProj.name,
          newProj.slug || newProj.id,
          newProj.developerId || 'DEV_GENERIC',
          newProj.developerName || 'Prosify Developer',
          newProj.location || 'Mumbai',
          newProj.city || 'Mumbai',
          newProj.startingPrice || 0,
          newProj.status || 'UNDER_CONSTRUCTION',
        ]
      );
    } catch (d1Err) {
      console.warn('[D1 Sync Notice]: Non-blocking D1 project insert:', d1Err);
    }

    return createSuccessResponse(
      {
        message: 'Project created and persisted successfully',
        project: newProj,
      },
      201
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return createErrorResponse('INTERNAL_ERROR', message, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return createErrorResponse('BAD_REQUEST', 'Invalid request payload', 400);
    }

    const { id, ...data } = body;
    if (!id) {
      return createErrorResponse('BAD_REQUEST', 'Project ID is required for update', 400);
    }

    const updated = updateServerProject(id, data);
    if (!updated) {
      return createErrorResponse('NOT_FOUND', `Project with ID ${id} was not found`, 404);
    }

    // Synchronize to Cloudflare D1
    try {
      await executeD1(
        `UPDATE projects SET 
          name = ?, location = ?, city = ?, starting_price = ?, status = ?
         WHERE id = ?`,
        [
          updated.name,
          updated.location || 'Mumbai',
          updated.city || 'Mumbai',
          updated.startingPrice || 0,
          updated.status || 'UNDER_CONSTRUCTION',
          id,
        ]
      );
    } catch (d1Err) {
      console.warn('[D1 Sync Notice]: Non-blocking D1 project update:', d1Err);
    }

    return createSuccessResponse({
      message: 'Project updated and persisted successfully',
      project: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return createErrorResponse('INTERNAL_ERROR', message, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return createErrorResponse('BAD_REQUEST', 'Project ID query param is required', 400);
    }

    const success = deleteServerProject(id);
    if (!success) {
      return createErrorResponse('NOT_FOUND', `Project with ID ${id} was not found`, 404);
    }

    // Synchronize to Cloudflare D1
    try {
      await executeD1('DELETE FROM projects WHERE id = ?', [id]);
    } catch (d1Err) {
      console.warn('[D1 Sync Notice]: Non-blocking D1 project delete:', d1Err);
    }

    return createSuccessResponse({
      message: 'Project deleted successfully',
      deletedId: id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    return createErrorResponse('INTERNAL_ERROR', message, 500);
  }
}
