import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, MapPin, ShieldCheck, ArrowRight, Home } from 'lucide-react';
import { Project } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const coverImg = project.coverImage || project.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
  const startPrice = project.startingPrice || project.minPrice || 8500000;
  const priceRange = project.priceRange || '₹85 L - ₹2.5 Cr';
  const configs = project.configurations || '1, 2 & 3 BHK';
  const available = project.availableUnits ?? 25;
  const rera = project.reraNumber || 'MahaRERA Registered';

  return (
    <div className="group bg-white/65 backdrop-blur-xl rounded-2xl border border-white/70 hover:border-amber-400/80 overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_16px_40px_0_rgba(212,160,23,0.18)] hover:bg-white/85 transition-all duration-300 flex flex-col justify-between ring-1 ring-black/[0.03]">
      <div>
        {/* Cover Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
          <Image
            src={coverImg}
            alt={project.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            referrerPolicy="no-referrer"
          />

          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#171717]/90 text-white backdrop-blur-xs">
              <ShieldCheck className="w-3 h-3 text-[#F4C430]" />
              RERA: {rera}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#D4A017] text-neutral-950 shadow-md">
              {available} Units Available
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Price Range */}
          <div>
            <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider block">
              Starting From
            </span>
            <span className="text-xl font-bold text-neutral-950">
              {formatIndianPrice(startPrice)}
            </span>
            <span className="text-xs text-neutral-500 ml-1.5 font-medium">
              ({priceRange})
            </span>
          </div>

          {/* Project Name & Developer */}
          <div>
            <Link
              href={`/projects/${project.slug}`}
              className="text-lg font-bold text-neutral-900 hover:text-[#D4A017] transition-colors line-clamp-1"
            >
              {project.name}
            </Link>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              By <span className="text-neutral-800 font-semibold">{project.developerName}</span>
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="line-clamp-1">{project.locality}, {project.city}</span>
          </div>

          {/* Configuration & Possession badge */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
            <div className="flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-[#D4A017]" />
              <span className="font-medium">{configs}</span>
            </div>
            <span className="text-neutral-500">Possession: {project.possessionDate}</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="p-5 pt-0">
        <Link
          href={`/projects/${project.slug}`}
          className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-[#D4A017] hover:text-neutral-950 text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 group/btn"
        >
          <span>Explore Masterplan & Units</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
