import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { requireAuth } from '@/lib/auth/serverAuth';
import { recordAuditEvent } from '@/lib/security/auditLog';
import { getClientIp } from '@/lib/security/rateLimit';
import { sanitizeUserInput } from '@/lib/security/sanitizer';

const VALID_STATUSES = new Set([
  'NEW',
  'CONTACTED',
  'FOLLOW_UP',
  'SITE_VISIT_SCHEDULED',
  'SITE_VISIT_COMPLETED',
  'NEGOTIATION',
  'BOOKED',
  'LOST',
  'DROPPED',
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);
  const auth = requireAuth(req);
  if (auth.errorResponse) return auth.errorResponse;

  const user = auth.user;

  try {
    const { id } = await params;
    const body = await req.json();

    // IDOR Protection: verify lead exists and user has authorization to touch it
    const existingLead = store.getLeads().find((l) => l.id === id);
    if (!existingLead) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Lead not found' } },
        { status: 404 }
      );
    }

    // Role check: Only Admins, Sales Managers, and the assigned Sales Agent can update
    const isLeadManager = ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'].includes(user.role);
    const isAssignedAgent =
      (user.role === 'SALES_AGENT' || user.role === 'SALES_EXECUTIVE') &&
      (existingLead.assignedTo?.toLowerCase().includes(user.name.toLowerCase()) ||
        existingLead.assignedTo === user.id);

    if (!isLeadManager && !isAssignedAgent) {
      recordAuditEvent({
        actor: user,
        action: 'LEAD_STATUS_UPDATE',
        resource: `/api/leads/${id}`,
        resourceId: id,
        status: 'BLOCKED',
        details: 'Attempted to modify unauthorized lead record',
        ipAddress: ip,
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You are not authorized to update this lead record.',
          },
        },
        { status: 403 }
      );
    }

    if (body.status) {
      if (!VALID_STATUSES.has(body.status)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_STATUS',
              message: `Status must be one of: ${Array.from(VALID_STATUSES).join(', ')}`,
            },
          },
          { status: 400 }
        );
      }

      const cleanNotes = body.notes ? sanitizeUserInput(body.notes) : undefined;
      const updated = store.updateLeadStatus(id, body.status, cleanNotes);

      recordAuditEvent({
        actor: user,
        action: 'LEAD_STATUS_UPDATE',
        resource: `/api/leads/${id}`,
        resourceId: id,
        status: 'SUCCESS',
        details: `Lead status changed from ${existingLead.status} to ${body.status}`,
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, data: updated });
    }

    if (body.assignedTo) {
      // Only Sales Managers and Admins can reassign leads
      if (!isLeadManager) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Only Sales Managers and Administrators can reassign leads.',
            },
          },
          { status: 403 }
        );
      }

      const cleanAssignee = sanitizeUserInput(body.assignedTo);
      const updated = store.assignLead(id, cleanAssignee);

      recordAuditEvent({
        actor: user,
        action: 'LEAD_ASSIGN',
        resource: `/api/leads/${id}`,
        resourceId: id,
        status: 'SUCCESS',
        details: `Lead reassigned to ${cleanAssignee}`,
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'No valid update field provided' } },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error('Error updating lead:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Could not update lead' } },
      { status: 500 }
    );
  }
}
