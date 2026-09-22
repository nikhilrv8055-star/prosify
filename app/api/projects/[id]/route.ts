import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data/service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = (await dataService.getProjectById(id)) || (await dataService.getProjectBySlug(id));
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const hierarchy = await dataService.getInventoryHierarchy(project.id);
    return NextResponse.json({ success: true, data: project, inventory: hierarchy });
  } catch (error) {
    console.error('API Error in GET /api/projects/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await dataService.updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API Error in PUT /api/projects/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await dataService.deleteProject(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Project archived successfully' });
  } catch (error) {
    console.error('API Error in DELETE /api/projects/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
