'use client';

import React, { useState } from 'react';
import {
  Layers,
  PlusCircle,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Edit2,
  Trash2,
  MapPin,
  X,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { Project } from '@/lib/types';
import { store } from '@/lib/data/store';
import { PAN_INDIA_CITIES } from '@/lib/data/panIndiaData';

interface ProjectsTabProps {
  projects: Project[];
  onRefresh: () => void;
  subview?: string;
}

export function ProjectsTab({ projects, onRefresh, subview }: ProjectsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const isAddOpen = isModalOpen || (subview === 'proj-add' && !modalDismissed);

  const [formData, setFormData] = useState({
    name: '',
    developerName: 'Godrej Properties',
    city: 'Mumbai',
    locality: 'Kalyan West',
    reraNumber: 'P51700032441',
    totalTowers: 4,
    totalUnits: 450,
    launchYear: 2024,
    possessionDate: 'Dec 2026',
    constructionStatus: 'UNDER_CONSTRUCTION' as any,
    minPrice: 7500000,
    maxPrice: 21000000,
    description: 'Master-planned integrated residential township with riverfront promenade.',
    featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  });

  const filteredProjects = projects.filter((p) => {
    const matchesCity = cityFilter === 'ALL' || p.city.toLowerCase() === cityFilter.toLowerCase();
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.developerName.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      (p.reraNumber && p.reraNumber.toLowerCase().includes(q));
    return matchesCity && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingProject(null);
    setModalDismissed(false);
    setIsModalOpen(true);
    setFormData({
      name: '',
      developerName: 'Godrej Properties',
      city: 'Mumbai',
      locality: 'Kalyan West',
      reraNumber: 'P51700032441',
      totalTowers: 4,
      totalUnits: 450,
      launchYear: 2024,
      possessionDate: 'Dec 2026',
      constructionStatus: 'UNDER_CONSTRUCTION',
      minPrice: 7500000,
      maxPrice: 21000000,
      description: 'Master-planned integrated residential township with riverfront promenade.',
      featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    setFormData({
      name: p.name,
      developerName: p.developerName,
      city: p.city,
      locality: p.locality,
      reraNumber: p.reraNumber || 'P51700032441',
      totalTowers: p.totalTowers || 4,
      totalUnits: p.totalUnits || 450,
      launchYear: p.launchYear || 2024,
      possessionDate: p.possessionDate || 'Dec 2026',
      constructionStatus: p.constructionStatus || 'UNDER_CONSTRUCTION',
      minPrice: p.minPrice || 7500000,
      maxPrice: p.maxPrice || 21000000,
      description: p.description || '',
      featuredImage: p.featuredImage || p.image || p.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingProject) {
      store.updateProject(editingProject.id, {
        ...formData,
        featuredImage: formData.featuredImage,
        image: formData.featuredImage,
        coverImage: formData.featuredImage,
      });

      fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProject.id,
          ...formData,
          featuredImage: formData.featuredImage,
          image: formData.featuredImage,
          coverImage: formData.featuredImage,
        }),
      }).catch((e) => console.warn('Project server persist note:', e));
    } else {
      const newProjData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        developerId: 'dev-1',
        featuredImage: formData.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        image: formData.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        coverImage: formData.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [],
        amenities: ['Clubhouse', 'Olympic Pool', 'Badminton Court', 'Jogging Track'],
        bhkTypes: ['2 BHK', '3 BHK'],
        totalLandAreaAcres: 12.5,
        masterBrochureUrl: '#',
        isPublished: true,
      };
      store.createProject(newProjData);

      fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProjData),
      }).catch((e) => console.warn('Project server persist note:', e));
    }

    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = (p: Project) => {
    if (confirm(`Delete project "${p.name}"?`)) {
      store.deleteProject(p.id);
      fetch(`/api/admin/projects?id=${encodeURIComponent(p.id)}`, {
        method: 'DELETE',
      }).catch((e) => console.warn('Project server persist note:', e));
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0EA5E9]" />
            <span>Townships & Real Estate Projects</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Phased residential communities, developer master plans, and MahaRERA certifications
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#0EA5E9]/20 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Search & City Filter */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter projects by title, builder, or RERA ID..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-[#0EA5E9]"
        >
          <option value="ALL">All Maharashtra Metros</option>
          {PAN_INDIA_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 hover:border-slate-600 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{p.name}</h3>
                  <span className="text-xs text-[#0EA5E9] font-medium">{p.developerName}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                  {p.constructionStatus?.replace('_', ' ') || 'ACTIVE'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 my-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{p.locality}, {p.city}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>RERA: {p.reraNumber || 'Verified'}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                  <span>Towers: <strong className="text-slate-200">{p.totalTowers || 4}</strong></span>
                  <span>Units: <strong className="text-slate-200">{p.totalUnits || 380}</strong></span>
                  <span>Possession: <strong className="text-slate-200">{p.possessionDate || '2026'}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(p)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#0EA5E9]"
                title="Edit Project"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(p)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0EA5E9]" />
                <span>{editingProject ? 'Edit Township Project' : 'Register Township Project'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setModalDismissed(true);
                }}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Developer Entity</label>
                  <input
                    type="text"
                    value={formData.developerName}
                    onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">MahaRERA Registration</label>
                  <input
                    type="text"
                    value={formData.reraNumber}
                    onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Towers</label>
                  <input
                    type="number"
                    value={formData.totalTowers}
                    onChange={(e) => setFormData({ ...formData, totalTowers: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Units Planned</label>
                  <input
                    type="number"
                    value={formData.totalUnits}
                    onChange={(e) => setFormData({ ...formData, totalUnits: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Possession Target Date</label>
                  <input
                    type="text"
                    value={formData.possessionDate}
                    onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  >
                    {PAN_INDIA_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Locality *</label>
                  <input
                    type="text"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Whitefield / Baner / Cyber City"
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              {/* Project Cover Photo Field */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-medium text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    <span>Project Cover / Elevation Photo</span>
                  </label>
                  <label className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#0EA5E9] font-medium text-[11px] cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Browse File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setFormData({ ...formData, featuredImage: ev.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                    <img
                      src={formData.featuredImage}
                      alt="Project Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="Or paste image URL (https://...)"
                    className="flex-1 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-700 text-white text-xs focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-slate-950 font-bold cursor-pointer">
                  {editingProject ? 'Save Project' : 'Register Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
