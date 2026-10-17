import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const all = serverAffiliateDb.getAllAffiliates(search, status);
    const total = all.length;
    const startIndex = (page - 1) * limit;
    const paginated = all.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      count: paginated.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      affiliates: paginated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Affiliate ID is required' }, { status: 400 });
    }

    if (action === 'toggle_status') {
      const updated = serverAffiliateDb.toggleStatus(id);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Affiliate not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Affiliate account is now ${updated.status}`,
        affiliate: updated,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
