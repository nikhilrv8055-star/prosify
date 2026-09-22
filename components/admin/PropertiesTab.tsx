'use client';

import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ShieldCheck,
  IndianRupee,
  MapPin,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';
import { Property, PropertyType, ListingType, PossessionStatus } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';
import { store } from '@/lib/data/store';

interface PropertiesTabProps {
  properties: Property[];
  onRefresh: () => void;
}

export function PropertiesTab({ properties, onRefresh }: PropertiesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form State for Add/Edit
  const [formData, setFormData] = useState({
    title: '',
    developerName: 'Godrej Properties',
    projectName: 'Godrej Riviera',
    city: 'Mumbai',
    locality: 'Kalyan West',
    price: 9500000,
    carpetArea: 850,
    bhk: '2 BHK',
    propertyType: 'APARTMENT' as PropertyType,
    listingType: 'BUY' as ListingType,
    possessionStatus: 'UNDER_CONSTRUCTION' as PossessionStatus,
    possessionDate: 'Dec 2026',
    reraNumber: 'P51700032441',
    description: 'Luxury high-rise residential apartment with modern lifestyle amenities.',
    isVerified: true,
    isFeatured: true,
    isPublished: true,
  });

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.developerName && p.developerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = cityFilter === 'ALL' || p.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesType = typeFilter === 'ALL' || p.propertyType === typeFilter;
    return matchesSearch && matchesCity && matchesType;
  });

  const handleOpenAdd = () => {
    setEditingProperty(null);
    setFormData({
      title: '',
      developerName: 'Godrej Properties',
      projectName: 'Godrej Riviera',
      city: 'Mumbai',
      locality: 'Kalyan West',
      price: 9500000,
      carpetArea: 850,
      bhk: '2 BHK',
      propertyType: 'APARTMENT',
      listingType: 'BUY',
      possessionStatus: 'UNDER_CONSTRUCTION',
      possessionDate: 'Dec 2026',
      reraNumber: 'P51700032441',
      description: 'Luxury high-rise residential apartment with modern lifestyle amenities.',
      isVerified: true,
      isFeatured: true,
      isPublished: true,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Property) => {
    setEditingProperty(p);
    setFormData({
      title: p.title,
      developerName: p.developerName || 'Godrej Properties',
      projectName: p.projectName || 'Godrej Riviera',
      city: p.city,
      locality: p.locality,
      price: p.price,
      carpetArea: p.carpetArea,
      bhk: p.bhk,
      propertyType: p.propertyType,
      listingType: p.listingType,
      possessionStatus: p.possessionStatus,
      possessionDate: p.possessionDate || 'Dec 2026',
      reraNumber: p.reraNumber || '',
      description: p.description || '',
      isVerified: p.isVerified,
      isFeatured: p.isFeatured || false,
      isPublished: p.isPublished,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingProperty) {
      store.updateProperty(editingProperty.id, {
        ...formData,
      });
    } else {
      store.createProperty({
        ...formData,
        pricePerSqft: Math.round(formData.price / (formData.carpetArea || 1)),
        builtUpArea: Math.round((formData.carpetArea || 1) * 1.25),
        coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Clubhouse', 'Swimming Pool', 'Gymnasium', 'Landscaped Garden', 'Power Backup'],
        bedrooms: parseInt(formData.bhk) || 2,
        bathrooms: parseInt(formData.bhk) || 2,
        balconies: 1,
        floorNumber: 14,
        totalFloors: 32,
        furnishingStatus: 'UNFURNISHED',
        parkingSpaces: 1,
        address: `${formData.locality}, ${formData.city}`,
        pincode: '400001',
      });
    }

    setIsAddModalOpen(false);
    onRefresh();
  };

  const handleTogglePublish = (p: Property) => {
    store.updateProperty(p.id, { isPublished: !p.isPublished });
    onRefresh();
  };

  const handleDelete = (p: Property) => {
    if (confirm(`Confirm deletion of property "${p.title}"? This action is logged to the audit trail.`)) {
      store.deleteProperty(p.id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#10B981]" />
            <span>Properties Inventory & Catalog</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real estate listings, MahaRERA registration audits, and live public publishing controls
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#10B981]/20 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, developer, or locality..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-slate-200 focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Thane">Thane</option>
            <option value="Dombivli">Dombivli</option>
            <option value="Kalyan">Kalyan</option>
            <option value="Pune">Pune</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-slate-200 focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Types</option>
            <option value="APARTMENT">Apartment</option>
            <option value="VILLA">Villa</option>
            <option value="PENTHOUSE">Penthouse</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="rounded-2xl bg-[#1E293B]/90 backdrop-blur-md border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3 px-4">Property & Developer</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Price & Area</th>
                <th className="py-3 px-4">MahaRERA ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No properties match your criteria.
                  </td>
                </tr>
              ) : (
                filteredProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{p.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {p.developerName || 'Direct Developer'} • <span className="text-[#0EA5E9]">{p.bhk}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#10B981]" />
                        <span>{p.locality}, {p.city}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#10B981]">
                        {formatIndianPrice(p.price)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {p.carpetArea} sq.ft. (Carpet)
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700">
                        {p.reraNumber || 'Applied'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            p.isPublished ? 'bg-[#10B981]' : 'bg-slate-500'
                          }`}
                        />
                        <span className="text-[11px] font-semibold">
                          {p.isPublished ? 'Live' : 'Draft / Unlisted'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title={p.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {p.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#0EA5E9] hover:text-sky-300"
                          title="Edit Property"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300"
                          title="Delete Property"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#10B981]" />
                <span>{editingProperty ? 'Edit Property Listing' : 'Create New Property Listing'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Godrej Riviera Sky Residences"
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Developer Entity</label>
                  <input
                    type="text"
                    value={formData.developerName}
                    onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                    placeholder="e.g. Godrej Properties"
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Price (in INR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                  <span className="text-[10px] text-emerald-400 mt-0.5 block font-semibold">
                    Preview: {formatIndianPrice(formData.price)}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Carpet Area (sq. ft.) *</label>
                  <input
                    type="number"
                    required
                    value={formData.carpetArea}
                    onChange={(e) => setFormData({ ...formData, carpetArea: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">BHK Configuration</label>
                  <input
                    type="text"
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                    placeholder="e.g. 2 BHK, 3 BHK, 4 BHK"
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Locality</label>
                  <input
                    type="text"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">MahaRERA Registration ID</label>
                  <input
                    type="text"
                    value={formData.reraNumber}
                    onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                    placeholder="P51700032441"
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold shadow-md shadow-[#10B981]/20 cursor-pointer"
                >
                  {editingProperty ? 'Save Changes' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
