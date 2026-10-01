'use client';

import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  MapPin,
  Sparkles,
  Sliders,
  Globe,
  Layers,
  X,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  propertiesCount: number;
}

interface AmenityItem {
  id: string;
  name: string;
  icon: string;
  category: 'LUXURY' | 'FITNESS' | 'SECURITY' | 'ECO';
}

interface CityItem {
  id: string;
  name: string;
  state: string;
  country: string;
  activeListings: number;
}

export function PropertySpecificationsView({ subview }: { subview: string }) {
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: 'cat-1', name: 'Luxury Apartments & Penthouses', slug: 'apartments', propertiesCount: 42 },
    { id: 'cat-2', name: 'Gated Township Villas', slug: 'villas', propertiesCount: 18 },
    { id: 'cat-3', name: 'Commercial Grade-A Tech Parks', slug: 'commercial', propertiesCount: 12 },
    { id: 'cat-4', name: 'Investment NA Residential Plots', slug: 'plots', propertiesCount: 9 },
  ]);

  const [amenities, setAmenities] = useState<AmenityItem[]>([
    { id: 'am-1', name: 'Infinity Sky Pool', icon: 'Waves', category: 'LUXURY' },
    { id: 'am-2', name: 'Olympic Gymnasium & Cardio Suite', icon: 'Dumbbell', category: 'FITNESS' },
    { id: 'am-3', name: 'Multi-Tier AI Biometric Security', icon: 'Shield', category: 'SECURITY' },
    { id: 'am-4', name: 'EV Supercharging Bays', icon: 'Zap', category: 'ECO' },
    { id: 'am-5', name: 'Private Elevator Vestibule', icon: 'ArrowUp', category: 'LUXURY' },
    { id: 'am-6', name: 'Automated Valet & Concierge', icon: 'Car', category: 'LUXURY' },
  ]);

  const [cities, setCities] = useState<CityItem[]>([
    { id: 'city-1', name: 'Mumbai MMR', state: 'Maharashtra', country: 'India', activeListings: 145 },
    { id: 'city-2', name: 'Thane', state: 'Maharashtra', country: 'India', activeListings: 84 },
    { id: 'city-3', name: 'Navi Mumbai', state: 'Maharashtra', country: 'India', activeListings: 56 },
    { id: 'city-4', name: 'Bengaluru', state: 'Karnataka', country: 'India', activeListings: 92 },
    { id: 'city-5', name: 'Pune', state: 'Maharashtra', country: 'India', activeListings: 48 },
  ]);

  const [newCatName, setNewCatName] = useState('');
  const [newAmenityName, setNewAmenityName] = useState('');
  const [newCityName, setNewCityName] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const cat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      propertiesCount: 0,
    };
    setCategories([...categories, cat]);
    setNewCatName('');
    showToast(`Added category: ${cat.name}`);
  };

  const handleAddAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmenityName.trim()) return;
    const am: AmenityItem = {
      id: `am-${Date.now()}`,
      name: newAmenityName.trim(),
      icon: 'Sparkles',
      category: 'LUXURY',
    };
    setAmenities([...amenities, am]);
    setNewAmenityName('');
    showToast(`Added amenity: ${am.name}`);
  };

  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    const ct: CityItem = {
      id: `city-${Date.now()}`,
      name: newCityName.trim(),
      state: 'Maharashtra',
      country: 'India',
      activeListings: 0,
    };
    setCities([...cities, ct]);
    setNewCityName('');
    showToast(`Added city: ${ct.name}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-5 h-5 text-sky-400" />
          <span>Property Specifications & Taxonomy Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure real estate categories, verified amenities checklist, and geographical jurisdictions (Countries, States, Cities).
        </p>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* SECTION 1: CATEGORIES */}
      <div className="p-5 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Property Categories ({categories.length})</h3>
          </div>
          <form onSubmit={handleAddCategory} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="New category name..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((c) => (
            <div key={c.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block font-semibold">{c.name}</strong>
                <span className="text-[10px] text-slate-400">{c.propertiesCount} Listed Properties</span>
              </div>
              <button
                onClick={() => setCategories(categories.filter((cat) => cat.id !== c.id))}
                className="text-slate-500 hover:text-rose-400 cursor-pointer p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: AMENITIES */}
      <div className="p-5 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Verified Amenities Checklist ({amenities.length})</h3>
          </div>
          <form onSubmit={handleAddAmenity} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="New amenity name..."
              value={newAmenityName}
              onChange={(e) => setNewAmenityName(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-2">
          {amenities.map((a) => (
            <div
              key={a.id}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-white font-medium">{a.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">{a.category}</span>
              <button
                onClick={() => setAmenities(amenities.filter((am) => am.id !== a.id))}
                className="text-slate-500 hover:text-rose-400 cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: GEOGRAPHIES (COUNTRIES, STATES, CITIES) */}
      <div className="p-5 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Operating Markets & Cities ({cities.length})</h3>
          </div>
          <form onSubmit={handleAddCity} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="City name (e.g. Pune)..."
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Add City
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cities.map((city) => (
            <div key={city.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block font-semibold">{city.name}</strong>
                <span className="text-[11px] text-slate-400">{city.state}, {city.country}</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {city.activeListings} Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
