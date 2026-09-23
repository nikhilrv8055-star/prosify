'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  CheckCircle2,
  Calendar,
  Building,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Scale,
} from 'lucide-react';
import { Property } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  onScheduleVisit?: (property: Property) => void;
  onEnquire?: (property: Property) => void;
  onToggleCompare?: (property: Property) => void;
  isCompared?: boolean;
}

export function PropertyCard({
  property,
  onScheduleVisit,
  onEnquire,
  onToggleCompare,
  isCompared = false,
}: PropertyCardProps) {
  return (
    <div className="group bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Property Image & Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100">
        <Image
          src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80'}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
              {property.listingType === 'COMMERCIAL' ? 'Commercial Sale' : 'For Sale'}
            </span>
            {property.verified && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          {onToggleCompare && (
            <button
              type="button"
              onClick={() => onToggleCompare(property)}
              className={`p-1.5 rounded-full backdrop-blur-xs text-xs font-semibold transition-colors ${
                isCompared
                  ? 'bg-[#D4A017] text-neutral-950 font-bold'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
              title="Compare Property"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bottom Over Image Info */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-[11px] font-semibold text-[#F4C430] uppercase tracking-wide">
            {property.developerName}
          </p>
          <p className="text-base font-bold text-white drop-shadow-xs line-clamp-1">
            {property.title}
          </p>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="line-clamp-1">{property.locality}, {property.city}</span>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-neutral-100 text-center">
            <div>
              <span className="block text-[10px] uppercase font-bold text-neutral-400">Config</span>
              <span className="text-xs font-bold text-neutral-800">{property.bhk}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-neutral-400">Carpet Area</span>
              <span className="text-xs font-bold text-neutral-800">{property.carpetAreaSqFt} sq.ft</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-neutral-400">Timeline</span>
              <span className="text-xs font-bold text-neutral-800 truncate block">
                {property.possessionStatus === 'READY_TO_MOVE' ? 'Ready' : 'Under Const.'}
              </span>
            </div>
          </div>

          {/* Direct Developer Discount Pill */}
          {property.directDeveloperDiscountPct && (
            <div className="flex items-center gap-1 text-[11px] text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A017] shrink-0" />
              <span>Direct Developer Offer: {property.directDeveloperDiscountPct}% Instant Benefit</span>
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-neutral-100">
          <div>
            <span className="block text-[10px] font-semibold text-neutral-400 uppercase">
              All Inclusive
            </span>
            <span className="text-lg font-black text-neutral-950">
              {formatIndianPrice(property.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onScheduleVisit && (
              <button
                type="button"
                onClick={() => onScheduleVisit(property)}
                className="px-3 py-2 rounded-xl border border-neutral-300 hover:border-neutral-900 text-neutral-800 hover:text-neutral-950 text-xs font-bold transition-all cursor-pointer"
              >
                Visit
              </button>
            )}
            {onEnquire && (
              <button
                type="button"
                onClick={() => onEnquire(property)}
                className="px-3.5 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Enquire
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
