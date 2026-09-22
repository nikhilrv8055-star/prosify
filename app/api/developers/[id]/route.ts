import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data/service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const developer = (await dataService.getDeveloperById(id)) || (await dataService.getDeveloperBySlug(id));
    if (!developer) {
      return NextResponse.json({ success: false, error: 'Developer not found' }, { status: 404 });
    }

    const allProjects = await dataService.getProjects();
    const developerProjects = allProjects.filter((p) => p.developerId === developer.id || p.developerName === developer.name);

    return NextResponse.json({
      success: true,
      data: developer,
      projects: developerProjects,
    });
  } catch (error) {
    console.error('API Error in GET /api/developers/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch developer' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await dataService.updateDeveloper(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Developer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API Error in PUT /api/developers/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to update developer' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await dataService.deleteDeveloper(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Developer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Developer removed successfully' });
  } catch (error) {
    console.error('API Error in DELETE /api/developers/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete developer' }, { status: 500 });
  }
}
