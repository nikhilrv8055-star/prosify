'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Building,
  Maximize,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  ChevronRight,
  Layers,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { EMICalculator } from '@/components/marketplace/EMICalculator';
import { EnquiryModal } from '@/components/marketplace/EnquiryModal';
import { SiteVisitModal } from '@/components/marketplace/SiteVisitModal';
import { PropertyCard } from '@/components/marketplace/PropertyCard';
import { store } from '@/lib/data/store';
import { formatIndianPrice, formatArea } from '@/lib/utils';
import { useAuth } from '@/lib/auth/authContext';
import { useToast } from '@/components/ui/toast';
import Script from 'next/script';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { isSaved, toggleSavedProperty } = useAuth();
  const { toast } = useToast();

  const property = useMemo(() => {
    return store.getPropertyBySlug(slug) || store.getPropertyById(slug);
  }, [slug]);

  // Modals state
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(property?.coverImage || '');
  const [copied, setCopied] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const favorite = property ? isSaved(property.id) : false;

  const handleToggleFavorite = () => {
    if (!property) return;
    toggleSavedProperty(property.id);
    toast({
      title: favorite ? 'Removed from Saved' : 'Property Saved',
      description: favorite
        ? `"${property.title}" removed from your favorites.`
        : `"${property.title}" added to your saved properties.`,
      type: 'info',
    });
  };

  const similarProperties = useMemo(() => {
    if (!property) return [];
    return store
      .getProperties({ city: property.city })
      .filter((p) => p.id !== property.id)
      .slice(0, 3);
  }, [property]);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-neutral-900">Property Not Found</h2>
          <p className="text-xs text-neutral-500">
            The property you are looking for may have been sold or unpublished.
          </p>
          <Link
            href="/properties"
            className="inline-block px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold"
          >
            Explore Active Properties
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const allImages = [property.coverImage, ...(property.images || [])].filter(Boolean);
  const activeImage = selectedImage || property.coverImage;

  // Price breakdown calculations
  const stampDuty = Math.round(property.price * 0.06); // 6% Maharashtra
  const registration = Math.min(30000, Math.round(property.price * 0.01)); // 1% capped at 30k
  const gst = property.possessionStatus === 'READY_TO_MOVE' ? 0 : Math.round(property.price * 0.05); // 5% under construction
  const totalEstimatedCost = property.price + stampDuty + registration + gst;

  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in "${property.title}" (${property.bhk}, ${formatIndianPrice(property.price)}) at ${property.locality}, ${property.city}. RERA: ${property.reraNumber || 'N/A'}. Please share floor plans.`
  );

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  // Schema.org RealEstateListing JSON-LD
  const schemaOrgData = {
    '@context': 'https://schema.org',
    '@type': 'SingleFamilyResidence',
    name: property.title,
    description: property.description,
    image: property.coverImage,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.locality,
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.076,
      longitude: 72.8777,
    },
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    numberOfRooms: property.bhk,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.carpetArea,
      unitCode: 'FTK',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Navbar onOpenEnquiry={() => setEnquiryOpen(true)} />

      {/* Structured data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-neutral-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-neutral-900">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <Link href="/properties" className="hover:text-neutral-900">Properties</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <Link href={`/properties?city=${property.city}`} className="hover:text-neutral-900">
              {property.city}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="text-neutral-900 font-semibold truncate">{property.title}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 w-full space-y-6 lg:space-y-8 pb-28 lg:pb-8">
        {/* Title & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              {property.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  MahaRERA Verified
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-900 text-white">
                {property.bhk}
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                RERA: {property.reraNumber || 'Applied'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
              {property.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>{property.address}, {property.locality}, {property.city}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleFavorite}
              className={`p-2.5 rounded-xl border transition-colors ${
                favorite ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
              }`}
              title={favorite ? 'Remove from Favorites' : 'Save to Favorites'}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors relative"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -bottom-7 right-0 text-[10px] bg-neutral-900 text-white px-2 py-0.5 rounded shadow">
                  Copied!
                </span>
              )}
            </button>
            <button
              onClick={() => setVisitOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs"
            >
              Schedule Free Site Visit
            </button>
          </div>
        </div>

        {/* Mobile Top Gallery Carousel with Counter (320px - 1023px) */}
        <div className="block lg:hidden relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 aspect-[16/10]">
          <Image
            src={allImages[activeImageIndex] || activeImage}
            alt={property.title}
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Image Counter Badge */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold">
            {activeImageIndex + 1} / {allImages.length}
          </div>

          {/* Quick swipe / tap thumbnails bar */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1">
            {allImages.slice(0, 5).map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImageIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeImageIndex === i ? 'bg-[#D4A017] w-5' : 'bg-white/60'
                }`}
                aria-label={`View photo ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Gallery Grid (1024px+) */}
        <div className="hidden lg:grid grid-cols-4 gap-4">
          <div className="lg:col-span-3 relative aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
            <Image
              src={activeImage}
              alt={property.title}
              fill
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[450px]">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedImage(img);
                  setActiveImageIndex(idx);
                }}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === img ? 'border-[#D4A017] ring-2 ring-[#D4A017]/30' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Details, Specs, Amenities, EMI, Price breakdown */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Specs Grid */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">
                Core Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-neutral-500 block">Carpet Area</span>
                  <strong className="text-sm font-bold text-neutral-950">
                    {formatArea(property.carpetArea)}
                  </strong>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-neutral-500 block">Super Built-up</span>
                  <strong className="text-sm font-bold text-neutral-950">
                    {formatArea(property.builtUpArea)}
                  </strong>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-neutral-500 block">Floor / Total</span>
                  <strong className="text-sm font-bold text-neutral-950">
                    {property.floorNumber ? `${property.floorNumber} of ${property.totalFloors}` : 'Mid Floor'}
                  </strong>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-neutral-500 block">Facing</span>
                  <strong className="text-sm font-bold text-neutral-950">
                    {property.facing || 'East Facing (Vastu)'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-neutral-950">Property Overview</h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-neutral-950">Project Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-xs font-medium text-neutral-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Price Breakdown Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-neutral-950">Estimated Cost Breakdown</h3>
                  <p className="text-xs text-neutral-500">Government taxes and registration estimates</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 rounded-lg text-neutral-700">
                  Maharashtra Rates
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-neutral-700">
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span>Base Agreement Value:</span>
                  <strong className="text-neutral-950">{formatIndianPrice(property.price)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span>Stamp Duty (6%):</span>
                  <span>{formatIndianPrice(stampDuty)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span>Registration Fee (1% capped):</span>
                  <span>₹{registration.toLocaleString('en-IN')}</span>
                </div>
                {gst > 0 && (
                  <div className="flex justify-between py-1 border-b border-neutral-50">
                    <span>GST (5% for Under Construction):</span>
                    <span>{formatIndianPrice(gst)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 text-sm font-bold text-neutral-950 border-t border-neutral-200">
                  <span>Total Estimated On-Road Cost:</span>
                  <span className="text-[#D4A017]">{formatIndianPrice(totalEstimatedCost)}</span>
                </div>
              </div>
            </div>

            {/* EMI Calculator */}
            <EMICalculator initialPrice={property.price} />
          </div>

          {/* Right Column: Sticky Pricing & Direct Developer Enquiry Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-md sticky top-24 space-y-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  All-Inclusive Price
                </span>
                <div className="text-3xl font-extrabold text-neutral-950 mt-1">
                  {formatIndianPrice(property.price, property.listingType === 'RENT')}
                </div>
                {property.pricePerSqft > 0 && (
                  <span className="text-xs text-neutral-500 font-medium">
                    ₹{property.pricePerSqft.toLocaleString('en-IN')}/sq.ft carpet
                  </span>
                )}
              </div>

              {/* Developer badge */}
              {property.developerName && (
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-3">
                  <Building className="w-6 h-6 text-[#D4A017] shrink-0" />
                  <div className="text-xs">
                    <span className="text-neutral-500 block">Developed by</span>
                    <strong className="text-neutral-900 font-bold">{property.developerName}</strong>
                    {property.projectName && <p className="text-neutral-500">{property.projectName}</p>}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Request Price Sheet & Callback</span>
                </button>

                <a
                  href={`https://wa.me/919326303244?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => setVisitOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Free Site Visit</span>
                </button>
              </div>

              <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-400 text-center space-y-1">
                <p className="flex items-center justify-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Free Buyer Consultation
                </p>
                <p>Direct from builder inventory • Zero brokerage charges</p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="pt-8 border-t border-neutral-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-neutral-950">
                Similar Properties in {property.city}
              </h3>
              <Link
                href={`/properties?city=${property.city}`}
                className="text-xs font-semibold text-neutral-700 hover:text-[#D4A017] flex items-center gap-1"
              >
                <span>View More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Action Bar (320px - 1023px) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden bg-white/98 backdrop-blur-md border-t border-neutral-200/90 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-none">Total Price</span>
            <span className="text-base font-black text-neutral-950 tracking-tight">
              {formatIndianPrice(property.price)}
            </span>
            <span className="text-[10px] text-neutral-500 block leading-none">
              ₹{property.pricePerSqft?.toLocaleString('en-IN') || '14,200'}/sq.ft
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVisitOpen(true)}
              className="py-2.5 px-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 font-bold text-xs hover:bg-neutral-50 active:scale-95 transition-all whitespace-nowrap"
            >
              Visit
            </button>

            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] active:scale-95 text-neutral-950 font-bold text-xs shadow-xs transition-all whitespace-nowrap"
            >
              Enquire
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        property={property}
      />

      <SiteVisitModal
        isOpen={visitOpen}
        onClose={() => setVisitOpen(false)}
        property={property}
      />
    </div>
  );
}
