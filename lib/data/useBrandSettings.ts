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

const SETTINGS_STORAGE_KEY = 'prosify_dynamic_settings_v1';

const DEFAULT_BRAND_SETTINGS: BrandSettingsState = {
  agencyName: brandConfig.companyLegalName,
  whatsappNumber: '+91 91679 91679',
  whatsappLink: 'https://wa.me/919167991679',
  contactEmail: 'hello4home@gmail.com',
  supportEmail: 'hello4home@gmail.com',
  phone: '+91 91679 91679',
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

  useEffect(() => {
    // 1. Fetch live from server API
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          saveCachedBrandSettings(data.settings);
          setSettings(data.settings);
        }
      })
      .catch(() => {});

    // 2. Listen to real-time updates broadcast by Admin Panel
    const handleUpdate = () => {
      setSettings(getCachedBrandSettings());
    };

    window.addEventListener('prosify_settings_updated', handleUpdate);
    return () => window.removeEventListener('prosify_settings_updated', handleUpdate);
  }, []);

  return {
    ...settings,
    whatsappLink: settings.whatsappLink || 'https://wa.me/919167991679',
    whatsappNumber: settings.whatsappNumber || '+91 91679 91679',
    contactEmail: settings.contactEmail || 'hello4home@gmail.com',
    supportEmail: settings.supportEmail || 'hello4home@gmail.com',
  };
}
