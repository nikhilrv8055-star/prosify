'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, LifeBuoy } from 'lucide-react';
import { brandConfig } from '@/src/config/brand';
import { ProsifyLogo } from '@/components/brand/ProsifyLogo';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log fatal runtime errors for audit and telemetry
    console.error('Application runtime exception caught by root error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between selection:bg-[#D4A017] selection:text-neutral-950">
      {/* Top Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <ProsifyLogo variant="light" size="md" href="/" showTagline={true} />
        </div>
      </header>

      {/* Center Card */}
      <main className="flex-1 max-w-xl mx-auto px-6 py-16 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            System Encountered an Unexpected Error
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            We encountered a temporary issue while loading this page. Our team has been notified, and your session data remains secure.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-neutral-500 bg-neutral-900 py-1.5 px-3 rounded-lg border border-neutral-800 inline-block">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4A017] text-neutral-950 font-bold text-sm hover:bg-[#F4C430] transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Application
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 font-semibold text-sm hover:bg-neutral-800 transition-colors"
          >
            <Home className="w-4 h-4 text-[#D4A017]" />
            Return Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-neutral-400 font-medium text-xs hover:text-white transition-colors"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-neutral-500" />
            Support Desk
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 px-6 py-4 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} {brandConfig.name}. All rights reserved.
      </footer>
    </div>
  );
}
