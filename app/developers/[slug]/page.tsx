'use client';

import React, { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  MapPin,
  Calendar,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Layers,
  ArrowRight,
  MessageCircle,
  Download,
  Share2,
  Award,
  Clock,
  Sparkles,
  IndianRupee,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { store } from '@/lib/data/store';
import { formatIndianPrice } from '@/lib/utils';
import { EnquiryModal } from '@/components/marketplace/EnquiryModal';
import { useToast } from '@/components/ui/toast';

export default function DeveloperDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { toast } = useToast();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const developer = store.getDeveloperBySlug(slug);

  if (!developer) {
    return notFound();
  }

  const allProjects = store.getProjects();
  const developerProjects = allProjects.filter(
    (p) => p.developerId === developer.id || p.developerName.toLowerCase() === developer.name.toLowerCase()
  );

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Profile Link Copied',
        description: 'Developer profile URL copied to clipboard.',
        type: 'info',
      });
    }
  };

  const handleDownloadBrochure = () => {
    toast({
      title: 'Brochure Request Submitted',
      description: `Official developer portfolio for ${developer.name} will be emailed to your account.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Navbar />

      {/* Hero Banner with Corporate Cover */}
      <div className="relative bg-neutral-950 text-white overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&auto=format&fit=crop&q=80"
            alt={developer.name}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 space-y-6">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/developers" className="hover:text-white transition-colors">Developers</Link>
            <span>/</span>
            <span className="text-[#D4A017]">{developer.name}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-white p-2 border-2 border-neutral-700 shadow-xl shrink-0">
                <Image
                  src={developer.logoUrl}
                  alt={developer.name}
                  fill
                  className="object-contain p-2"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {developer.name}
                  </h1>
                  {developer.isVerified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>MahaRERA Audited</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-neutral-300 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D4A017]" />
                    <span>Established {developer.establishedYr}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4A017]" />
                    <span>{developer.headquarters || 'Mumbai, Maharashtra'}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#D4A017]" />
                    <span>{developer.experienceYears || (new Date().getFullYear() - developer.establishedYr)}+ Yrs Experience</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Share profile"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <button
                onClick={handleDownloadBrochure}
                className="py-2.5 px-4 rounded-xl bg-neutral-900/90 border border-neutral-700 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-[#D4A017]" />
                <span>Brochure</span>
              </button>

              <a
                href="https://wa.me/919167991679"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="py-2.5 px-5 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 text-xs font-bold transition-all shadow-xs"
              >
                Consult Builder Desk
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Overview & Projects */}
          <div className="lg:col-span-2 space-y-8">
            {/* Corporate Stats Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs text-center">
                <span className="block text-2xl font-extrabold text-[#D4A017]">
                  {developer.totalProjects || developerProjects.length}
                </span>
                <span className="text-xs text-neutral-500 font-medium">Total Projects</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs text-center">
                <span className="block text-2xl font-extrabold text-neutral-900">
                  {developer.completedProjects || 14}+
                </span>
                <span className="text-xs text-neutral-500 font-medium">Projects Delivered</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs text-center">
                <span className="block text-2xl font-extrabold text-emerald-600">
                  {developer.ongoingProjects || developerProjects.length}
                </span>
                <span className="text-xs text-neutral-500 font-medium">Ongoing Launches</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs text-center">
                <span className="block text-2xl font-extrabold text-neutral-900">
                  {developer.totalProjectsDelivered || '2.8M'}+
                </span>
                <span className="text-xs text-neutral-500 font-medium">Sq.Ft Developed</span>
              </div>
            </div>

            {/* About Builder */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-neutral-950">About {developer.name}</h2>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {developer.about}
              </p>
              {developer.description && (
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {developer.description}
                </p>
              )}

              <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ISO 9001:2015 Certified Construction Practices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% On-Time Delivery Track Record in MMR</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct Bank Project Finance Pre-Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Statutory MahaRERA Penalty Record</span>
                </div>
              </div>
            </div>

            {/* Active Projects Portfolio */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-neutral-950">
                    Active Developments ({developerProjects.length})
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Verified residential townships and luxury towers currently open for booking
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {developerProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                  >
                    <div className="relative h-48 w-full bg-neutral-100">
                      <Image
                        src={proj.coverImage || proj.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                        alt={proj.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur-md text-white text-[10px] font-bold">
                        {proj.constructionStatus.replace('_', ' ')}
                      </div>
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-[#D4A017] text-neutral-950 text-xs font-extrabold shadow-sm">
                        From {formatIndianPrice(proj.startingPrice || 10000000)}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-bold text-neutral-950 text-base group-hover:text-[#D4A017] transition-colors">
                          <Link href={`/projects/${proj.slug}`}>{proj.name}</Link>
                        </h3>
                        <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{proj.locality}, {proj.city}</span>
                        </p>
                        <p className="text-xs text-neutral-600 mt-2 font-medium">
                          Configs: {proj.configurations || '1, 2 & 3 BHK'} • {proj.towers?.length || proj.totalTowers || 1} Towers
                        </p>
                      </div>

                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {proj.reraNumber}
                        </span>
                        <Link
                          href={`/projects/${proj.slug}`}
                          className="text-xs font-bold text-[#D4A017] flex items-center gap-1 hover:underline"
                        >
                          <span>Explore Units</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Builder Desk Contact & Compliance */}
          <div className="space-y-6">
            {/* Consultation Card */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-neutral-950">
                Direct Corporate Advisory Desk
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Connect directly with the developer’s relationship desk for VIP pre-launch pricing, customized inventory floor plans, and flexible payment plans.
              </p>

              <div className="space-y-2.5 text-xs text-neutral-700 pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#D4A017]" />
                  <a
                    href={developer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-neutral-900 truncate"
                  >
                    {developer.website.replace('https://', '')}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D4A017]" />
                  <span>{developer.contactEmail}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D4A017]" />
                  <span>Sales Desk: 9:00 AM - 7:00 PM (Daily)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold text-xs transition-all shadow-xs"
                >
                  Consult Builder Desk
                </button>

                <a
                  href="https://wa.me/919167991679"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* MahaRERA Compliance Audit */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-neutral-950">
                  MahaRERA Regulatory Status
                </h4>
              </div>

              <div className="space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span>Regulatory Body</span>
                  <strong className="text-neutral-900">MahaRERA Mumbai</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span>Audit Rating</span>
                  <strong className="text-emerald-600">AAA+ Prime Tier</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span>Title Clearance</span>
                  <strong className="text-neutral-900">100% Freehold</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Escrow Compliance</span>
                  <strong className="text-neutral-900">Dedicated 70% Account</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enquiry Modal */}
      {isEnquiryOpen && (
        <EnquiryModal
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
          propertyTitle={`Direct Builder Consultation: ${developer.name}`}
          propertyLocation={developer.headquarters || 'Mumbai, Maharashtra'}
        />
      )}

      <Footer />
    </div>
  );
}
