'use client';

import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Building,
  Sparkles,
  X,
  Flame,
  RefreshCw,
  Send,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Lead, LeadStatus, LeadSourceType } from '@/lib/types';
import { store } from '@/lib/data/store';

interface CrmTabProps {
  leads: Lead[];
  onRefresh: () => void;
}

export function CrmTab({ leads, onRefresh }: CrmTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [qualificationFilter, setQualificationFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');
  const [syncingLeadId, setSyncingLeadId] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const realaticStatus = { configured: true, mode: 'PROLEAD ACTIVE' };

  const [newLeadData, setNewLeadData] = useState<{
    name: string;
    phone: string;
    email: string;
    source: LeadSourceType;
    budget: string;
    location: string;
    propertyTitle: string;
    notes: string;
  }>({
    name: '',
    phone: '+91 98201 12345',
    email: 'client@example.com',
    source: 'META_ADS',
    budget: '₹80 Lakh - ₹1.2 Cr',
    location: 'Kalyan West',
    propertyTitle: 'Godrej Riviera',
    notes: 'Inquired about 2 BHK with river view.',
  });

  const stages: LeadStatus[] = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'SITE_VISIT_SCHEDULED',
    'VISITED',
    'NEGOTIATION',
    'BOOKED',
    'LOST',
  ];

  const filteredLeads = leads.filter((l) => {
    const matchesStage = stageFilter === 'ALL' || l.status === stageFilter;
    const matchesQual = qualificationFilter === 'ALL' || l.qualification === qualificationFilter;
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      (l.propertyTitle && l.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStage && matchesQual && matchesSearch;
  });

  const handleStageChange = (leadId: string, newStatus: LeadStatus) => {
    store.updateLeadStatus(leadId, newStatus);
    onRefresh();
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadData.name) return;

    store.createLead({
      ...newLeadData,
      status: 'NEW',
    });

    setIsModalOpen(false);
    onRefresh();
  };

  const handleAddNote = (leadId: string) => {
    if (!newNote.trim()) return;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const updatedNotes = lead.notes
      ? `${lead.notes} | [${new Date().toLocaleDateString()}] ${newNote}`
      : newNote;

    store.updateLead(leadId, { notes: updatedNotes });
    setNewNote('');
    onRefresh();
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, notes: updatedNotes });
    }
  };

  const handleSyncToRealatic = async (leadId: string) => {
    setSyncingLeadId(leadId);
    setSyncFeedback(null);
    try {
      const res = await fetch('/api/crm/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      setSyncFeedback(data.message || (data.status === 'PENDING_CREDENTIALS' ? 'Adapter ready (PENDING CREDENTIALS)' : 'Synced!'));
      onRefresh();
    } catch {
      setSyncFeedback('Sync request failed');
    } finally {
      setSyncingLeadId(null);
    }
  };

  const getStageColor = (status: LeadStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'CONTACTED':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'QUALIFIED':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'SITE_VISIT_SCHEDULED':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
      case 'VISITED':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'NEGOTIATION':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'BOOKED':
        return 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40';
      case 'LOST':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  const getQualificationBadge = (qualification?: string, score?: number) => {
    switch (qualification) {
      case 'HOT':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1 w-fit">
            <Flame className="w-3 h-3 text-red-400 fill-red-400" />
            HOT ({score || 85})
          </span>
        );
      case 'QUALIFIED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1 w-fit">
            <Sparkles className="w-3 h-3" />
            QUALIFIED ({score || 65})
          </span>
        );
      case 'WARM':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 w-fit">
            WARM ({score || 45})
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700 w-fit">
            COLD ({score || 20})
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & CRM Engine Status */}
      <div className="p-6 rounded-2xl bg-[#1E293B] border border-slate-700 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#0EA5E9]/20 text-[#0EA5E9]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                ProLead™ Intelligent CRM & Pipeline
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D4A017]/20 text-[#D4A017] border border-[#D4A017]/40">
                  Deduplicated & Scored
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Prosify Source of Truth with Realatic CRM synchronization layer and automatic lead qualification (0-100).
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Realatic Status Badge */}
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Realatic CRM Link</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  realaticStatus.configured ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`}
              />
              <span className={`font-mono text-[11px] font-bold ${realaticStatus.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {realaticStatus.mode}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b8890f] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#D4A017]/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ingest New Lead</span>
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="p-3 rounded-xl bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 text-xs text-[#0EA5E9] flex items-center justify-between">
          <span>{syncFeedback}</span>
          <button onClick={() => setSyncFeedback(null)} className="text-slate-400 hover:text-white cursor-pointer ml-4">
            ×
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, phone, or interested project..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4A017]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={qualificationFilter}
            onChange={(e) => setQualificationFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-slate-200 focus:outline-none focus:border-[#D4A017]"
          >
            <option value="ALL">All Qualifications</option>
            <option value="HOT">HOT (Score 81-100)</option>
            <option value="QUALIFIED">QUALIFIED (Score 61-80)</option>
            <option value="WARM">WARM (Score 31-60)</option>
            <option value="COLD">COLD (Score 0-30)</option>
          </select>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-slate-200 focus:outline-none focus:border-[#D4A017]"
          >
            <option value="ALL">All CRM Stages</option>
            {stages.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Leads Table */}
      <div className="rounded-2xl bg-[#1E293B]/90 backdrop-blur-md border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3 px-4">Lead & Qualification</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Project / Budget</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Realatic CRM Sync</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No leads match this filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{l.name}</span>
                        {getQualificationBadge(l.qualification, l.leadScore)}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[#0EA5E9] font-mono text-[10px]">
                          {l.source}
                        </span>
                        <span>•</span>
                        <span>{new Date(l.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-200">
                        <Phone className="w-3 h-3 text-[#10B981]" />
                        <span>{l.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Mail className="w-3 h-3 text-[#0EA5E9]" />
                        <span className="truncate max-w-[140px]">{l.email || 'No email registered'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{l.propertyTitle || 'General Inquiry'}</div>
                      <div className="text-[#10B981] font-semibold text-[11px]">{l.budget}</div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={l.status}
                        onChange={(e) => handleStageChange(l.id, e.target.value as LeadStatus)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${getStageColor(
                          l.status
                        )} bg-slate-900 focus:outline-none`}
                      >
                        {stages.map((s) => (
                          <option key={s} value={s} className="bg-slate-900 text-white">
                            {s.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      {l.realaticLeadId ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Synced ({l.realaticLeadId.slice(0, 12)}...)
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {realaticStatus.mode}
                          </span>
                          <button
                            onClick={() => handleSyncToRealatic(l.id)}
                            disabled={syncingLeadId === l.id}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                            title="Sync Lead to Realatic CRM"
                          >
                            <RefreshCw className={`w-3 h-3 ${syncingLeadId === l.id ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedLead(l)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#D4A017] text-xs font-medium cursor-pointer"
                      >
                        Dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Lead Notes Slide-over / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl p-6 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{selectedLead.name}</span>
                  {getQualificationBadge(selectedLead.qualification, selectedLead.leadScore)}
                </h3>
                <span className="text-xs text-slate-400">{selectedLead.phone} • {selectedLead.propertyTitle}</span>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Scoring Breakdown Box */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  ProLead™ Qualification Score Breakdown
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>Base Form: +10 pts</div>
                  <div>Preferences: {selectedLead.budget ? '+20 pts' : '0 pts'}</div>
                  <div>Brochure Download: {selectedLead.scoringBreakdown?.brochureDownload ? '+15 pts' : 'Pending'}</div>
                  <div>Site Visit Request: {selectedLead.scoringBreakdown?.siteVisitRequest ? '+25 pts' : 'None'}</div>
                </div>
                <div className="pt-1 text-[11px] text-emerald-400 font-bold">
                  Total Score: {selectedLead.leadScore || 50}/100 ({selectedLead.qualification || 'WARM'})
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px] mb-1">
                  Interaction History & Sales Notes
                </span>
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedLead.notes || 'No notes added yet for this client.'}
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Add Telecalling Note</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="e.g. Client confirmed site visit for Saturday at 3 PM..."
                    className="flex-1 px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white text-xs focus:outline-none focus:border-[#D4A017]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddNote(selectedLead.id)}
                    className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b8890f] text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ingest Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0EA5E9]" />
                <span>Ingest Inbound Lead</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Lead Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadData.name}
                    onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={newLeadData.phone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newLeadData.email}
                    onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Campaign / Source</label>
                  <select
                    value={newLeadData.source}
                    onChange={(e) => setNewLeadData({ ...newLeadData, source: e.target.value as LeadSourceType })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  >
                    <option value="META_ADS">Meta Ads</option>
                    <option value="GOOGLE_ADS">Google Ads</option>
                    <option value="CHANNEL_PARTNER">Channel Partner</option>
                    <option value="DIRECT_WEBSITE">Direct Website</option>
                    <option value="WALK_IN">Walk-In</option>
                    <option value="PROPERTY_PORTAL">Property Portal</option>
                    <option value="REFERRAL">Referral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Budget Range</label>
                  <input
                    type="text"
                    value={newLeadData.budget}
                    onChange={(e) => setNewLeadData({ ...newLeadData, budget: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Interested Project</label>
                  <input
                    type="text"
                    value={newLeadData.propertyTitle}
                    onChange={(e) => setNewLeadData({ ...newLeadData, propertyTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Initial Notes</label>
                <textarea
                  rows={2}
                  value={newLeadData.notes}
                  onChange={(e) => setNewLeadData({ ...newLeadData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-slate-950 font-bold cursor-pointer">
                  Ingest Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
