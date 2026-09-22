'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  MapPin,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Phone,
  FileText,
  Layers,
  ChevronRight,
  ArrowRight,
  Download,
  MessageCircle,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { InventoryMatrix } from '@/components/inventory/InventoryMatrix';
import { EnquiryModal } from '@/components/marketplace/EnquiryModal';
import { SiteVisitModal } from '@/components/marketplace/SiteVisitModal';
import { store } from '@/lib/data/store';
import { formatIndianPrice } from '@/lib/utils';

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const project = useMemo(() => {
    return store.getProjectBySlug(slug) || store.getProjectById(slug);
  }, [slug]);

  const units = useMemo(() => {
    if (!project) return [];
    return store.getUnits(project.id);
  }, [project]);

  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'plans' | 'amenities' | 'location'>('inventory');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const projectImages = [
    project?.coverImage || project?.image,
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  ].filter(Boolean) as string[];

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-neutral-900">Project Not Found</h2>
          <Link
            href="/projects"
            className="inline-block px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold"
          >
            Back to Projects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Navbar onOpenEnquiry={() => setEnquiryOpen(true)} />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-neutral-500 overflow-x-auto">
            <Link href="/" className="hover:text-neutral-900">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <Link href="/projects" className="hover:text-neutral-900">Projects</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="text-neutral-900 font-semibold truncate">{project.name}</span>
          </nav>
        </div>
      </div>

      {/* Project Hero Header */}
      <div className="bg-[#171717] text-white py-10 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#D4A017] text-neutral-950">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  MahaRERA: {project.reraNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300">
                  {(project.constructionStatus || project.status || 'UNDER_CONSTRUCTION').replace('_', ' ')}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                {project.name}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#D4A017] shrink-0" />
                <span>{project.locality}, {project.city}</span>
                <span>•</span>
                <span>Developed by <strong>{project.developerName}</strong></span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-neutral-400 block">Starting Price</span>
                  <strong className="text-base font-bold text-[#F4C430]">
                    {formatIndianPrice(project.startingPrice || project.minPrice || 8500000)}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-neutral-400 block">Configurations</span>
                  <strong className="text-base font-bold text-white">
                    {project.configurations || '1, 2 & 3 BHK'}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-neutral-400 block">Possession</span>
                  <strong className="text-base font-bold text-white">
                    {project.possessionDate}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-neutral-400 block">Total Units</span>
                  <strong className="text-base font-bold text-white">
                    {project.totalUnits} Units ({(project.towers?.length || project.totalTowers || 1)} Towers)
                  </strong>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-3">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Enquire Direct with Builder</span>
              </button>

              <button
                onClick={() => setVisitOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Free Site Visit</span>
              </button>

              <a
                href={`https://wa.me/919326303244?text=${encodeURIComponent(`Hello, I am inquiring about "${project.name}" in ${project.locality}, ${project.city}. Please share unit availability and booking sheet.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => setEnquiryOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-neutral-300 text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Certified Brochure</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 overflow-x-auto">
          {[
            { key: 'inventory', label: 'Interactive Unit Matrix' },
            { key: 'plans', label: 'Floor Plans & Pricing' },
            { key: 'amenities', label: 'Amenities & Masterplan' },
            { key: 'location', label: 'Location & Connectivity' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
                activeTab === tab.key
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Interactive Floor-by-Floor Inventory Matrix */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <InventoryMatrix units={units} projectName={project.name} />
          </div>
        )}

        {/* Tab 2: Floor Plans */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(project.floorPlans || []).map((fp, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4 shadow-xs"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100">
                  <Image
                    src={fp.imageUrl || fp.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'}
                    alt={fp.title || fp.type || fp.bhk}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 bg-neutral-900 text-white rounded-md">
                    {fp.title || fp.type || fp.bhk}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <strong className="text-base font-bold text-neutral-950">{typeof fp.carpetArea === 'number' ? `${fp.carpetArea} sq.ft` : fp.carpetArea}</strong>
                    <span className="text-sm font-bold text-[#D4A017]">{fp.startingPrice || (fp.price ? formatIndianPrice(fp.price) : 'Price on Request')}</span>
                  </div>
                  <button
                    onClick={() => setEnquiryOpen(true)}
                    className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-[#D4A017] hover:text-neutral-950 text-white text-xs font-semibold transition-colors"
                  >
                    Request High-Res Plan PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Amenities */}
        {activeTab === 'amenities' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold text-neutral-950">Township Amenities & Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(project.amenities || []).map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs font-semibold text-neutral-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Location & Connectivity */}
        {activeTab === 'location' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-neutral-950">Strategic Location Advantages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(project.locationHighlights || [
                `Direct connectivity to prime ${project.locality} arterial roads & highways`,
                'Under 15 minutes to reputed CBSE & ICSE international schools',
                'Multi-specialty tertiary care hospitals within 10-minute emergency radius',
                'Upcoming metro corridor station and local transit within walkable distance'
              ]).map((hl, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100 text-xs"
                >
                  <MapPin className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <span className="text-neutral-800 font-medium">{hl}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        project={project}
      />

      <SiteVisitModal
        isOpen={visitOpen}
        onClose={() => setVisitOpen(false)}
        project={project}
      />
    </div>
  );
}
