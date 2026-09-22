import Link from 'next/link';
import { Home, Search, ArrowRight, Building2, MapPin, Compass } from 'lucide-react';
import { brandConfig } from '@/src/config/brand';
import { ProsifyLogo } from '@/components/brand/ProsifyLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between selection:bg-[#D4A017] selection:text-neutral-950">
      {/* Header Bar */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <ProsifyLogo variant="light" size="md" href="/" showTagline={true} />
          <Link
            href="/properties"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-[#D4A017] transition-all"
          >
            <Search className="w-3.5 h-3.5 text-[#D4A017]" />
            Browse Verified Listings
          </Link>
        </div>
      </header>

      {/* Main 404 Hero */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 flex flex-col items-center justify-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-[#F4C430] border border-amber-500/20">
          <Compass className="w-3.5 h-3.5" />
          <span>Listing Address Not Located</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl sm:text-9xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-neutral-100 to-neutral-700">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            The property or page you are looking for has moved
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
            The unit, developer catalog, or URL you requested may have been archived, sold out, or the link may have a typo.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4A017] text-neutral-950 font-bold text-sm hover:bg-[#F4C430] transition-colors shadow-lg shadow-amber-500/10"
          >
            <Home className="w-4 h-4" />
            Return to Homepage
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-semibold text-sm hover:bg-neutral-800 hover:border-neutral-600 transition-colors"
          >
            <Search className="w-4 h-4 text-[#D4A017]" />
            Search Properties
          </Link>
        </div>

        {/* Quick Nav Directory */}
        <div className="w-full pt-10 border-t border-neutral-800/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
            Popular Real Estate Hubs
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <Link
              href="/properties?city=Mumbai"
              className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/60 hover:border-[#D4A017]/40 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-300 group-hover:text-[#F4C430] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  Mumbai Luxury
                </span>
                <ArrowRight className="w-3 h-3 text-neutral-600 group-hover:text-[#F4C430] transition-colors" />
              </div>
            </Link>
            <Link
              href="/properties?city=Thane"
              className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/60 hover:border-[#D4A017]/40 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-300 group-hover:text-[#F4C430] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  Thane & MMR
                </span>
                <ArrowRight className="w-3 h-3 text-neutral-600 group-hover:text-[#F4C430] transition-colors" />
              </div>
            </Link>
            <Link
              href="/projects"
              className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/60 hover:border-[#D4A017]/40 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-300 group-hover:text-[#F4C430] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                  New Launches
                </span>
                <ArrowRight className="w-3 h-3 text-neutral-600 group-hover:text-[#F4C430] transition-colors" />
              </div>
            </Link>
            <Link
              href="/developers"
              className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/60 hover:border-[#D4A017]/40 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-300 group-hover:text-[#F4C430] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                  Tier-1 Builders
                </span>
                <ArrowRight className="w-3 h-3 text-neutral-600 group-hover:text-[#F4C430] transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-neutral-900 px-6 py-4 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} {brandConfig.name}. All rights reserved. {brandConfig.reraRegistration}.
      </footer>
    </div>
  );
}
