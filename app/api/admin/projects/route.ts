import { NextRequest, NextResponse } from 'next/server';
import {
  getServerProjects,
  createServerProject,
  updateServerProject,
  deleteServerProject,
} from '@/lib/data/serverStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const projects = getServerProjects();
    return NextResponse.json(
      { success: true, count: projects.length, projects },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    console.error('Error fetching admin projects:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      );
    }

    const newProj = createServerProject(body);
    return NextResponse.json(
      {
        success: true,
        message: 'Project created and persisted successfully',
        project: newProj,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create project' },
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
        { success: false, error: 'Project ID is required for update' },
        { status: 400 }
      );
    }

    const updated = updateServerProject(id, data);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project updated and persisted successfully',
      project: updated,
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update project' },
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
        { success: false, error: 'Project ID query param is required' },
        { status: 400 }
      );
    }

    const success = deleteServerProject(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
