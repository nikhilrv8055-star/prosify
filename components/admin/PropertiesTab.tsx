'use client';

import React, { useState, useRef } from 'react';
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
  Upload,
  Image as ImageIcon,
  Star,
  Plus,
  Link as LinkIcon,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Property, PropertyType, ListingType, PossessionStatus } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';
import { store } from '@/lib/data/store';
import { useToast } from '@/components/ui/toast';
import { PAN_INDIA_CITIES } from '@/lib/data/panIndiaData';

interface PropertiesTabProps {
  properties: Property[];
  onRefresh: () => void;
  subview?: string;
}

const PRESET_PROPERTY_IMAGES = [
  {
    name: 'Modern Tower Exterior',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    tag: 'Exterior',
  },
  {
    name: 'Luxury Living Room',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    tag: 'Living Room',
  },
  {
    name: 'Master Suite Bedroom',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80',
    tag: 'Bedroom',
  },
  {
    name: 'Infinity Pool & Amenities',
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80',
    tag: 'Pool / Deck',
  },
  {
    name: 'Skyline Balcony View',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    tag: 'Balcony',
  },
  {
    name: 'Modular Italian Kitchen',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
    tag: 'Kitchen',
  },
];

export function PropertiesTab({ properties, onRefresh, subview }: PropertiesTabProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Auto open Add Property modal when subview === 'prop-add'
  const isAddOpen = isAddModalOpen || (subview === 'prop-add' && !modalDismissed);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [activeMediaTab, setActiveMediaTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDragging, setIsDragging] = useState(false);

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
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    ] as string[],
  });

  const filteredProperties = properties.filter((p) => {
    if (subview === 'prop-featured' && !p.isFeatured) return false;
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
    setModalDismissed(false);
    setIsAddModalOpen(true);
    setUrlInput('');
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
      coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      ],
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Property) => {
    setEditingProperty(p);
    setUrlInput('');
    const propImages = p.images && p.images.length > 0 ? p.images : p.coverImage ? [p.coverImage] : [];
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
      coverImage: p.coverImage || propImages[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      images: propImages.length > 0 ? propImages : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
    });
    setIsAddModalOpen(true);
  };

  // Process and add files
  const processFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));

    if (validFiles.length === 0) {
      toast({
        title: 'Invalid File',
        description: 'Please upload only image files (JPG, PNG, WebP).',
        type: 'error',
      });
      setIsUploading(false);
      return;
    }

    let loadedCount = 0;
    const newImageUrls: string[] = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          newImageUrls.push(result);
        }
        loadedCount++;
        if (loadedCount === validFiles.length) {
          setFormData((prev) => {
            const combined = [...prev.images, ...newImageUrls];
            const newCover = prev.coverImage || combined[0];
            return {
              ...prev,
              images: combined,
              coverImage: newCover,
            };
          });
          setIsUploading(false);
          toast({
            title: 'Photos Uploaded',
            description: `${newImageUrls.length} image(s) added successfully.`,
            type: 'success',
          });
        }
      };
      reader.onerror = () => {
        loadedCount++;
        if (loadedCount === validFiles.length) {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid HTTP, HTTPS, or base64 image URL.',
        type: 'error',
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, trimmed],
      coverImage: prev.coverImage || trimmed,
    }));
    setUrlInput('');
    toast({
      title: 'Image Added',
      description: 'Image URL successfully linked to property.',
      type: 'success',
    });
  };

  const handleAddPreset = (url: string, name: string) => {
    if (formData.images.includes(url)) {
      toast({
        title: 'Already Added',
        description: `"${name}" is already in your property gallery.`,
        type: 'info',
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url],
      coverImage: prev.coverImage || url,
    }));
    toast({
      title: 'Preset Added',
      description: `Added "${name}" to property photos.`,
      type: 'success',
    });
  };

  const handleSetCover = (imgUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: imgUrl,
    }));
    toast({
      title: 'Cover Photo Updated',
      description: 'This image is now set as the primary listing card photo.',
      type: 'success',
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const removedUrl = prev.images[indexToRemove];
      const nextImages = prev.images.filter((_, idx) => idx !== indexToRemove);
      let nextCover = prev.coverImage;
      if (prev.coverImage === removedUrl) {
        nextCover = nextImages.length > 0 ? nextImages[0] : '';
      }
      return {
        ...prev,
        images: nextImages,
        coverImage: nextCover,
      };
    });
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast({
        title: 'Title Required',
        description: 'Please enter a title for the property.',
        type: 'error',
      });
      return;
    }

    // Ensure valid coverImage
    const finalCover =
      formData.coverImage ||
      (formData.images.length > 0
        ? formData.images[0]
        : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');

    const finalImages =
      formData.images.length > 0
        ? formData.images
        : [finalCover];

    if (editingProperty) {
      store.updateProperty(editingProperty.id, {
        ...formData,
        coverImage: finalCover,
        images: finalImages,
      });
      toast({
        title: 'Property Updated',
        description: `"${formData.title}" was successfully updated.`,
        type: 'success',
      });
    } else {
      store.createProperty({
        ...formData,
        coverImage: finalCover,
        images: finalImages,
        pricePerSqft: Math.round(formData.price / (formData.carpetArea || 1)),
        builtUpArea: Math.round((formData.carpetArea || 1) * 1.25),
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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
      toast({
        title: 'Property Created',
        description: `"${formData.title}" added to active inventory.`,
        type: 'success',
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
      toast({
        title: 'Property Deleted',
        description: `"${p.title}" was removed from the catalog.`,
        type: 'info',
      });
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
            Real estate listings, photo gallery management, MahaRERA compliance, and live publishing controls
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
            <option value="ALL">All Maharashtra Metros</option>
            {PAN_INDIA_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
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
                <th className="py-3 px-4">Photo & Property</th>
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
                filteredProperties.map((p) => {
                  const displayCover = p.coverImage || (p.images && p.images[0]) || '';
                  const photoCount = p.images?.length || (p.coverImage ? 1 : 0);

                  return (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {/* Property Photo Thumbnail */}
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 shadow-xs">
                            {displayCover ? (
                              <img
                                src={displayCover}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                            <span className="absolute bottom-0 right-0 bg-black/80 px-1 py-0.2 text-[9px] font-mono text-slate-300 rounded-tl">
                              📷 {photoCount}
                            </span>
                          </div>

                          <div>
                            <div className="font-bold text-white text-sm hover:text-[#10B981] transition-colors">
                              {p.title}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {p.developerName || 'Direct Developer'} • <span className="text-[#0EA5E9] font-medium">{p.bhk}</span>
                            </div>
                          </div>
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
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title={p.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {p.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#0EA5E9] hover:text-sky-300 transition-colors cursor-pointer"
                            title="Edit Property & Photos"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                            title="Delete Property"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Modal with Enhanced Photo Upload */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#1E293B] border border-slate-700 rounded-3xl shadow-2xl p-5 sm:p-7 relative my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-700 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingProperty ? 'Edit Property & Media' : 'Create New Property Listing'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Add specifications, location details, and upload high-resolution property photos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setModalDismissed(true);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto flex-1 pr-1 -mr-1">
              <form id="property-form" onSubmit={handleSaveProperty} className="space-y-6 text-xs">
                {/* ======================================================== */}
                {/* 1. PROPERTY IMAGES & PHOTO UPLOAD SECTION (HIGHLIGHTED) */}
                {/* ======================================================== */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/90 shadow-inner space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#10B981]" />
                      <span className="font-bold text-white text-sm">Property Photos & Gallery</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-[10px] font-bold">
                        {formData.images.length} Added
                      </span>
                    </div>

                    {/* Media Tabs: File Upload, URL, Presets */}
                    <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('upload')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          activeMediaTab === 'upload'
                            ? 'bg-[#10B981] text-slate-950 shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('url')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          activeMediaTab === 'url'
                            ? 'bg-[#10B981] text-slate-950 shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>Image URL</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('presets')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          activeMediaTab === 'presets'
                            ? 'bg-[#10B981] text-slate-950 shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Presets</span>
                      </button>
                    </div>
                  </div>

                  {/* TAB 1: Drag & Drop File Upload */}
                  {activeMediaTab === 'upload' && (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                        isDragging
                          ? 'border-[#10B981] bg-[#10B981]/10'
                          : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-600'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center border border-[#10B981]/20">
                        <Upload className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">
                          Click to upload property photos or drag & drop files here
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          Supports JPG, PNG, and WebP. You can select multiple images at once.
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-[#10B981] font-semibold text-[11px] inline-flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5" />
                          Browse from Device / Mobile
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Image URL Input */}
                  {activeMediaTab === 'url' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="Paste image web link (e.g. https://images.unsplash.com/...)"
                          className="flex-1 px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
                        />
                        <button
                          type="button"
                          onClick={handleAddUrl}
                          className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Photo</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Paste high-resolution photo links from any image CDN, developer portal, or cloud bucket.
                      </p>
                    </div>
                  )}

                  {/* TAB 3: Curated Presets */}
                  {activeMediaTab === 'presets' && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-slate-400">
                        Click any architectural photograph to instantly attach it to this property:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {PRESET_PROPERTY_IMAGES.map((preset, idx) => {
                          const isAlreadyAdded = formData.images.includes(preset.url);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleAddPreset(preset.url, preset.name)}
                              className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                                isAlreadyAdded
                                  ? 'border-[#10B981] bg-[#10B981]/15 text-white'
                                  : 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
                              }`}
                            >
                              <img
                                src={preset.url}
                                alt={preset.name}
                                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-700"
                              />
                              <div className="truncate">
                                <div className="font-semibold text-[11px] truncate">{preset.name}</div>
                                <div className="text-[9px] text-slate-400">{preset.tag}</div>
                              </div>
                              {isAlreadyAdded && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 ml-auto" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Photo Thumbnails Preview & Management Grid */}
                  {formData.images.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-300">
                          Attached Photos ({formData.images.length})
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Click ⭐ to set as primary cover photo
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {formData.images.map((imgUrl, index) => {
                          const isCover = formData.coverImage === imgUrl || (!formData.coverImage && index === 0);

                          return (
                            <div
                              key={index}
                              className={`relative rounded-xl overflow-hidden border-2 group bg-slate-800 transition-all ${
                                isCover
                                  ? 'border-[#10B981] shadow-md shadow-[#10B981]/20'
                                  : 'border-slate-700 hover:border-slate-500'
                              }`}
                            >
                              <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-950">
                                <img
                                  src={imgUrl}
                                  alt={`Property Photo ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />

                                {/* Cover Badge */}
                                {isCover && (
                                  <div className="absolute top-1.5 left-1.5 bg-[#10B981] text-slate-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 z-10">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    <span>Cover</span>
                                  </div>
                                )}

                                {/* Top Right Actions */}
                                <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-10">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveImage(index);
                                    }}
                                    className="p-1 rounded-md bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-xs"
                                    title="Delete photo"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Bottom Overlay Action: Make Cover */}
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCover(imgUrl)}
                                    className="absolute inset-x-0 bottom-0 py-1 bg-black/80 hover:bg-[#10B981] hover:text-slate-950 text-white text-[10px] font-semibold text-center transition-colors cursor-pointer flex items-center justify-center gap-1 opacity-90 group-hover:opacity-100"
                                  >
                                    <Star className="w-2.5 h-2.5" />
                                    <span>Set as Cover</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* ======================================================== */}
                {/* 2. PROPERTY SPECIFICATIONS & PRICING FORM               */}
                {/* ======================================================== */}
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
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                    >
                      {PAN_INDIA_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Locality</label>
                    <input
                      type="text"
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      placeholder="e.g. Kalyan West, Powai, Thane West"
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

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Property Type</label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                      className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                    >
                      <option value="APARTMENT">Apartment</option>
                      <option value="VILLA">Villa</option>
                      <option value="PENTHOUSE">Penthouse</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="PLOT">Plot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Possession Status</label>
                    <select
                      value={formData.possessionStatus}
                      onChange={(e) => setFormData({ ...formData, possessionStatus: e.target.value as PossessionStatus })}
                      className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                    >
                      <option value="UNDER_CONSTRUCTION">Under Construction</option>
                      <option value="READY_TO_MOVE">Ready To Move</option>
                      <option value="NEW_LAUNCH">New Launch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe property features, lifestyle amenities, connectivity..."
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981] resize-none"
                  />
                </div>

                {/* Flags / Switches */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded border-slate-700 text-[#10B981] focus:ring-[#10B981]"
                    />
                    <span className="text-slate-300 font-medium">Publish Live Immediately</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded border-slate-700 text-[#10B981] focus:ring-[#10B981]"
                    />
                    <span className="text-slate-300 font-medium">Featured Listing Badge</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVerified}
                      onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                      className="rounded border-slate-700 text-[#10B981] focus:ring-[#10B981]"
                    />
                    <span className="text-slate-300 font-medium">MahaRERA Verified</span>
                  </label>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 mt-4 border-t border-slate-700 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">
                {formData.images.length} photo(s) selected
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="property-form"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold shadow-md shadow-[#10B981]/20 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProperty ? 'Save Changes' : 'Create Listing'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
