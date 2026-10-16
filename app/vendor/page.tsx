'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ProsifyAnimatedLogo } from '@/components/brand/ProsifyAnimatedLogo';

export default function VendorRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check session cookie
    const hasVendorCookie = document.cookie.includes('prosify_vendor_session=');
    if (hasVendorCookie) {
      router.replace('/vendor/dashboard');
    } else {
      router.replace('/vendor/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col items-center justify-center p-4">
      <ProsifyAnimatedLogo size="md" />
      <div className="flex items-center gap-2 mt-4 text-xs font-mono text-neutral-400">
        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
        <span>Verifying Vendor Session &amp; Routing...</span>
      </div>
    </div>
  );
}
