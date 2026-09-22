'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Building2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Home,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { store } from '@/lib/data/store';
import { formatIndianPrice } from '@/lib/utils';

export interface MobileFilterCriteria {
  city: string;
  listingType: string;
  propertyType: string;
  bhks: string[]; // Supports multiple BHKs (e.g. ['2 BHK', '3 BHK'])
  minPrice: number;
  maxPrice: number;
  possessionStatuses: string[]; // Supports multiple possession criteria (e.g. ['READY_TO_MOVE', 'UNDER_CONSTRUCTION'])
  verifiedOnly: boolean;
}

export const DEFAULT_FILTER_CRITERIA: MobileFilterCriteria = {
  city: 'ALL',
  listingType: 'ALL',
  propertyType: 'ALL',
  bhks: [],
  minPrice: 0,
  maxPrice: 0,
  possessionStatuses: [],
  verifiedOnly: false,
};

const STORAGE_KEY = 'prosify_mobile_filters_v2';

interface MobileFilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  criteria: MobileFilterCriteria;
  onApply: (newCriteria: MobileFilterCriteria) => void;
}

export function MobileFilterOverlay({
  isOpen,
  onClose,
  criteria,
  onApply,
}: MobileFilterOverlayProps) {
  // Local working copy of criteria while the drawer is open
  const [draft, setDraft] = useState<MobileFilterCriteria>(criteria);
  const [prevCriteria, setPrevCriteria] = useState<MobileFilterCriteria>(criteria);

  // Adjust draft state during render if parent criteria updates
  if (prevCriteria !== criteria) {
    setPrevCriteria(criteria);
    setDraft(criteria);
  }

  // Client-side mounted state for React Portal
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Prevent background scrolling when overlay is active
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Available BHK options
  const bhkOptions = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];

  // Available Possession options
  const possessionOptions = [
    { id: 'READY_TO_MOVE', label: 'Ready to Move', sublabel: 'Immediate handover' },
    { id: 'UNDER_CONSTRUCTION', label: 'Under Construction', sublabel: 'In 1-3 years' },
    { id: 'NEW_LAUNCH', label: 'New Launch', sublabel: 'Pre-launch & bookings' },
  ];

  // Quick budget range presets
  const budgetPresets = [
    { label: 'Any Budget', min: 0, max: 0 },
    { label: 'Under ₹50L', min: 0, max: 5000000 },
    { label: '₹50L - ₹1 Cr', min: 5000000, max: 10000000 },
    { label: '₹1 Cr - ₹2 Cr', min: 10000000, max: 20000000 },
    { label: '₹2 Cr - ₹5 Cr', min: 20000000, max: 50000000 },
    { label: 'Above ₹5 Cr', min: 50000000, max: 0 },
  ];

  // Toggle BHK in multi-select array
  const toggleBhk = (bhk: string) => {
    setDraft((prev) => {
      const exists = prev.bhks.includes(bhk);
      const nextBhks = exists
        ? prev.bhks.filter((item) => item !== bhk)
        : [...prev.bhks, bhk];
      return { ...prev, bhks: nextBhks };
    });
  };

  // Toggle Possession in multi-select array
  const togglePossession = (possessionId: string) => {
    setDraft((prev) => {
      const exists = prev.possessionStatuses.includes(possessionId);
      const nextStatuses = exists
        ? prev.possessionStatuses.filter((item) => item !== possessionId)
        : [...prev.possessionStatuses, possessionId];
      return { ...prev, possessionStatuses: nextStatuses };
    });
  };

  // Set budget preset
  const setBudgetPreset = (min: number, max: number) => {
    setDraft((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  // Calculate matching properties count live based on draft filters
  const liveCount = useMemo(() => {
    return store.getProperties({
      city: draft.city === 'ALL' ? undefined : draft.city,
      listingType: draft.listingType === 'ALL' ? undefined : draft.listingType,
      propertyType: draft.propertyType === 'ALL' ? undefined : draft.propertyType,
      bhk: draft.bhks.length > 0 ? draft.bhks : undefined,
      minPrice: draft.minPrice > 0 ? draft.minPrice : undefined,
      maxPrice: draft.maxPrice > 0 ? draft.maxPrice : undefined,
      possessionStatus: draft.possessionStatuses.length > 0 ? draft.possessionStatuses : undefined,
      verifiedOnly: draft.verifiedOnly,
    }).length;
  }, [draft]);

  // Total active filter criteria count
  const activeCount = useMemo(() => {
    let count = 0;
    if (draft.city !== 'ALL') count++;
    if (draft.listingType !== 'ALL') count++;
    if (draft.propertyType !== 'ALL') count++;
    if (draft.bhks.length > 0) count += draft.bhks.length;
    if (draft.minPrice > 0 || draft.maxPrice > 0) count++;
    if (draft.possessionStatuses.length > 0) count += draft.possessionStatuses.length;
    if (draft.verifiedOnly) count++;
    return count;
  }, [draft]);

  // Reset all filters in draft
  const handleReset = () => {
    setDraft(DEFAULT_FILTER_CRITERIA);
  };

  // Apply filters and persist to localStorage
  const handleApply = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      }
    } catch {
      // Storage unavailable or disabled
    }
    onApply(draft);
    onClose();
  };

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filter Properties"
      className="fixed inset-0 z-[9999] flex flex-col bg-white animate-in fade-in duration-200 select-none overflow-hidden"
    >
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3.5 bg-white border-b border-neutral-200 shadow-2xs shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            aria-label="Close Filter"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
              <span>Filter Properties</span>
              {activeCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#D4A017] text-neutral-950 text-[11px] font-black flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </h2>
            <p className="text-[11px] text-neutral-500 font-medium">
              Multi-criteria search on small devices
            </p>
          </div>
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#FD3752] hover:bg-red-50 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </header>

      {/* 2. SCROLLABLE FILTER CRITERIA BODY */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-28">
        {/* SECTION A: BHK SELECTION (Multiple criteria) */}
        <section className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-[#D4A017]" />
              <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                Bedrooms (BHK)
              </label>
            </div>
            {draft.bhks.length > 0 && (
              <span className="text-[11px] font-semibold text-[#D4A017] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {draft.bhks.length} selected
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-500 mb-3">
            Select one or more BHK configurations:
          </p>

          <div className="grid grid-cols-3 gap-2">
            {bhkOptions.map((bhk) => {
              const isSelected = draft.bhks.includes(bhk);
              return (
                <button
                  key={bhk}
                  type="button"
                  onClick={() => toggleBhk(bhk)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 border ${
                    isSelected
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#D4A017]" />}
                  <span>{bhk}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION B: PRICE RANGE (Dual mode: Presets & Max Slider) */}
        <section className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#D4A017]" />
              <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                Budget / Price Range
              </label>
            </div>
            {(draft.minPrice > 0 || draft.maxPrice > 0) && (
              <span className="text-[11px] font-bold text-neutral-900 bg-white px-2.5 py-0.5 rounded-full border border-neutral-200 shadow-2xs">
                {draft.minPrice > 0 && draft.maxPrice > 0
                  ? `${formatIndianPrice(draft.minPrice)} - ${formatIndianPrice(draft.maxPrice)}`
                  : draft.maxPrice > 0
                  ? `Up to ${formatIndianPrice(draft.maxPrice)}`
                  : `Above ${formatIndianPrice(draft.minPrice)}`}
              </span>
            )}
          </div>

          <p className="text-[11px] text-neutral-500 mb-3">
            Quick presets or fine-tune maximum budget:
          </p>

          {/* Quick presets */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {budgetPresets.map((preset) => {
              const isSelected =
                draft.minPrice === preset.min && draft.maxPrice === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setBudgetPreset(preset.min, preset.max)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer active:scale-95 border ${
                    isSelected
                      ? 'bg-[#D4A017] text-neutral-950 border-[#D4A017] font-bold shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Custom Max Price Slider */}
          <div className="bg-white p-3 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between text-xs text-neutral-700 font-semibold mb-1">
              <span>Max Budget Cap:</span>
              <span className="text-[#D4A017] font-bold">
                {draft.maxPrice > 0 ? formatIndianPrice(draft.maxPrice) : 'No Upper Cap'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50000000"
              step="2500000"
              value={draft.maxPrice}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  maxPrice: Number(e.target.value),
                }))
              }
              className="w-full accent-[#D4A017] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>₹0</span>
              <span>₹2.5 Cr</span>
              <span>₹5 Cr+</span>
            </div>
          </div>
        </section>

        {/* SECTION C: POSSESSION STATUS (Multiple criteria) */}
        <section className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4A017]" />
              <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                Possession Status
              </label>
            </div>
            {draft.possessionStatuses.length > 0 && (
              <span className="text-[11px] font-semibold text-[#D4A017] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {draft.possessionStatuses.length} selected
              </span>
            )}
          </div>

          <div className="space-y-2">
            {possessionOptions.map((item) => {
              const isChecked = draft.possessionStatuses.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => togglePossession(item.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer active:scale-98 ${
                    isChecked
                      ? 'bg-white border-[#D4A017] ring-1 ring-[#D4A017] shadow-xs'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {item.sublabel}
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      isChecked
                        ? 'bg-[#D4A017] border-[#D4A017] text-neutral-950'
                        : 'border-neutral-300 bg-neutral-50'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION D: LOCATION / CITY */}
        <section className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-[#D4A017]" />
            <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
              City / Region
            </label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['ALL', 'Mumbai', 'Thane', 'Dombivli', 'Kalyan', 'Pune', 'Nagpur'].map((c) => {
              const isSelected = draft.city === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, city: c }))}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl text-center border transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {c === 'ALL' ? 'All Cities' : c}
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION E: PROPERTY CATEGORY & LISTING TYPE */}
        <section className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-[#D4A017]" />
            <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
              Property Category
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { id: 'ALL', label: 'All Categories' },
              { id: 'APARTMENT', label: 'Apartment / Flat' },
              { id: 'VILLA', label: 'Villa / Bungalow' },
              { id: 'PENTHOUSE', label: 'Penthouse' },
              { id: 'PLOT', label: 'Residential Plot' },
              { id: 'OFFICE', label: 'Commercial Office' },
            ].map((cat) => {
              const isSelected = draft.propertyType === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, propertyType: cat.id }))}
                  className={`py-2 px-2.5 text-xs font-semibold rounded-xl text-left border transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-neutral-200">
            <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide block mb-2">
              Listing Intent
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
              {['ALL', 'BUY', 'RENT', 'COMMERCIAL'].map((type) => {
                const isSelected = draft.listingType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, listingType: type }))}
                    className={`py-2 text-center rounded-xl border transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-[#D4A017] text-neutral-950 border-[#D4A017] font-bold'
                        : 'bg-white text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {type === 'ALL' ? 'All' : type}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION F: RERA VERIFIED TOGGLE */}
        <section className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-xs font-bold text-neutral-900 block">
                  RERA Verified Only
                </span>
                <span className="text-[11px] text-neutral-500">
                  Show properties with verified title and RERA certificates
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={draft.verifiedOnly}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, verifiedOnly: e.target.checked }))
              }
              className="w-5 h-5 rounded text-[#D4A017] focus:ring-[#D4A017] accent-[#D4A017] cursor-pointer"
            />
          </label>
        </section>
      </div>

      {/* 3. STICKY BOTTOM ACTION BAR */}
      <footer className="sticky bottom-0 z-20 bg-white border-t border-neutral-200 px-4 py-3 flex items-center gap-3 shadow-lg">
        <button
          type="button"
          onClick={handleReset}
          className="py-3 px-4 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-bold active:scale-95 transition-all cursor-pointer"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={handleApply}
          className="flex-1 py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <span>View {liveCount} Properties</span>
          <span className="text-[#D4A017]">• Apply Criteria</span>
        </button>
      </footer>
    </div>,
    document.body
  );
}
