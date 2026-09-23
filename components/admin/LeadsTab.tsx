'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Lead, LeadStatus } from '@/lib/types';
import { useToast } from '@/components/ui/toast';

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800 border-blue-200',
  CONTACTED: 'bg-purple-100 text-purple-800 border-purple-200',
  SITE_VISIT_SCHEDULED: 'bg-amber-100 text-amber-800 border-amber-200',
  OFFER_MADE: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  BOOKED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  LOST: 'bg-rose-100 text-rose-800 border-rose-200',
};

export function LeadsTab() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success && data.leads) {
        setLeads(data.leads);
      }
    } catch {
      // offline / fallback
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        toast(`Lead status updated to ${newStatus}`, 'success');
      }
    } catch {
      toast('Failed to update status', 'error');
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'ALL' && lead.status !== statusFilter) return false;
    if (sourceFilter !== 'ALL' && lead.source !== sourceFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        lead.name.toLowerCase().includes(q) ||
        lead.mobile.includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.location && lead.location.toLowerCase().includes(q)) ||
        (lead.propertyTitle && lead.propertyTitle.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, phone, email, locality..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-neutral-300 bg-neutral-50"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="SITE_VISIT_SCHEDULED">Site Visit Scheduled</option>
            <option value="OFFER_MADE">Offer Made</option>
            <option value="BOOKED">Booked</option>
            <option value="LOST">Lost</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-neutral-300 bg-neutral-50"
          >
            <option value="ALL">All Sources</option>
            <option value="BUY_REQUIREMENT">Buy Requirement Form</option>
            <option value="WEBSITE_FORM">Website Form</option>
            <option value="SITE_VISIT">Site Visit Booking</option>
            <option value="CHANNEL_PARTNER">Channel Partner</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100/70 border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Name & Contact</th>
                <th className="p-3.5">Property Type / BHK</th>
                <th className="p-3.5">Location & Budget</th>
                <th className="p-3.5">Source & Attribution</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400">
                    No leads matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-neutral-900">{lead.name}</div>
                      <div className="text-neutral-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{lead.mobile}</span>
                      </div>
                      {lead.email && (
                        <div className="text-neutral-400 text-[11px] truncate max-w-[150px]">
                          {lead.email}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-neutral-800">
                        {lead.propertyType || lead.propertyTitle || 'Residential'}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {lead.bhk || 'Standard'} • {lead.purpose || 'Buy'}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-neutral-800">
                        {lead.location || 'Maharashtra'}
                      </div>
                      <div className="text-[11px] font-bold text-[#D4A017]">
                        {lead.budget || 'Custom'}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-700 text-[10px] font-bold">
                        {lead.source.replace('_', ' ')}
                      </span>
                      {lead.partnerName && (
                        <div className="text-[10px] text-purple-600 mt-0.5">
                          CP: {lead.partnerName}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-neutral-500 text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                          STATUS_COLORS[lead.status] || 'bg-gray-100'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="SITE_VISIT_SCHEDULED">SITE VISIT</option>
                        <option value="OFFER_MADE">OFFER MADE</option>
                        <option value="BOOKED">BOOKED</option>
                        <option value="LOST">LOST</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700"
                        title="View Lead Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Lead Modal Detail */}
      {selectedLead && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setSelectedLead(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#D4A017]">Lead Details</span>
                <h3 className="text-lg font-bold text-neutral-950">{selectedLead.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                aria-label="Close lead details modal"
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-400 block text-[10px]">Mobile</span>
                <span className="font-bold text-neutral-800">{selectedLead.mobile}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-400 block text-[10px]">Email</span>
                <span className="font-bold text-neutral-800">{selectedLead.email || 'N/A'}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-400 block text-[10px]">Property Type / Configuration</span>
                <span className="font-bold text-neutral-800">{selectedLead.propertyType || 'N/A'} ({selectedLead.bhk || 'N/A'})</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-neutral-400 block text-[10px]">Budget & Location</span>
                <span className="font-bold text-neutral-800">{selectedLead.budget || 'N/A'} in {selectedLead.location || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl text-xs space-y-1">
              <span className="text-neutral-400 block text-[10px]">Requirement Description</span>
              <p className="text-neutral-700 leading-relaxed">
                {selectedLead.requirement || 'No custom requirement note provided.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <a
                href={`tel:${selectedLead.mobile}`}
                className="px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>Call Client</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
