'use client';

import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Eye,
  Trash2,
  Edit2,
  ExternalLink,
  X,
  AlertCircle,
} from 'lucide-react';
import { VendorPropertyItem } from '../types';

interface PropertyManagementTabProps {
  properties: VendorPropertyItem[];
  onAddProperty: (newProp: Omit<VendorPropertyItem, 'id' | 'createdAt' | 'views' | 'inquiries'>) => void;
  onUpdateStatus: (id: string, status: VendorPropertyItem['status']) => void;
  onDeleteProperty: (id: string) => void;
}

export function PropertyManagementTab({
  properties,
  onAddProperty,
  onUpdateStatus,
  onDeleteProperty,
}: PropertyManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Apartment' as const,
    city: 'Mumbai',
    location: '',
    price: 15000000,
    carpetArea: 1200,
    bhk: '2 BHK',
    status: 'AVAILABLE' as const,
    reraId: '',
  });

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location) return;

    onAddProperty({
      title: formData.title,
      type: formData.type,
      city: formData.city,
      location: formData.location,
      price: Number(formData.price),
      carpetArea: Number(formData.carpetArea),
      bhk: formData.bhk,
      status: formData.status,
      reraId: formData.reraId,
    });

    setIsAddModalOpen(false);
    setFormData({
      title: '',
      type: 'Apartment',
      city: 'Mumbai',
      location: '',
      price: 15000000,
      carpetArea: 1200,
      bhk: '2 BHK',
      status: 'AVAILABLE',
      reraId: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <span>Property Inventory Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your listed residential, commercial, and penthouse inventory across MMR & Tier-1 cities.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-sky-500 hover:to-sky-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, micro-market, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
          >
            <option value="ALL">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Villa">Villa</option>
            <option value="Commercial">Commercial</option>
            <option value="Plot">Plot</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNDER_OFFER">Under Offer</option>
            <option value="BOOKED">Booked</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>
      </div>

      {/* Property Inventory Table */}
      <div className="rounded-2xl bg-[#1E293B]/80 border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] font-semibold uppercase">
              <tr>
                <th className="p-3.5">Property Title & RERA</th>
                <th className="p-3.5">Type & Layout</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Engagement</th>
                <th className="p-3.5">Availability Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No properties match your current search and filters.
                  </td>
                </tr>
              ) : (
                filteredProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <strong className="text-white font-semibold block">{p.title}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {p.reraId ? `RERA: ${p.reraId}` : 'RERA Pending'}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-medium">
                        {p.type}
                      </span>
                      <span className="text-slate-400 block text-[11px] mt-0.5">
                        {p.bhk} • {p.carpetArea} sq.ft
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="text-white">{p.location}</span>
                      <span className="text-slate-400 block text-[11px]">{p.city}</span>
                    </td>

                    <td className="p-3.5 font-mono text-emerald-400 font-bold">
                      ₹{(p.price / 10000000).toFixed(2)} Cr
                    </td>

                    <td className="p-3.5">
                      <span className="text-white font-semibold">{p.inquiries} Inquiries</span>
                      <span className="text-slate-400 block text-[11px]">{p.views} Views</span>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={p.status}
                        onChange={(e) => onUpdateStatus(p.id, e.target.value as any)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                          p.status === 'AVAILABLE'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : p.status === 'BOOKED'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : p.status === 'SOLD'
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                        }`}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="UNDER_OFFER">UNDER OFFER</option>
                        <option value="BOOKED">BOOKED</option>
                        <option value="SOLD">SOLD</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onDeleteProperty(p.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-400" />
                <span>Add Property to Vendor Catalog</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skyline Sea-Facing Luxury Penthouse"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Property Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Configuration (BHK)</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 BHK or Commercial"
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Location / Locality *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Worli Sea Face or Whitefield"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    value={formData.carpetArea}
                    onChange={(e) => setFormData({ ...formData, carpetArea: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">MahaRERA / RERA Registration ID</label>
                <input
                  type="text"
                  placeholder="e.g. P51900001234"
                  value={formData.reraId}
                  onChange={(e) => setFormData({ ...formData, reraId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
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
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-lg shadow-sky-500/25 cursor-pointer"
                >
                  Publish Property Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
