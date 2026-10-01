'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  X,
} from 'lucide-react';
import { VendorProjectItem } from '../types';

interface ProjectManagementTabProps {
  projects: VendorProjectItem[];
  onAddProject: (newProj: Omit<VendorProjectItem, 'id'>) => void;
}

export function ProjectManagementTab({ projects, onAddProject }: ProjectManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    reraNumber: '',
    city: 'Mumbai',
    location: '',
    towers: 2,
    totalUnits: 150,
    availableUnits: 120,
    status: 'UNDER_CONSTRUCTION' as const,
    completionDate: 'Dec 2028',
    priceRange: '₹85 L - ₹2.10 Cr',
  });

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reraNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.reraNumber) return;

    onAddProject({
      ...formData,
      towers: Number(formData.towers),
      totalUnits: Number(formData.totalUnits),
      availableUnits: Number(formData.availableUnits),
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      reraNumber: '',
      city: 'Mumbai',
      location: '',
      towers: 2,
      totalUnits: 150,
      availableUnits: 120,
      status: 'UNDER_CONSTRUCTION',
      completionDate: 'Dec 2028',
      priceRange: '₹85 L - ₹2.10 Cr',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Real Estate Project Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Oversee township developments, phase-wise tower construction, and real-time inventory allocation.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700 flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search project name, RERA number, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <span className="text-slate-400 font-medium">{filtered.length} Projects Total</span>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{proj.name}</h3>
                  <span className="text-[11px] text-slate-400 block">{proj.location}, {proj.city}</span>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                    proj.status === 'READY_TO_MOVE'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                  }`}
                >
                  {proj.status.replace('_', ' ')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 text-[10px]">RERA ID:</span>
                <span className="text-cyan-300 font-semibold">{proj.reraNumber}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-slate-800">
                <div className="p-2 rounded-lg bg-slate-900/60">
                  <span className="text-[10px] text-slate-500 block">Towers</span>
                  <strong className="text-white">{proj.towers}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60">
                  <span className="text-[10px] text-slate-500 block">Total Units</span>
                  <strong className="text-white">{proj.totalUnits}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60">
                  <span className="text-[10px] text-slate-500 block">Available</span>
                  <strong className="text-emerald-400">{proj.availableUnits}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Price Spectrum:</span>
                <strong className="text-amber-400 font-mono">{proj.priceRange}</strong>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Possession:</span>
                </span>
                <span className="text-white font-medium">{proj.completionDate}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>API Real-Time Sync</span>
              </span>
              <span className="text-slate-400 font-mono text-[10px]">ID: {proj.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Register Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Register Real Estate Project</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Godrej Riviera Waterfront Towers"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">RERA Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. P51700032519"
                    value={formData.reraNumber}
                    onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Location / Micro-Market *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ambivli West or Powai"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Price Spectrum</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹65 L - ₹1.45 Cr"
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Towers</label>
                  <input
                    type="number"
                    value={formData.towers}
                    onChange={(e) => setFormData({ ...formData, towers: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Total Units</label>
                  <input
                    type="number"
                    value={formData.totalUnits}
                    onChange={(e) => setFormData({ ...formData, totalUnits: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Available Units</label>
                  <input
                    type="number"
                    value={formData.availableUnits}
                    onChange={(e) => setFormData({ ...formData, availableUnits: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Construction Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
                  >
                    <option value="UNDER_CONSTRUCTION">Under Construction</option>
                    <option value="READY_TO_MOVE">Ready to Move</option>
                    <option value="NEW_LAUNCH">New Launch</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Completion Date</label>
                  <input
                    type="text"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
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
                  className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  Register Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
