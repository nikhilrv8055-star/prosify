'use client';

import React, { useState, useEffect } from 'react';
import { PropertyRequirementModal } from './PropertyRequirementModal';
import { ClipboardEdit, Sparkles, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function RequirementPopupWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<{
    defaultLocation?: string;
    defaultPropertyType?: string;
    defaultBudget?: string;
    defaultBhk?: string;
  }>({});
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const pathname = usePathname();

  // Listen to custom 'open-requirement-modal' events anywhere in the app
  useEffect(() => {
    const handleOpenEvent = (event: CustomEvent) => {
      if (event.detail) {
        setModalProps({
          defaultLocation: event.detail.location || '',
          defaultPropertyType: event.detail.propertyType || 'Apartment / Flat',
          defaultBudget: event.detail.budget || '₹75 Lakh - ₹1.2 Cr',
          defaultBhk: event.detail.bhk || '2 BHK',
        });
      }
      setIsOpen(true);
    };

    window.addEventListener('open-requirement-modal' as any, handleOpenEvent as EventListener);
    return () => {
      window.removeEventListener('open-requirement-modal' as any, handleOpenEvent as EventListener);
    };
  }, []);

  // Smart Auto-popup trigger:
  // If the user visits the homepage or properties page and stays for 9 seconds without opening,
  // show the requirement popup once per session/day to capture requirements.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Do not auto-pop on admin or partner internal dashboard pages
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/partner') || pathname?.startsWith('/developer') || pathname?.startsWith('/login') || pathname?.startsWith('/post-requirement')) {
      return;
    }

    const dismissedKey = 'prosify_requirement_popup_seen';
    const lastSeen = localStorage.getItem(dismissedKey);
    const now = Date.now();

    // Only auto-open if never seen or last seen > 24 hours ago
    if (!lastSeen || now - parseInt(lastSeen, 10) > 24 * 60 * 60 * 1000) {
      const timer = setTimeout(() => {
        if (!hasAutoOpened && !isOpen) {
          setIsOpen(true);
          setHasAutoOpened(true);
          localStorage.setItem(dismissedKey, now.toString());
        }
      }, 9000); // 9 seconds

      return () => clearTimeout(timer);
    }
  }, [pathname, hasAutoOpened, isOpen]);

  // Hide floating CTA button on full-page post-requirement page to avoid redundancy
  if (pathname === '/post-requirement' || pathname === '/requirement' || pathname?.startsWith('/admin')) {
    return (
      <PropertyRequirementModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        {...modalProps}
      />
    );
  }

  return (
    <>
      {/* Floating Action Button (FAB) / Pill Widget on bottom-right of screen */}
      {showFloatingButton && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-900 text-white shadow-[0_8px_25px_rgba(0,0,0,0.35)] border border-[#D4A017]/40 hover:border-[#D4A017] transition-all duration-200 active:scale-95 cursor-pointer"
            title="Tell Us Your Requirement (अपनी ज़रूरत बताएं)"
            aria-label="Post Property Requirement"
          >
            {/* Pulsing indicator */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4A017]" />
            </span>

            <ClipboardEdit className="w-4 h-4 text-[#F4C430] group-hover:scale-110 transition-transform" />

            <div className="flex flex-col text-left">
              <span className="text-[12px] font-extrabold tracking-tight text-white flex items-center gap-1">
                Post Requirement
                <Sparkles className="w-3 h-3 text-[#D4A017]" />
              </span>
              <span className="text-[9px] text-neutral-300 font-medium hidden sm:inline">
                अपनी ज़रूरत भेजें • 0 Brokerage
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Main Requirement Popup Modal */}
      <PropertyRequirementModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        {...modalProps}
      />
    </>
  );
}

// Global helper to easily trigger the popup form from any button or component
export function openRequirementModal(detail?: {
  location?: string;
  propertyType?: string;
  budget?: string;
  bhk?: string;
}) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('open-requirement-modal', {
        detail: detail || {},
      })
    );
  }
}
