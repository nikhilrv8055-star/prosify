'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck,
  Award,
  X,
  CheckCircle2,
} from 'lucide-react';
import { VendorAgentItem } from '../types';

interface AgentsTabProps {
  agents: VendorAgentItem[];
  onAddAgent: (newAgent: Omit<VendorAgentItem, 'id' | 'dealsClosed'>) => void;
}

export function AgentsTab({ agents, onAddAgent }: AgentsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    agency: '',
    phone: '',
    email: '',
    reraNumber: '',
    commissionRate: '2.0%',
    status: 'ACTIVE' as const,
  });

  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.reraNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    onAddAgent(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      agency: '',
      phone: '',
      email: '',
      reraNumber: '',
      commissionRate: '2.0%',
      status: 'ACTIVE',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Channel Partners & Sales Agents</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Empower registered RERA brokers and agents to syndicate and sell your properties with transparent commissions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Invite / Register Agent</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700 flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agent name, agency, RERA ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <span className="text-slate-400 font-medium">{filtered.length} Agents Enrolled</span>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((agent) => (
          <div
            key={agent.id}
            className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                  <span className="text-xs text-emerald-400 font-medium">{agent.agency}</span>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                    agent.status === 'ACTIVE'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 text-[10px]">RERA Agent License:</span>
                <span className="text-cyan-300 font-semibold">{agent.reraNumber || 'A51900018742'}</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-cyan-300">{agent.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{agent.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-slate-800">
                <div className="p-2 rounded-lg bg-slate-900/60">
                  <span className="text-[10px] text-slate-500 block">Deals Closed</span>
                  <strong className="text-white text-sm">{agent.dealsClosed}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60">
                  <span className="text-[10px] text-slate-500 block">Commission</span>
                  <strong className="text-emerald-400 text-sm">{agent.commissionRate}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <a
                href="https://wa.me/919167991679"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <span className="text-[10px] text-slate-400 font-mono">Verified Partner</span>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Agent Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Invite / Enroll Channel Partner Agent</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Agent / Broker Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Patil"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Agency / Consultancy Name</label>
                <input
                  type="text"
                  placeholder="e.g. Patil Realty Consultants"
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="agent@consultants.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">RERA Agent Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. A51900018742"
                    value={formData.reraNumber}
                    onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Standard Commission Slab</label>
                  <select
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="1.5%">1.5% Standard</option>
                    <option value="2.0%">2.0% Premier</option>
                    <option value="2.5%">2.5% Ultra-Luxury Slab</option>
                    <option value="3.0%">3.0% Exclusive Milestone</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  Enroll Channel Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
