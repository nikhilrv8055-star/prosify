'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  Camera,
  Layers,
  Info,
} from 'lucide-react';

interface UnitPhotoCarouselProps {
  images?: string[];
  unitNumber: string;
  projectName?: string;
  configuration?: string;
}

// Curated high-definition fallback images based on unit configurations
const DEFAULT_HD_UNIT_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=85',
    title: 'Grand Living & Dining Room',
    caption: 'Sunlit expansive hall with Italian marble finish and deck balcony',
  },
  {
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&auto=format&fit=crop&q=85',
    title: 'Master Suite Bedroom',
    caption: 'Double-glazed panoramic glass wall with unrestricted city skyline views',
  },
  {
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&auto=format&fit=crop&q=85',
    title: 'Designer European Modular Kitchen',
    caption: 'Granite countertop with smart appliance fixtures & utility deck',
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&auto=format&fit=crop&q=85',
    title: 'Private Sky Deck / Balcony',
    caption: 'Breezy east-facing morning sundeck with glass balustrade',
  },
  {
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1600&auto=format&fit=crop&q=85',
    title: 'Guest Bedroom & Study Nook',
    caption: 'Acoustically insulated wooden flooring & integrated work station',
  },
  {
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&auto=format&fit=crop&q=85',
    title: 'Luxury En-Suite Bathroom',
    caption: 'Premium Grohe & Kohler sanitary fittings with rain shower cubicle',
  },
];

export function UnitPhotoCarousel({
  images,
  unitNumber,
  projectName = 'Luxury Residence',
  configuration = 'Residential Unit',
}: UnitPhotoCarouselProps) {
  // Normalize photo list
  const photoList = React.useMemo(() => {
    if (images && images.length > 0) {
      return images.map((url, idx) => ({
        url,
        title: DEFAULT_HD_UNIT_PHOTOS[idx % DEFAULT_HD_UNIT_PHOTOS.length]?.title || `Photo ${idx + 1}`,
        caption: DEFAULT_HD_UNIT_PHOTOS[idx % DEFAULT_HD_UNIT_PHOTOS.length]?.caption || `${configuration} Spec Image`,
      }));
    }
    return DEFAULT_HD_UNIT_PHOTOS;
  }, [images, configuration]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance in px
  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photoList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photoList.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation when focused or fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, photoList.length]);

  // Keep active thumbnail scrolled into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeBtn = thumbnailsRef.current.children[currentIndex] as HTMLElement | undefined;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  const currentPhoto = photoList[currentIndex];

  return (
    <div className="w-full select-none">
      {/* Main High-Definition Display Frame */}
      <div
        className="relative w-full aspect-16/10 sm:aspect-16/9 bg-neutral-950 rounded-2xl overflow-hidden group border border-neutral-800 shadow-inner"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={currentPhoto.url}
          alt={`${unitNumber} - ${currentPhoto.title}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 600px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-102"
          referrerPolicy="no-referrer"
        />

        {/* Ambient Top Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-neutral-950/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold">
            <Camera className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>HD Photo {currentIndex + 1} of {photoList.length}</span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-full bg-neutral-950/70 hover:bg-neutral-950 backdrop-blur-md border border-white/10 text-white/90 hover:text-white transition-colors"
              title="View full resolution"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Left / Right Nav Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Photo"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-950/75 hover:bg-[#D4A017] hover:text-neutral-950 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all shadow-lg active:scale-95 z-10 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Photo"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-950/75 hover:bg-[#D4A017] hover:text-neutral-950 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all shadow-lg active:scale-95 z-10 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Touch Swipe Hint on mobile */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none flex justify-center sm:hidden opacity-0 group-active:opacity-80 transition-opacity">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium tracking-wide">
            Swipe left / right
          </span>
        </div>

        {/* Bottom Caption Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-white z-10">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#D4A017] block">
                {unitNumber} • {configuration}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                {currentPhoto.title}
              </h4>
              <p className="text-[11px] text-neutral-300 line-clamp-1 mt-0.5">
                {currentPhoto.caption}
              </p>
            </div>

            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-1 shrink-0 pb-0.5">
              {photoList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentIndex === idx ? 'w-5 bg-[#D4A017]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Thumbnail Ribbon with Touch Swipe Scroll */}
      <div
        ref={thumbnailsRef}
        className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 px-0.5 scrollbar-thin scrollbar-thumb-neutral-300 touch-pan-x"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {photoList.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
              currentIndex === idx
                ? 'border-[#D4A017] ring-2 ring-[#D4A017]/30 scale-102 shadow-md'
                : 'border-transparent opacity-60 hover:opacity-100 hover:border-neutral-300'
            }`}
            style={{ scrollSnapAlign: 'start' }}
          >
            <Image
              src={photo.url}
              alt={`Thumbnail ${idx + 1}`}
              fill
              sizes="80px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 inset-x-0 bg-neutral-950/70 text-[9px] font-medium text-white text-center py-0.5 truncate px-0.5">
              {idx + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Fullscreen HD Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-60 bg-neutral-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full flex items-center justify-between text-white z-10">
            <div>
              <span className="text-xs font-mono text-[#D4A017]">
                Unit {unitNumber} Fullscreen HD Viewer
              </span>
              <h3 className="text-base font-bold text-white">{currentPhoto.title}</h3>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div
            className="relative w-full max-w-5xl flex-1 my-4 flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full h-full max-h-[75vh]">
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.title}
                fill
                priority
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-[#D4A017] hover:text-black text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-[#D4A017] hover:text-black text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full text-center text-xs text-neutral-400">
            <p>{currentPhoto.caption}</p>
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Press Escape or click Minimize to exit • Swipe to navigate
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
