'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Home,
  Compass,
  Users,
  Briefcase,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  ClipboardEdit,
  ShieldCheck,
  LayoutDashboard,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { PropertyRequirementModal } from './PropertyRequirementModal';
import { useAuth } from '@/lib/auth/authContext';

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [requirementModalOpen, setRequirementModalOpen] = useState(false);

  const navLinks = [
    { name: 'Buy Properties', href: '/properties', icon: Home },
    { name: 'Projects', href: '/projects', icon: Compass },
    { name: 'Developers', href: '/developers', icon: Building2 },
    { name: 'Commercial', href: '/properties?type=COMMERCIAL', icon: Briefcase },
    { name: 'Partner Portal', href: '/partner', icon: Users },
    { name: 'Admin CRM', href: '/admin', icon: LayoutDashboard },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        {/* Top Mini Ticker Bar */}
        <div className="bg-neutral-950 text-white text-[11px] py-1.5 px-4 hidden sm:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[#D4A017] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                MahaRERA Registered Marketplace: A51900032901
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400">Zero Brokerage on Direct Developer Units</span>
            </div>
            <div className="flex items-center gap-4 text-neutral-300">
              <button
                type="button"
                onClick={() => setRequirementModalOpen(true)}
                className="hover:text-[#D4A017] transition-colors flex items-center gap-1 font-medium cursor-pointer"
              >
                <ClipboardEdit className="w-3 h-3 text-[#D4A017]" />
                Post Property Requirement
              </button>
              <span>•</span>
              <a href="tel:+912269824000" className="hover:text-[#D4A017] flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-[#D4A017]" />
                +91 22 6982 4000
              </a>
            </div>
          </div>
        </div>

        {/* Main Desktop Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-neutral-950 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-[#D4A017]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-neutral-950">
                PROSIFY<span className="text-[#D4A017]">.</span>
              </span>
              <span className="text-[9px] font-bold text-neutral-400 -mt-1 tracking-wider uppercase">
                Realty Marketplace
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setRequirementModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <ClipboardEdit className="w-3.5 h-3.5" />
              <span>Post Requirement</span>
            </button>
            <Link
              href="/admin"
              className="px-3 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold"
            >
              Admin CRM
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setRequirementModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#D4A017] text-neutral-950 font-bold text-[11px] flex items-center gap-1 shadow-xs"
            >
              <ClipboardEdit className="w-3 h-3" />
              <span>Require</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="p-2 rounded-xl text-neutral-700 hover:bg-neutral-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-950">Property Buying Desk</p>
                <p className="text-[11px] text-amber-800">Zero brokerage on direct-developer sales</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setRequirementModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#D4A017] text-neutral-950 text-xs font-bold"
              >
                Post Now
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 flex items-center gap-2 text-xs font-semibold text-neutral-800"
                  >
                    <Icon className="w-4 h-4 text-[#D4A017]" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>MahaRERA: A51900032901</span>
              <a href="tel:+912269824000" className="font-semibold text-neutral-900">
                Call Advisory
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Dock Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-3 py-2 flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/' ? 'text-[#D4A017]' : 'text-neutral-600'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <Link
          href="/properties"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/properties' ? 'text-[#D4A017]' : 'text-neutral-600'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Buy</span>
        </Link>
        <Link
          href="/projects"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/projects' ? 'text-[#D4A017]' : 'text-neutral-600'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Projects</span>
        </Link>
        <button
          type="button"
          onClick={() => setRequirementModalOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-[#D4A017]"
        >
          <ClipboardEdit className="w-4 h-4" />
          <span>Post Req</span>
        </button>
      </div>

      <PropertyRequirementModal
        isOpen={requirementModalOpen}
        onClose={() => setRequirementModalOpen(false)}
      />
    </>
  );
}
