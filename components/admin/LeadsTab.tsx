'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Phone,
  MessageSquare,
  PlusCircle,
  Download,
  Calendar,
  Building,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
} from 'lucide-react';
import { Lead, LeadStatus, LeadSourceType } from '@/lib/types';
import { store } from '@/lib/data/store';
import { useToast } from '@/components/ui/toast';
import { PAN_INDIA_CITIES } from '@/lib/data/panIndiaData';

interface LeadsTabProps {
  leads: Lead[];
  onRefresh: () => void;
}

export function LeadsTab({ leads, onRefresh }: LeadsTabProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // New Lead Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '+91 ',
    email: '',
    source: 'META_ADS' as LeadSourceType,
    budget: '₹80 Lakh - ₹1.2 Cr',
    location: 'Kalyan West',
    propertyTitle: 'Godrej Riviera',
    notes: 'Inquired about 2 BHK high floor unit.',
    assignedTo: 'Vikramaditya S.',
  });

  const sources: LeadSourceType[] = [
    'BUY_REQUIREMENT',
    'DIRECT_WEBSITE',
    'CHANNEL_PARTNER',
    'META_ADS',
    'GOOGLE_ADS',
    'WHATSAPP',
    'PROPERTY_PORTAL',
    'OTHER',
  ];

  const statuses: LeadStatus[] = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'SITE_VISIT',
    'SITE_VISIT_SCHEDULED',
    'VISITED',
    'NEGOTIATION',
    'BOOKED',
    'LOST',
    'CLOSED',
  ];

  const salesExecutives = [
    'Vikramaditya S.',
    'Priya Sharma',
    'Amit Deshmukh',
    'Sneha Patil',
    'Rajesh Verma',
  ];

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSource = sourceFilter === 'ALL' || l.source === sourceFilter;
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesCity =
      cityFilter === 'ALL' ||
      (l.city && l.city.toLowerCase() === cityFilter.toLowerCase()) ||
      (l.location && l.location.toLowerCase().includes(cityFilter.toLowerCase()));
    const propTitle = l.propertyTitle || l.projectName || '';
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSource && matchesStatus && matchesCity && matchesSearch;
  });

  // Handle fast status change
  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    store.updateLeadStatus(leadId, newStatus);
    store.addAuditLog({
      action: 'LEAD_STATUS_UPDATE',
      entity: 'Lead',
      user: 'admin@prosify.local',
      details: { leadId, newStatus, host: 'admin.prosify.in' },
    });
    toast({
      title: 'Lead Status Updated',
      description: `Lead moved to ${newStatus.replace(/_/g, ' ')}`,
      type: 'success',
    });
    onRefresh();
  };

  // Handle assignment
  const handleAssigneeChange = (leadId: string, assignedTo: string) => {
    store.updateLead(leadId, { assignedTo });
    store.addAuditLog({
      action: 'LEAD_REASSIGNED',
      entity: 'Lead',
      user: 'admin@prosify.local',
      details: { leadId, assignedTo, host: 'admin.prosify.in' },
    });
    toast({
      title: 'Executive Assigned',
      description: `Lead allocated to ${assignedTo}`,
      type: 'success',
    });
    onRefresh();
  };

  // Create Inbound Lead
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    store.createLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      source: formData.source,
      status: 'NEW',
      budget: formData.budget,
      location: formData.location,
      propertyTitle: formData.propertyTitle,
      assignedTo: formData.assignedTo,
      notes: formData.notes,
    });

    store.addAuditLog({
      action: 'LEAD_CREATED_MANUAL',
      entity: 'Lead',
      user: 'eni1526',
      details: { name: formData.name, phone: formData.phone, source: formData.source },
    });

    toast({
      title: 'Lead Ingested',
      description: `New prospect registered from ${formData.source}`,
      type: 'success',
    });

    setIsModalOpen(false);
    setFormData({
      name: '',
      phone: '+91 ',
      email: '',
      source: 'META_ADS',
      budget: '₹80 Lakh - ₹1.2 Cr',
      location: 'Kalyan West',
      propertyTitle: 'Godrej Riviera',
      notes: '',
      assignedTo: 'Vikramaditya S.',
    });
    onRefresh();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Source', 'Status', 'Property', 'Budget', 'Assigned To', 'Created At'];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      l.source,
      l.status,
      `"${(l.propertyTitle || l.projectName || '').replace(/"/g, '""')}"`,
      `"${l.budget || ''}"`,
      `"${l.assignedTo || 'Unassigned'}"`,
      l.createdAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Prosify_Leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'CSV Exported',
      description: `${filteredLeads.length} leads exported to CSV.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B]/70 p-5 rounded-2xl border border-slate-700/70 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Omnichannel Ingestion & Lead Hub</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 font-mono">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time attribution from Meta Lead Ads, WhatsApp Business API, Google Search, and Channel Partner referrals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10B981] text-slate-950 text-xs font-bold hover:bg-[#059669] transition-all shadow-md shadow-[#10B981]/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#1E293B]/70 p-4 rounded-xl border border-slate-700/60">
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">Total Leads</span>
          <span className="text-2xl font-bold text-white mt-1 block">{leads.length}</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Active Inbound Pipeline</span>
        </div>

        <div className="bg-[#1E293B]/70 p-4 rounded-xl border border-slate-700/60">
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">New / Uncontacted</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">
            {leads.filter((l) => l.status === 'NEW').length}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Requires instant follow-up</span>
        </div>

        <div className="bg-[#1E293B]/70 p-4 rounded-xl border border-slate-700/60">
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">Site Visits</span>
          <span className="text-2xl font-bold text-blue-400 mt-1 block">
            {leads.filter((l) => l.status === 'SITE_VISIT_SCHEDULED' || l.status === 'SITE_VISIT' || l.status === 'VISITED').length}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">High purchase intent</span>
        </div>

        <div className="bg-[#1E293B]/70 p-4 rounded-xl border border-slate-700/60">
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">Closed Won Deals</span>
          <span className="text-2xl font-bold text-[#10B981] mt-1 block">
            {leads.filter((l) => l.status === 'BOOKED' || l.status === 'CLOSED').length}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Conversion: {leads.length > 0 ? ((leads.filter((l) => l.status === 'BOOKED' || l.status === 'CLOSED').length / leads.length) * 100).toFixed(1) + '%' : '0%'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#1E293B]/50 p-3 rounded-xl border border-slate-700/60">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search leads by client name, mobile (+91), email, or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All 9 Metros</option>
            {PAN_INDIA_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-[#1E293B]/80 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-700 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Lead & Contact</th>
                <th className="py-3 px-4">Source & Attribution</th>
                <th className="py-3 px-4">Property Interest</th>
                <th className="py-3 px-4">Budget / Locality</th>
                <th className="py-3 px-4">Assigned Executive</th>
                <th className="py-3 px-4">Stage Status</th>
                <th className="py-3 px-4 text-right">Instant Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No leads match your current search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const propTitle = lead.propertyTitle || lead.projectName || 'General Inquiry';
                  const isNew = lead.status === 'NEW';

                  return (
                    <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {isNew && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                          <div>
                            <span className="font-semibold text-white block text-sm">{lead.name}</span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span>{lead.phone}</span>
                              {lead.email && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[140px]">{lead.email}</span>
                                </>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                              {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {lead.source === 'BUY_REQUIREMENT' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300">
                            BUY REQUIREMENT
                          </span>
                        ) : lead.source === 'META_ADS' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-rose-400/40 text-rose-300">
                            META INSTANT FORM
                          </span>
                        ) : lead.source === 'LOCALITY_GUIDE' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 text-[#0EA5E9]">
                            LOCALITY GUIDE
                          </span>
                        ) : lead.source === 'LOCAL_SEO' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981]">
                            LOCAL SEO INBOUND
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-900 border border-slate-700 text-slate-300">
                            {lead.source}
                          </span>
                        )}
                        {lead.partnerCode && (
                          <span className="block text-[10px] text-[#0EA5E9] font-mono mt-1">
                            Ref: {lead.partnerCode}
                          </span>
                        )}
                        {lead.utmSource && (
                          <span className="block text-[9px] text-slate-400 font-mono">
                            utm: {lead.utmSource}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {lead.propertyType && (
                          <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded mb-1">
                            {lead.propertyType}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                          <Building className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                          <span className="truncate max-w-[160px]">{lead.propertyTitle || lead.projectName || lead.propertyType || 'Custom Requirement'}</span>
                        </div>
                        {lead.bhk && (
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            BHK: {lead.bhk}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-200 font-medium block">{lead.budget || 'Flexible'}</span>
                        <span className="text-[10px] text-slate-400 block">{lead.location || 'Maharashtra'}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={lead.assignedTo || 'Vikramaditya S.'}
                          onChange={(e) => handleAssigneeChange(lead.id, e.target.value)}
                          className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] text-slate-200 focus:outline-none focus:border-[#10B981]"
                        >
                          {salesExecutives.map((exec) => (
                            <option key={exec} value={exec}>
                              {exec}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                            lead.status === 'NEW'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : lead.status === 'BOOKED' || lead.status === 'CLOSED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : lead.status === 'SITE_VISIT_SCHEDULED'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st} className="bg-slate-900 text-slate-200">
                              {st.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Redirection */}
                          <a
                            href="https://wa.me/919167991679"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] hover:bg-[#10B981] hover:text-slate-950 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {/* Click to Call */}
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                            title="Call Prospect"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 text-[11px]"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Inbound Lead */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-base font-bold text-white">Register Inbound Prospect</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Prospect Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98200 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="client@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Attribution Channel</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSourceType })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#10B981]"
                  >
                    {sources.map((src) => (
                      <option key={src} value={src}>
                        {src.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Property</label>
                  <input
                    type="text"
                    placeholder="e.g. Godrej Riviera"
                    value={formData.propertyTitle}
                    onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Budget Range</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹85 Lakh - ₹1.2 Cr"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assign Sales Executive</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#10B981]"
                >
                  {salesExecutives.map((exec) => (
                    <option key={exec} value={exec}>
                      {exec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Initial Requirement Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Looking for ready-to-move unit, 2 BHK with balcony, finance pre-approved with SBI..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] text-slate-950 font-bold hover:bg-[#059669]"
                >
                  Confirm Ingestion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Lead Details & Timeline */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">{selectedLead.name}</h3>
                <span className="text-[11px] text-slate-400 font-mono">ID: {selectedLead.id}</span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900 p-3.5 rounded-xl space-y-2 border border-slate-800">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Created Date:</span>
                  <span className="text-white font-mono text-[11px]">
                    {selectedLead.createdAt
                      ? new Date(selectedLead.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Just now'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Mobile:</span>
                  <a href={`tel:${selectedLead.phone}`} className="text-blue-400 hover:underline font-mono">
                    {selectedLead.phone}
                  </a>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-white">{selectedLead.email || 'Not provided'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Purpose:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Buy / Purchase
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Property Type:</span>
                  <span className="text-emerald-400 font-semibold">{selectedLead.propertyType || 'Residential Flat'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">BHK / Config:</span>
                  <span className="text-white font-medium">{selectedLead.bhk || 'Flexible'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Preferred Area:</span>
                  <span className="text-white font-medium">{selectedLead.location || 'Maharashtra MMR'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Budget:</span>
                  <span className="text-white font-bold">{selectedLead.budget || 'Flexible'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Lead Source:</span>
                  <span className="text-[#10B981] font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    {selectedLead.source}
                  </span>
                </div>

                {/* Attribution info */}
                {(selectedLead.partnerCode || selectedLead.partnerName || selectedLead.utmSource) && (
                  <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
                    <span className="text-slate-400 font-semibold block">Attribution Details:</span>
                    {selectedLead.partnerCode && (
                      <div className="flex justify-between text-[#0EA5E9]">
                        <span>Partner Referral:</span>
                        <span className="font-mono font-bold">{selectedLead.partnerCode}</span>
                      </div>
                    )}
                    {selectedLead.utmSource && (
                      <div className="flex justify-between text-slate-300 font-mono text-[10px]">
                        <span>UTM Source / Campaign:</span>
                        <span>{selectedLead.utmSource} {selectedLead.utmCampaign ? `(${selectedLead.utmCampaign})` : ''}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-1.5 border-t border-slate-800">
                  <span className="text-slate-400">Stage Status:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => {
                      handleStatusChange(selectedLead.id, e.target.value as LeadStatus);
                      setSelectedLead({ ...selectedLead, status: e.target.value as LeadStatus });
                    }}
                    className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-amber-300 font-bold"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st} className="bg-slate-900 text-slate-200">
                        {st.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedLead.requirement && (
                <div>
                  <span className="text-slate-400 font-medium block mb-1">Requirement Details:</span>
                  <p className="p-3 bg-slate-900/90 rounded-xl text-slate-200 border border-slate-800 text-[11px] leading-relaxed">
                    {selectedLead.requirement}
                  </p>
                </div>
              )}

              {selectedLead.notes && selectedLead.notes !== selectedLead.requirement && (
                <div>
                  <span className="text-slate-400 font-medium block mb-1">Additional Notes:</span>
                  <p className="p-3 bg-slate-900/80 rounded-xl text-slate-300 border border-slate-800 text-[11px]">
                    {selectedLead.notes}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                {/* WhatsApp button */}
                <a
                  href="https://wa.me/919167991679"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#10B981] text-slate-950 font-bold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
