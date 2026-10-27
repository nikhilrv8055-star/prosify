'use client';

import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  ExternalLink,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  X,
  Award,
  Upload,
  FileCode,
  Check,
} from 'lucide-react';
import { Developer } from '@/lib/types';
import { store } from '@/lib/data/store';

interface DevelopersTabProps {
  developers: Developer[];
  onRefresh: () => void;
}

export function DevelopersTab({ developers, onRefresh }: DevelopersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingDev, setEditingDev] = useState<Developer | null>(null);
  const [importJson, setImportJson] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const sampleDevelopers = [
    {
      name: 'Prestige Group',
      establishedYr: 1986,
      headquarters: 'Bengaluru & Mumbai MMR',
      contactEmail: 'sales.mumbai@prestigeconstructions.com',
      contactPhone: '+91 22 4110 5000',
      website: 'https://prestigeconstructions.com',
      about: 'Leading DA1 rated conglomerate developing luxury landmarks across MMR.',
      totalProjects: 250,
      completedProjects: 210,
      ongoingProjects: 35,
      upcomingProjects: 5,
      isVerified: true,
    },
    {
      name: 'Hiranandani Communities',
      establishedYr: 1978,
      headquarters: 'Powai, Mumbai',
      contactEmail: 'info@hiranandani.net',
      contactPhone: '+91 22 2576 3600',
      website: 'https://hiranandani.com',
      about: 'Pioneers of integrated master-planned townships with neo-classical architecture.',
      totalProjects: 65,
      completedProjects: 58,
      ongoingProjects: 5,
      upcomingProjects: 2,
      isVerified: true,
    },
  ];

  const handleBulkImport = async () => {
    try {
      setImportLoading(true);
      setImportResult(null);
      const parsed = JSON.parse(importJson);
      const res = await fetch('/api/admin/developers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Array.isArray(parsed) ? parsed : [parsed]),
      });
      const data = await res.json();
      if (data.success) {
        setImportResult(`Successfully imported ${data.data.importedCount} new developers (${data.data.updatedCount} updated).`);
        onRefresh();
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportResult(null);
          setImportJson('');
        }, 1500);
      } else {
        setImportResult(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setImportResult(`Invalid JSON format: ${err.message}`);
    } finally {
      setImportLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    establishedYr: 1990,
    headquarters: 'Mumbai, Maharashtra',
    contactEmail: 'contact@developer.in',
    contactPhone: '+91 22 6123 4567',
    website: 'https://developer.in',
    about: 'Leading Tier-1 real estate developer with certified MahaRERA track record.',
    totalProjects: 18,
    completedProjects: 14,
    ongoingProjects: 4,
    upcomingProjects: 2,
    isVerified: true,
  });

  const filtered = developers.filter((d) => {
    const q = searchTerm.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.headquarters.toLowerCase().includes(q);
  });

  const handleOpenAdd = () => {
    setEditingDev(null);
    setFormData({
      name: '',
      establishedYr: 1990,
      headquarters: 'Mumbai, Maharashtra',
      contactEmail: 'contact@developer.in',
      contactPhone: '+91 22 6123 4567',
      website: 'https://developer.in',
      about: 'Leading Tier-1 real estate developer with certified MahaRERA track record.',
      totalProjects: 18,
      completedProjects: 14,
      ongoingProjects: 4,
      upcomingProjects: 2,
      isVerified: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: Developer) => {
    setEditingDev(d);
    setFormData({
      name: d.name,
      establishedYr: d.establishedYr,
      headquarters: d.headquarters,
      contactEmail: d.contactEmail,
      contactPhone: d.contactPhone,
      website: d.website,
      about: d.about,
      totalProjects: d.totalProjects,
      completedProjects: d.completedProjects,
      ongoingProjects: d.ongoingProjects,
      upcomingProjects: d.upcomingProjects,
      isVerified: d.isVerified,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingDev) {
      store.updateDeveloper(editingDev.id, {
        ...formData,
      });

      fetch('/api/admin/developers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDev.id,
          ...formData,
        }),
      }).catch((e) => console.warn('Developer server persist note:', e));
    } else {
      const newDevData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80',
      };
      store.createDeveloper(newDevData);

      fetch('/api/admin/developers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDevData),
      }).catch((e) => console.warn('Developer server persist note:', e));
    }

    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = (d: Developer) => {
    if (confirm(`Remove developer entity "${d.name}"?`)) {
      store.deleteDeveloper(d.id);
      fetch(`/api/admin/developers?id=${encodeURIComponent(d.id)}`, {
        method: 'DELETE',
      }).catch((e) => console.warn('Developer server persist note:', e));
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#10B981]" />
            <span>Developer Corporate Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tier-1 real estate conglomerates, credit ratings, and official corporate liaisons
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setImportJson(JSON.stringify(sampleDevelopers, null, 2));
              setIsImportModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#D4A017] border border-[#D4A017]/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Portfolio</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#10B981]/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Developer</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter developers by entity name or headquarters..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 hover:border-slate-600 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>{d.name}</span>
                    {d.isVerified && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                  </h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#10B981]" />
                    {d.headquarters}
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Est. {d.establishedYr}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 my-2.5 leading-relaxed">
                {d.about}
              </p>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span className="truncate">{d.contactEmail}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{d.contactPhone}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span>Delivered: <strong className="text-white">{d.completedProjects}</strong></span>
                <span>Active: <strong className="text-[#10B981]">{d.ongoingProjects}</strong></span>
                <span>Pipeline: <strong className="text-[#0EA5E9]">{d.upcomingProjects}</strong></span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(d)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#0EA5E9]"
                title="Edit Developer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(d)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                title="Delete Developer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#10B981]" />
                <span>{editingDev ? 'Edit Developer Profile' : 'Register Developer Entity'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Developer Corporate Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Established Year</label>
                  <input
                    type="number"
                    value={formData.establishedYr}
                    onChange={(e) => setFormData({ ...formData, establishedYr: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Headquarters</label>
                  <input
                    type="text"
                    value={formData.headquarters}
                    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Liaison Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold cursor-pointer">
                  {editingDev ? 'Save Profile' : 'Register Developer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#D4A017]" />
                <h3 className="text-base font-bold text-white">Import Developer Portfolio (JSON)</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Paste an array of developer objects containing corporate details, projects track-record, and contact lines.
            </p>

            <textarea
              rows={10}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-900 rounded-xl border border-slate-700 text-emerald-400 focus:outline-none focus:border-[#D4A017]"
              placeholder='[ { "name": "Prestige Group", "establishedYr": 1986, ... } ]'
            />

            {importResult && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  importResult.startsWith('Error') || importResult.startsWith('Invalid')
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {importResult}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setImportJson(JSON.stringify(sampleDevelopers, null, 2))}
                className="text-xs text-[#D4A017] hover:underline cursor-pointer"
              >
                Reset to sample MMR developers
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkImport}
                  disabled={importLoading || !importJson.trim()}
                  className="px-4 py-1.5 rounded-xl bg-[#D4A017] hover:bg-[#b8890f] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {importLoading ? 'Importing...' : 'Execute Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
