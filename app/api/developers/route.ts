import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data/service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const verifiedOnly = searchParams.get('verified') === 'true';

    const developers = await dataService.getDevelopers({ search, verifiedOnly });
    return NextResponse.json({ success: true, count: developers.length, data: developers });
  } catch (error) {
    console.error('API Error in GET /api/developers:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch developers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Developer name is required' }, { status: 400 });
    }

    const newDev = await dataService.createDeveloper(body);
    return NextResponse.json({ success: true, data: newDev }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/developers:', error);
    return NextResponse.json({ success: false, error: 'Failed to create developer' }, { status: 500 });
  }
}
