'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AffiliateDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/affiliate');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 mx-auto border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Redirecting to Main Affiliate Partner Portal...</p>
      </div>
    </div>
  );
}
