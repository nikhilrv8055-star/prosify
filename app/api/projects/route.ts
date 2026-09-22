import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data/service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || undefined;
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    const projects = await dataService.getProjects({ city, search, status });
    return NextResponse.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('API Error in GET /api/projects:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.city || !body.developerName) {
      return NextResponse.json({ success: false, error: 'Name, city and developerName are required' }, { status: 400 });
    }

    const newProject = await dataService.createProject(body);
    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/projects:', error);
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}
