'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Share2,
  CheckCircle2,
  MapPin,
  Maximize,
  Calendar,
  Building,
  Scale,
  MessageCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Property } from '@/lib/types';
import { formatIndianPrice, formatArea } from '@/lib/utils';
import { useAuth } from '@/lib/auth/authContext';
import { useToast } from '@/components/ui/toast';
import { useFestivalTheme } from '@/components/theme/FestivalThemeProvider';

interface PropertyCardProps {
  property: Property;
  onScheduleVisit?: (prop: Property) => void;
  onEnquire?: (prop: Property) => void;
  onToggleCompare?: (prop: Property) => void;
  isCompared?: boolean;
}

export function PropertyCard({
  property,
  onScheduleVisit,
  onEnquire,
  onToggleCompare,
  isCompared: propIsCompared,
}: PropertyCardProps) {
  const { isSaved, toggleSavedProperty, isInCompare, toggleCompareProperty } = useAuth();
  const { toast } = useToast();
  const { config: festivalConfig, currentTheme: festivalTheme } = useFestivalTheme();
  const [shareSuccess, setShareSuccess] = useState(false);

  const isFavorite = isSaved(property.id);
  const isCompared = propIsCompared !== undefined ? propIsCompared : isInCompare(property.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedProperty(property.id);
    toast({
      title: isFavorite ? 'Removed from Saved' : 'Property Saved',
      description: isFavorite
        ? `"${property.title}" removed from your favorites.`
        : `"${property.title}" added to your saved properties.`,
      type: 'info',
    });
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare(property);
    } else {
      toggleCompareProperty(property.id);
    }
    toast({
      title: isCompared ? 'Removed from Compare' : 'Added to Compare',
      description: isCompared
        ? `"${property.title}" removed from comparison.`
        : `"${property.title}" added to comparison tray.`,
      type: 'info',
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const url = typeof window !== 'undefined' ? `${window.location.origin}/properties/${property.slug}` : '';
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this property in ${property.locality}, ${property.city}: ${formatIndianPrice(property.price)}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareSuccess(true);
        toast({
          title: 'Link Copied',
          description: 'Property link copied to clipboard.',
          type: 'success',
        });
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in "${property.title}" (${property.bhk}, ${formatIndianPrice(property.price)}) in ${property.locality}, ${property.city}. Please share floor plans and booking details.`
  );

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Card Header & Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
          <Image
            src={property.coverImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            referrerPolicy="no-referrer"
            unoptimized={Boolean(property.coverImage?.startsWith('data:') || property.coverImage?.includes('base64'))}
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            {property.isProVerifyCertified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D4A017] text-neutral-950 shadow-xs border border-amber-300">
                <CheckCircle2 className="w-3 h-3 text-neutral-950" />
                ProVerify™ Certified
              </span>
            ) : property.isVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-600/95 text-white backdrop-blur-xs shadow-xs">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            ) : null}
            {property.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#D4A017] text-neutral-950 shadow-xs">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
            {festivalConfig.isEnabled && festivalConfig.festiveBadgesEnabled && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black border ${festivalTheme.badgeBg} ${festivalTheme.badgeTextColor} ${festivalTheme.badgeBorder} shadow-xs`}>
                <span>{festivalTheme.iconEmoji}</span>
                <span>{festivalConfig.customBadgeText || festivalTheme.defaultBadgeText}</span>
              </span>
            )}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-900/80 text-neutral-200 backdrop-blur-xs">
              {property.possessionStatus === 'READY_TO_MOVE'
                ? 'Ready to Move'
                : property.possessionStatus === 'UNDER_CONSTRUCTION'
                ? 'Under Construction'
                : 'New Launch'}
            </span>
          </div>

          {/* Actions: Favorite & Share */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 text-neutral-700 hover:text-rose-600 hover:bg-white'
              }`}
              title={isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/90 text-neutral-700 hover:text-neutral-950 hover:bg-white backdrop-blur-md transition-colors"
              title="Share Link"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {shareSuccess && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] px-2.5 py-1 rounded-full shadow-lg">
              Link copied!
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Price & Price/sqft */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-xl font-bold tracking-tight text-neutral-950">
                {formatIndianPrice(property.price)}
              </span>
              {property.pricePerSqft > 0 && (
                <span className="ml-2 text-xs text-neutral-500 font-medium">
                  ₹{property.pricePerSqft.toLocaleString('en-IN')}/sq.ft
                </span>
              )}
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
              {property.bhk}
            </span>
          </div>

          {/* Title & Link */}
          <div>
            <Link
              href={`/properties/${property.slug}`}
              className="font-semibold text-neutral-900 hover:text-[#D4A017] transition-colors line-clamp-1 text-base leading-snug"
              title={property.title}
            >
              {property.title}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="line-clamp-1">
                {property.locality}, {property.city}
              </span>
            </div>
          </div>

          {/* Project & Developer */}
          {property.developerName && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100">
              <Building className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="line-clamp-1">
                By <strong>{property.developerName}</strong>
                {property.projectName ? ` • ${property.projectName}` : ''}
              </span>
            </div>
          )}

          {/* Core Specs Grid */}
          <div className="grid grid-cols-2 gap-2 py-2 border-y border-neutral-100 text-xs text-neutral-600">
            <div className="flex items-center gap-1.5">
              <Maximize className="w-3.5 h-3.5 text-neutral-400" />
              <span>Carpet: {formatArea(property.carpetArea)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>Possession: {property.possessionDate || 'Immediate'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 sm:p-5 pt-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleToggleCompare}
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1 font-medium ${
              isCompared
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'text-neutral-600 hover:text-neutral-900 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isCompared ? 'Compared' : 'Compare'}</span>
          </button>

          <a
            href={`https://wa.me/919326303244?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <Link
            href={`/properties/${property.slug}`}
            className="text-xs px-3 py-1.5 rounded-lg bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-semibold transition-colors flex items-center gap-1 shadow-xs"
          >
            <span>Details</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {onScheduleVisit && (
          <button
            onClick={() => onScheduleVisit(property)}
            className="w-full text-xs py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium transition-colors text-center"
          >
            Schedule Free Site Visit
          </button>
        )}
      </div>
    </div>
  );
}
