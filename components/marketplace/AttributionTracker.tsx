'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import {
  PartnerAttribution,
  processUrlAttribution,
  getStoredAttribution,
  clearStoredAttribution,
} from '@/lib/attribution';
import { ShieldCheck, X, Sparkles } from 'lucide-react';

function AttributionTrackerInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [activeAttribution, setActiveAttribution] = useState<PartnerAttribution | null>(null);
  const [showBadge, setShowBadge] = useState(true);

  useEffect(() => {
    // Process current URL params
    const run = async () => {
      if (searchParams) {
        const result = await processUrlAttribution(searchParams, pathname || '/');
        if (result && result.partnerCode && result.partnerCode !== 'ORGANIC') {
          setActiveAttribution(result);
          return;
        }
      }
      // Check stored
      const stored = getStoredAttribution();
      if (stored && stored.partnerCode && stored.partnerCode !== 'ORGANIC') {
        setActiveAttribution(stored);
      }
    };
    run();

    const handleUpdate = (e: any) => {
      setActiveAttribution(e.detail);
    };
    window.addEventListener('prosify_attribution_updated', handleUpdate);
    window.addEventListener('swarna_attribution_updated', handleUpdate);
    return () => {
      window.removeEventListener('prosify_attribution_updated', handleUpdate);
      window.removeEventListener('swarna_attribution_updated', handleUpdate);
    };
  }, [searchParams, pathname]);

  if (!activeAttribution || !showBadge) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm animate-in slide-in-from-bottom-2 duration-300">
      <div className="bg-neutral-900/95 text-white border border-[#D4A017]/40 shadow-xl rounded-xl p-3 flex items-start gap-2.5 backdrop-blur-md">
        <div className="w-7 h-7 rounded-lg bg-[#D4A017]/20 border border-[#D4A017]/30 flex items-center justify-center text-[#F4C430] shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#F4C430]">Partner Referral Active</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
              {activeAttribution.partnerCode}
            </span>
          </div>
          <p className="text-neutral-300 text-[11px] truncate mt-0.5">
            {activeAttribution.partnerName || 'Authorized MahaRERA Channel Partner'}
          </p>
          {activeAttribution.utmCampaign && (
            <span className="text-[10px] text-neutral-400 block mt-0.5">
              Campaign: <span className="text-neutral-200">{activeAttribution.utmCampaign}</span>
            </span>
          )}
        </div>
        <button
          onClick={() => setShowBadge(false)}
          className="text-neutral-400 hover:text-white p-0.5 rounded"
          title="Dismiss badge"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function AttributionTracker() {
  return (
    <Suspense fallback={null}>
      <AttributionTrackerInner />
    </Suspense>
  );
}
