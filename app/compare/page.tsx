'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Scale,
  X,
  CheckCircle2,
  XCircle,
  Plus,
  Phone,
  MessageCircle,
  MapPin,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { EnquiryModal } from '@/components/marketplace/EnquiryModal';
import { SiteVisitModal } from '@/components/marketplace/SiteVisitModal';
import { store } from '@/lib/data/store';
import { Property } from '@/lib/types';
import { formatIndianPrice, formatArea } from '@/lib/utils';

function CompareContent() {
  const searchParams = useSearchParams();
  const allProps = useMemo(() => store.getProperties(), []);
  
  // Default to first 2 properties if none specified
  const initialSelected = useMemo(() => {
    const ids = searchParams?.get('ids')?.split(',').filter(Boolean) || [];
    if (ids.length > 0) {
      return allProps.filter((p) => ids.includes(p.id));
    }
    return allProps.slice(0, 2);
  }, [searchParams, allProps]);

  const [selectedProps, setSelectedProps] = useState<Property[]>(initialSelected);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);

  const removeProperty = (id: string) => {
    setSelectedProps(selectedProps.filter((p) => p.id !== id));
  };

  const addProperty = (id: string) => {
    const prop = allProps.find((p) => p.id === id);
    if (prop && !selectedProps.some((p) => p.id === id) && selectedProps.length < 4) {
      setSelectedProps([...selectedProps, prop]);
    }
  };

  const amenitiesList = [
    'Clubhouse',
    'Swimming Pool',
    'Gymnasium',
    'Children Play Area',
    'Jogging Track',
    'Badminton Court',
    '24x7 Security & CCTV',
    'Power Backup',
    'Vastu Compliant',
    'Solar Water Heating',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Navbar onOpenEnquiry={() => setEnquiryOpen(true)} />

      {/* Header */}
      <div className="bg-[#171717] text-white py-10 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            Decision Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Side-by-Side Property Comparison
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Compare pricing, carpet area efficiency, MahaRERA credentials, and amenities.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Selection Bar */}
        {selectedProps.length < 4 && (
          <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-neutral-800">
              Add another property to compare (Up to 4):
            </span>
            <select
              onChange={(e) => {
                if (e.target.value) addProperty(e.target.value);
              }}
              defaultValue=""
              className="py-1.5 px-3 rounded-lg border border-neutral-300 bg-neutral-50 font-medium"
            >
              <option value="" disabled>Select property to add...</option>
              {allProps
                .filter((p) => !selectedProps.some((sp) => sp.id === p.id))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.bhk}, {p.city}) - {formatIndianPrice(p.price)}
                  </option>
                ))}
            </select>
          </div>
        )}

        {selectedProps.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-neutral-200 text-center space-y-3">
            <Scale className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="font-bold text-neutral-900 text-base">No properties selected</h3>
            <p className="text-xs text-neutral-500">Add properties from the directory to start comparing.</p>
            <Link
              href="/properties"
              className="inline-block px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/60">
                  <th className="p-4 w-48 font-bold text-neutral-500 uppercase tracking-wider">
                    Feature
                  </th>
                  {selectedProps.map((prop) => (
                    <th key={prop.id} className="p-4 min-w-[240px] max-w-[280px]">
                      <div className="space-y-3">
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                          <Image
                            src={prop.coverImage}
                            alt={prop.title}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            onClick={() => removeProperty(prop.id)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-neutral-900/80 text-white hover:bg-rose-600 transition-colors"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div>
                          <Link
                            href={`/properties/${prop.slug}`}
                            className="font-bold text-sm text-neutral-950 hover:text-[#D4A017] line-clamp-1 block"
                          >
                            {prop.title}
                          </Link>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            {prop.locality}, {prop.city}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 pt-1">
                          <button
                            onClick={() => {
                              setActiveProperty(prop);
                              setEnquiryOpen(true);
                            }}
                            className="w-full py-1.5 px-3 bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 rounded-lg font-bold text-center transition-colors"
                          >
                            Enquire
                          </button>
                          <button
                            onClick={() => {
                              setActiveProperty(prop);
                              setVisitOpen(true);
                            }}
                            className="w-full py-1.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium text-center transition-colors"
                          >
                            Schedule Visit
                          </button>
                          <a
                            href={`https://wa.me/919326303244?text=${encodeURIComponent(`Hello, I am comparing "${prop.title}" (${formatIndianPrice(prop.price)}) on Prosify. Please share more details.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-center transition-colors flex items-center justify-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {/* Price */}
                <tr className="hover:bg-neutral-50/50">
                  <td className="p-4 font-semibold text-neutral-700 bg-neutral-50/30">Total Price</td>
                  {selectedProps.map((p) => (
                    <td key={p.id} className="p-4 font-extrabold text-base text-neutral-950">
                      {formatIndianPrice(p.price)}
                    </td>
                  ))}
                </tr>

                {/* Price per sqft */}
                <tr className="hover:bg-neutral-50/50">
                  <td className="p-4 font-semibold text-neutral-700 bg-neutral-50/30">Price / sq.ft</td>
                  {selectedProps.map((p) => (
                    <td key={p.id} className="p-4 text-neutral-800 font-medium">
                      ₹{p.pricePerSqft.toLocaleString('en-IN')}/sq.ft
                    </td>
                  ))}
                </tr>

                {/* BHK */}
                <tr className="hover:bg-neutral-50/50">
                  <td className="p-4 font-semibold text-neutral-700 bg-neutral-50/30">Configuration</td>
                  {selectedProps.map((p) => (
                    <td key={p.id} className="p-4 text-neutral-800 font-medium">
                      {p.bhk} ({p.propertyType})
                    </td>
                  ))}
                </tr>

                {/* Carpet Area */}
                <tr className="hover:bg-neutral-50/50">
                  <td className="p-4 font-semibold text-neutral-700 bg-neutral-50/30">Carpet Area</td>
                  {selectedProps.map((p) => (
                    <td key={p.id} className="p-4 text-neutral-800 font-bold">
                      {formatArea(p.carpetArea)}
                    </td>
                  ))}
                </tr>

                {/* Possession */}
                <tr className="hover:bg-neutral-50/50">
                  <td className="p-4 font-semibold text-neutral-700 bg-neutral-50/30">Possession</td>
                  {selectedProps.map((p) => (
                    <td key={p.id} className="p-4 text-neutral-800">
                      <span className="font-semibold block">
                        {p.possessionStatus.replace('_', ' ')}
                      </span>
                      <span className="text-neutral-500">{p.possessionDate || 'Immediate'}</span>
                    </td>
                  ))}
                </tr>

                {/* Developer */}
                <tr className="hover:bg-neutral-50/50">
                  <td className="p-4 font-semibold text-neutral-700 bg-neutral-50/30">Developer</td>
                  {selectedProps.map((p) => (
                    <td key={p.id} className="p-4 text-neutral-800 font-medium">
                      {p.developerName || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* MahaRERA */}
                <tr className="hover:bg-neutral-50/50">
                  <td className="p-4 font-semibold text-neutral-700 bg-neutral-50/30">MahaRERA Reg</td>
                  {selectedProps.map((p) => (
                    <td key={p.id} className="p-4 text-neutral-800">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {p.reraNumber || 'Verified'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Furnishing */}
                <tr className="hover:bg-neutral-50/50">
                  <td className="p-4 font-semibold text-neutral-700 bg-neutral-50/30">Furnishing</td>
                  {selectedProps.map((p) => (
                    <td key={p.id} className="p-4 text-neutral-800">
                      {p.furnishingStatus?.replace('_', ' ') || 'Unfurnished'}
                    </td>
                  ))}
                </tr>

                {/* Amenities Matrix */}
                {amenitiesList.map((amenity) => (
                  <tr key={amenity} className="hover:bg-neutral-50/50">
                    <td className="p-4 text-neutral-600 bg-neutral-50/30">{amenity}</td>
                    {selectedProps.map((p) => {
                      const hasAmenity = p.amenities?.some((a) =>
                        a.toLowerCase().includes(amenity.toLowerCase().split(' ')[0])
                      );
                      return (
                        <td key={p.id} className="p-4">
                          {hasAmenity ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-neutral-400">
                              <XCircle className="w-4 h-4 text-neutral-300" />
                              -
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        property={activeProperty}
      />

      <SiteVisitModal
        isOpen={visitOpen}
        onClose={() => setVisitOpen(false)}
        property={activeProperty}
      />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 p-8 text-center text-xs text-neutral-500">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
