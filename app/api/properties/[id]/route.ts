import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data/service';
import { requireRole } from '@/lib/auth/serverAuth';
import { recordAuditEvent } from '@/lib/security/auditLog';
import { getClientIp } from '@/lib/security/rateLimit';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = (await dataService.getPropertyById(id)) || (await dataService.getPropertyBySlug(id));
    if (!property) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Property not found' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error('API Error in GET /api/properties/[id]:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch property' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);

  // Authentication & RBAC Check: Only Super Admin, Admin, or Developer can update property
  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER']);
  if (auth.errorResponse) return auth.errorResponse;

  const user = auth.user;

  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await dataService.getPropertyById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Property not found' } },
        { status: 404 }
      );
    }

    // Developer can only update properties belonging to their developerId
    if (user.role === 'DEVELOPER' && user.developerId && existing.developerId !== user.developerId) {
      recordAuditEvent({
        actor: user,
        action: 'PROPERTY_UPDATE',
        resource: `/api/properties/${id}`,
        resourceId: id,
        status: 'BLOCKED',
        details: 'Developer attempted to update another developer property',
        ipAddress: ip,
      });

      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'You can only update properties for your developer organization.' } },
        { status: 403 }
      );
    }

    const updated = await dataService.updateProperty(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Property not found' } },
        { status: 404 }
      );
    }

    recordAuditEvent({
      actor: user,
      action: 'PROPERTY_UPDATE',
      resource: `/api/properties/${id}`,
      resourceId: id,
      status: 'SUCCESS',
      details: `Property ${id} updated`,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API Error in PUT /api/properties/[id]:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update property' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);

  // Authentication & RBAC Check: Only Super Admin and Admin can delete property
  const auth = requireRole(req, ['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) return auth.errorResponse;

  const user = auth.user;

  try {
    const { id } = await params;
    const existing = await dataService.getPropertyById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Property not found' } },
        { status: 404 }
      );
    }

    const success = await dataService.deleteProperty(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Property not found' } },
        { status: 404 }
      );
    }

    recordAuditEvent({
      actor: user,
      action: 'PROPERTY_DELETE',
      resource: `/api/properties/${id}`,
      resourceId: id,
      status: 'SUCCESS',
      details: `Property ${id} permanently deleted`,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('API Error in DELETE /api/properties/[id]:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to delete property' } },
      { status: 500 }
    );
  }
}
