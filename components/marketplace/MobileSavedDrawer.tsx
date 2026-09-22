'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, X, Trash2, ArrowRight, Building, MapPin, Scale } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { store } from '@/lib/data/store';
import { formatIndianPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

interface MobileSavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSavedDrawer({ isOpen, onClose }: MobileSavedDrawerProps) {
  const { savedPropertyIds, toggleSavedProperty, comparedPropertyIds, toggleCompareProperty } = useAuth();
  const { toast } = useToast();

  if (!isOpen) return null;

  const savedProperties = store
    .getProperties()
    .filter((p) => savedPropertyIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-[#171717] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Saved Properties</h3>
              <p className="text-[11px] text-neutral-400">
                {savedProperties.length} shortlisted {savedProperties.length === 1 ? 'home' : 'homes'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedProperties.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-neutral-800">No saved properties yet</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Tap the heart icon on any property card to shortlist your favorite homes for easy comparison.
              </p>
              <Link
                href="/properties"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4A017] text-neutral-950 text-xs font-bold"
              >
                <span>Browse Properties</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            savedProperties.map((prop) => {
              const isCompared = comparedPropertyIds.includes(prop.id);
              return (
                <div
                  key={prop.id}
                  className="flex gap-3 p-2.5 rounded-2xl border border-neutral-200 hover:border-neutral-300 bg-neutral-50/50 transition-all"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-200">
                    <Image
                      src={prop.coverImage}
                      alt={prop.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-950/80 text-white backdrop-blur-xs">
                      {prop.bhk} BHK
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          href={`/properties/${prop.slug}`}
                          onClick={onClose}
                          className="font-bold text-xs text-neutral-900 line-clamp-1 hover:text-[#D4A017]"
                        >
                          {prop.title}
                        </Link>
                        <button
                          onClick={() => {
                            toggleSavedProperty(prop.id);
                            toast({
                              title: 'Shortlist Updated',
                              description: 'Removed from saved properties.',
                              type: 'info',
                            });
                          }}
                          className="p-1 text-neutral-400 hover:text-red-500 shrink-0"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="truncate">{prop.locality}, {prop.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200/60">
                      <span className="text-xs font-extrabold text-neutral-950">
                        {formatIndianPrice(prop.price)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            toggleCompareProperty(prop.id);
                            toast({
                              title: isCompared ? 'Removed from Compare' : 'Added to Compare',
                              description: isCompared ? 'Removed from comparison tray.' : 'Added to comparison tray.',
                              type: 'info',
                            });
                          }}
                          className={`p-1.5 rounded-lg border text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                            isCompared
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                          }`}
                          title="Toggle Compare"
                        >
                          <Scale className="w-3 h-3" />
                          <span className="text-[10px]">{isCompared ? 'Comparing' : 'Compare'}</span>
                        </button>

                        <Link
                          href={`/properties/${prop.slug}`}
                          onClick={onClose}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-[10px] font-bold hover:bg-neutral-800"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {savedProperties.length > 0 && (
          <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
            <Link
              href="/compare"
              onClick={onClose}
              className="text-xs font-bold text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>Compare Shortlist ({comparedPropertyIds.length})</span>
            </Link>

            <Link
              href="/properties"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Find More Homes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
