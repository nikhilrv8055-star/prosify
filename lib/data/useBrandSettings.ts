'use client';

import { useState, useEffect } from 'react';
import { brandConfig } from '@/src/config/brand';

export interface BrandSettingsState {
  agencyName: string;
  whatsappNumber: string;
  whatsappLink: string;
  contactEmail: string;
  supportEmail: string;
  phone: string;
  reraRegistration?: string;
  reraNumber?: string;
  companyLegalName?: string;
  logoUrl?: string;
  logoName?: string;
  updatedAt?: string;
}

const SETTINGS_STORAGE_KEY = 'prosify_dynamic_settings_v2';

const DEFAULT_BRAND_SETTINGS: BrandSettingsState = {
  agencyName: brandConfig.companyLegalName,
  whatsappNumber: '+91 93263 03244',
  whatsappLink: 'https://wa.me/919326303244',
  contactEmail: 'contact@prosify.in',
  supportEmail: 'support@prosify.in',
  phone: '+91 93263 03244',
  reraRegistration: brandConfig.reraRegistration,
  reraNumber: brandConfig.reraNumber,
  companyLegalName: brandConfig.companyLegalName,
  logoUrl: '',
  logoName: '',
};

export function getCachedBrandSettings(): BrandSettingsState {
  if (typeof window === 'undefined') return DEFAULT_BRAND_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_BRAND_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_BRAND_SETTINGS;
}

export function saveCachedBrandSettings(settings: BrandSettingsState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('prosify_settings_updated'));
  } catch {}
}

export function useBrandSettings() {
  const [settings, setSettings] = useState<BrandSettingsState>(() => getCachedBrandSettings());

  const fetchLiveSettings = () => {
    fetch('/api/admin/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          saveCachedBrandSettings(data.settings);
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    // 1. Fetch fresh from server API immediately on mount
    fetchLiveSettings();

    // 2. Listen to real-time updates broadcast by Admin Panel in current window
    const handleUpdate = () => {
      setSettings(getCachedBrandSettings());
    };

    // 3. Listen to cross-window / cross-tab updates
    const handleStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_STORAGE_KEY) {
        setSettings(getCachedBrandSettings());
      }
    };

    window.addEventListener('prosify_settings_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('prosify_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return {
    ...settings,
    whatsappLink: settings.whatsappLink || 'https://wa.me/919326303244',
    whatsappNumber: settings.whatsappNumber || '+91 93263 03244',
    contactEmail: settings.contactEmail || 'contact@prosify.in',
    supportEmail: settings.supportEmail || 'support@prosify.in',
  };
}
