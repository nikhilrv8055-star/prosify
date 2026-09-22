import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'leads';

  if (type === 'leads') {
    const leads = store.getLeads();
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Source', 'Project', 'Status', 'Budget', 'Date'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name}"`,
      l.phone,
      l.email || '',
      l.source,
      `"${l.projectName || l.propertyTitle || ''}"`,
      l.status,
      `"${l.budget || ''}"`,
      l.createdAt.split('T')[0],
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads_report.csv"',
      },
    });
  }

  if (type === 'commissions') {
    const comms = store.getCommissions();
    const headers = ['ID', 'Partner Code', 'Partner Name', 'Project', 'Unit', 'Amount', 'Rate %', 'Status', 'Date'];
    const rows = comms.map((c) => [
      c.id,
      c.partnerCode,
      `"${c.partnerName}"`,
      `"${c.projectName}"`,
      c.unitNumber,
      c.amount,
      c.ratePercent,
      c.status,
      c.createdAt.split('T')[0],
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="commissions_report.csv"',
      },
    });
  }

  return NextResponse.json({ success: false, message: 'Invalid report type' }, { status: 400 });
}
