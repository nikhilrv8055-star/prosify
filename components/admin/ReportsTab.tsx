'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Building,
  Users,
  IndianRupee,
} from 'lucide-react';
import { Property, Lead, ChannelPartner, Commission, Unit } from '@/lib/types';

interface ReportsTabProps {
  properties: Property[];
  leads: Lead[];
  partners: ChannelPartner[];
  commissions: Commission[];
  units: Unit[];
}

export function ReportsTab({
  properties,
  leads,
  partners,
  commissions,
  units,
}: ReportsTabProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportRera = () => {
    setDownloadingId('rera');
    setTimeout(() => {
      const headers = ['Property Title', 'Developer', 'City', 'Locality', 'MahaRERA ID', 'Price INR', 'Carpet SqFt', 'Status'];
      const rows = properties.map((p) => [
        p.title,
        p.developerName || '',
        p.city,
        p.locality,
        p.reraNumber || 'Applied',
        p.price,
        p.carpetArea,
        p.isPublished ? 'LIVE' : 'UNLISTED',
      ]);
      downloadCSV(`MahaRERA_Compliance_Register_${Date.now()}.csv`, headers, rows);
      setDownloadingId(null);
    }, 400);
  };

  const handleExportTds = () => {
    setDownloadingId('tds');
    setTimeout(() => {
      const headers = ['Ref ID', 'Partner Name', 'Property', 'Agreement Value INR', 'Gross Brokerage INR', 'TDS 5% Deduction INR', 'Net Disbursed INR', 'Status'];
      const rows = commissions.map((c) => {
        const tds = c.tdsDeducted || Math.round(c.amount * 0.05);
        const net = c.netPayable || (c.amount - tds);
        return [
          c.id,
          c.partnerName,
          c.propertyTitle || c.projectName || 'Property Deal',
          c.agreementValue || (c.amount * 50),
          c.amount,
          tds,
          net,
          c.status,
        ];
      });
      downloadCSV(`Section_194H_Brokerage_TDS_Audit_${Date.now()}.csv`, headers, rows);
      setDownloadingId(null);
    }, 400);
  };

  const handleExportLeads = () => {
    setDownloadingId('leads');
    setTimeout(() => {
      const headers = ['Lead ID', 'Name', 'Phone', 'Email', 'Source', 'Budget', 'Interested Property', 'Stage', 'Date'];
      const rows = leads.map((l) => [
        l.id,
        l.name,
        l.phone,
        l.email || '',
        l.source || '',
        l.budget || '',
        l.propertyTitle || '',
        l.status || '',
        new Date(l.createdAt).toISOString().split('T')[0],
      ]);
      downloadCSV(`Omnichannel_Leads_Attribution_${Date.now()}.csv`, headers, rows);
      setDownloadingId(null);
    }, 400);
  };

  const handleExportInventory = () => {
    setDownloadingId('inventory');
    setTimeout(() => {
      const headers = ['Unit ID', 'Unit Number', 'Tower', 'Floor', 'BHK', 'Carpet Area SqFt', 'Base Price INR', 'Status'];
      const rows = units.map((u) => [
        u.id,
        u.unitNumber,
        u.tower,
        u.floor,
        u.bhk,
        u.carpetArea,
        u.basePrice || u.price,
        u.status,
      ]);
      downloadCSV(`Tower_Unit_Inventory_Matrix_${Date.now()}.csv`, headers, rows);
      setDownloadingId(null);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#10B981]" />
          <span>Statutory Compliance & Operations Audit Reports</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          One-click generation of certified MahaRERA disclosures, Section 194H TDS ledgers, and inventory audits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Report 1 */}
        <div className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <h3 className="text-sm font-bold text-white">MahaRERA Statutory Catalog Disclosure</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official catalog report with certificate numbers, developer entities, and active public marketing statuses.
            </p>
            <span className="text-[10px] text-slate-500 font-mono block">Format: CSV | Updated Real-time</span>
          </div>

          <button
            onClick={handleExportRera}
            disabled={downloadingId === 'rera'}
            className="px-3 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer flex-shrink-0 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingId === 'rera' ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>

        {/* Report 2 */}
        <div className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Section 194H Brokerage TDS Audit Register</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tax deductions statement detailing gross brokerages, 5% TDS deductions, and net disbursements.
            </p>
            <span className="text-[10px] text-slate-500 font-mono block">Format: CSV | Income Tax Compliance</span>
          </div>

          <button
            onClick={handleExportTds}
            disabled={downloadingId === 'tds'}
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer flex-shrink-0 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingId === 'tds' ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>

        {/* Report 3 */}
        <div className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0EA5E9]" />
              <h3 className="text-sm font-bold text-white">Omnichannel Lead Attribution Matrix</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full inbound lead trail with campaign sources, phone records, budget brackets, and pipeline stages.
            </p>
            <span className="text-[10px] text-slate-500 font-mono block">Format: CSV | Marketing Intelligence</span>
          </div>

          <button
            onClick={handleExportLeads}
            disabled={downloadingId === 'leads'}
            className="px-3 py-2 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer flex-shrink-0 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingId === 'leads' ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>

        {/* Report 4 */}
        <div className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Tower Inventory & Sold-Out Matrix</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete unit-level breakdown across all towers, floor plates, carpet areas, and booking states.
            </p>
            <span className="text-[10px] text-slate-500 font-mono block">Format: CSV | Operations</span>
          </div>

          <button
            onClick={handleExportInventory}
            disabled={downloadingId === 'inventory'}
            className="px-3 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer flex-shrink-0 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingId === 'inventory' ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
