'use client';

import React, { useEffect } from 'react';
import { AuthProvider } from '@/lib/auth/authContext';
import { ToastProvider } from '@/components/ui/toast';
import { AuthModal } from '@/components/auth/AuthModal';
import { AttributionTracker } from '@/components/marketplace/AttributionTracker';
import { FestivalThemeProvider } from '@/components/theme/FestivalThemeProvider';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const hideNextIndicator = () => {
      const targets = document.querySelectorAll('nextjs-portal, #next-build-watcher, [data-next-badge]');
      targets.forEach((node) => {
        const el = node as HTMLElement;
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      });
    };

    hideNextIndicator();
    const observer = new MutationObserver(hideNextIndicator);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <FestivalThemeProvider>
          {children}
          <AuthModal />
          <AttributionTracker />
        </FestivalThemeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
