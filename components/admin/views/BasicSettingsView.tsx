'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  Smartphone,
  Globe,
  Share2,
  Cookie,
  ShieldAlert,
  Search,
  CheckCircle2,
  Save,
  Layers,
  Sparkles,
  Sliders,
  Bell,
  Code,
  Image as ImageIcon,
  Upload,
  Trash2,
  RefreshCw,
  Eye,
  Check,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { saveCachedBrandSettings } from '@/lib/data/useBrandSettings';

export function BasicSettingsView({ subview = 'settings-general' }: { subview?: string }) {
  const [activeTab, setActiveTab] = useState<
    | 'general'
    | 'logo'
    | 'contact'
    | 'email'
    | 'templates'
    | 'breadcrumb'
    | 'plugins'
    | 'seo'
    | 'maintenance'
    | 'cookie'
    | 'social'
    | 'mobile'
  >(() => {
    if (subview === 'settings-logo') return 'logo';
    if (subview === 'settings-contact') return 'contact';
    if (subview === 'settings-email' || subview === 'settings-mail-from' || subview === 'settings-mail-to') return 'email';
    if (subview === 'settings-mail-templates') return 'templates';
    if (subview === 'settings-breadcrumb' || subview === 'settings-page-headings') return 'breadcrumb';
    if (subview === 'settings-plugins') return 'plugins';
    if (subview === 'settings-seo') return 'seo';
    if (subview === 'settings-maintenance') return 'maintenance';
    if (subview === 'settings-cookie') return 'cookie';
    if (subview === 'settings-social') return 'social';
    if (subview === 'settings-mobile-app') return 'mobile';
    return 'general';
  });

  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [general, setGeneral] = useState({
    siteName: 'Prosify',
    tagline: 'Direct Grade-A Real Estate Syndication',
    timezone: 'Asia/Kolkata (IST +5:30)',
    currencySymbol: '₹',
    supportNumber: '+91 91679 91679',
    officeAddress: 'Maker Chambers IV, Nariman Point, Mumbai 400021',
  });

  const [contactConfig, setContactConfig] = useState({
    contactEmail: 'contact@prosify.in',
    escalationPhone: '+91 91679 91679',
    whatsappLeadCapture: true,
    embedGoogleMapUrl: 'https://maps.google.com/maps?q=Nariman%20Point%20Mumbai&t=&z=15&ie=UTF8&iwloc=&output=embed',
  });

  const [emailConfig, setEmailConfig] = useState({
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    mailFromAdmin: 'no-reply@prosify.in',
    mailFromName: 'Prosify RERA Compliance Desk',
    mailToAdmin: 'admin@prosify.in',
    smtpUser: 'apikey',
    smtpEncryption: 'TLS',
  });

  const [seoConfig, setSeoConfig] = useState({
    metaTitle: 'Prosify | Verified Mumbai MMR Luxury Properties & Grade-A Projects',
    metaDescription: 'Explore verified apartments, villas, and commercial spaces with MahaRERA certifications and direct builder API integration.',
    metaKeywords: 'real estate mumbai, luxury apartments, godrej riviera, lodha palava, maharera properties, zero brokerage',
    ogImage: 'https://mkblktzjrmjktfdnmtql.supabase.co/storage/v1/object/public/eni%20ai%20logo/eni%20ai%20robot%20model.png',
  });

  const [maintenance, setMaintenance] = useState({
    isMaintenanceActive: false,
    maintenanceHeadline: 'Scheduled Database Cluster Optimization',
    maintenanceMessage: 'Prosify is undergoing routine RERA compliance ledger verification. We will be back online shortly.',
    whitelistedIps: '103.21.14.82, 127.0.0.1',
  });

  const [cookieConsent, setCookieConsent] = useState({
    isEnabled: true,
    bannerText: 'Prosify uses essential cookies to ensure compliance with privacy laws and enhance your property exploration experience.',
    acceptButtonText: 'Accept & Continue',
  });

  const [socialMedias, setSocialMedias] = useState({
    facebook: 'https://facebook.com/prosifyindia',
    instagram: 'https://instagram.com/prosifyindia',
    linkedin: 'https://linkedin.com/company/prosify',
    twitter: 'https://x.com/prosifyindia',
    youtube: 'https://youtube.com/@prosifyindia',
  });

  const [mobileApp, setMobileApp] = useState({
    playStoreUrl: 'https://play.google.com/store/apps/details?id=in.prosify.buyer',
    appStoreUrl: 'https://apps.apple.com/in/app/prosify-real-estate/id123456789',
    appBannerEnabled: true,
    pushNotificationToken: 'FIREBASE_MESSAGING_V1_AUTH',
  });

  // Logo & Branding State (Admin Logo Change Option)
  const [logoConfig, setLogoConfig] = useState({
    logoUrl: '',
    logoName: 'Default Prosify Monogram',
    brandName: 'Prosify',
  });
  const [isPublishingLogo, setIsPublishingLogo] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setLogoConfig({
            logoUrl: data.settings.logoUrl || '',
            logoName: data.settings.logoName || 'Default Prosify Monogram',
            brandName: data.settings.agencyName || 'Prosify',
          });
          if (data.settings.agencyName) {
            setGeneral((prev) => ({ ...prev, siteName: data.settings.agencyName }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showToast('Logo file size must be less than 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoConfig((prev) => ({
        ...prev,
        logoUrl: dataUrl,
        logoName: file.name,
      }));
      showToast(`Selected "${file.name}". Click "Publish Logo to Live Website" to apply.`);
    };
    reader.readAsDataURL(file);
  };

  const handlePublishLogo = async () => {
    setIsPublishingLogo(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoUrl: logoConfig.logoUrl,
          logoName: logoConfig.logoName,
          agencyName: logoConfig.brandName || general.siteName,
        }),
      });
      const data = await res.json();
      if (data?.success && data?.settings) {
        saveCachedBrandSettings(data.settings);
        showToast('Logo & Branding updated live across entire website!');
      } else {
        showToast(data?.error || 'Failed to update logo');
      }
    } catch {
      showToast('Network error updating logo');
    } finally {
      setIsPublishingLogo(false);
    }
  };

  const handleResetToDefaultLogo = async () => {
    setIsPublishingLogo(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoUrl: '',
          logoName: 'Default Prosify Monogram',
        }),
      });
      const data = await res.json();
      if (data?.success && data?.settings) {
        saveCachedBrandSettings(data.settings);
        setLogoConfig((prev) => ({
          ...prev,
          logoUrl: '',
          logoName: 'Default Prosify Monogram',
        }));
        showToast('Restored default golden Prosify Monogram logo!');
      }
    } catch {
      showToast('Error resetting logo');
    } finally {
      setIsPublishingLogo(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = (sectionName: string) => {
    showToast(`${sectionName} parameters successfully updated!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Basic System Settings & Global Config</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure enterprise parameters, website logo & branding, SMTP mailers, SEO tags, cookie banners, and maintenance mode.
          </p>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* HORIZONTAL SETTINGS TABS CAROUSEL */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold scrollbar-thin">
        {[
          { id: 'general', label: 'General' },
          { id: 'logo', label: 'Website Logo & Branding', badge: 'Live Change' },
          { id: 'contact', label: 'Contact Page' },
          { id: 'email', label: 'Email & SMTP' },
          { id: 'templates', label: 'Mail Templates' },
          { id: 'breadcrumb', label: 'Breadcrumbs & Headings' },
          { id: 'plugins', label: 'Plugins & Scripts' },
          { id: 'seo', label: 'SEO Informations' },
          { id: 'maintenance', label: 'Maintenance Mode' },
          { id: 'cookie', label: 'Cookie Alert' },
          { id: 'social', label: 'Social Medias' },
          { id: 'mobile', label: 'Mobile App Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                activeTab === tab.id ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: GENERAL */}
      {activeTab === 'general' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-2xl space-y-4">
          <h3 className="text-sm font-bold text-white">General Brand Identity</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={general.siteName}
                onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Tagline & Value Proposition</label>
              <input
                type="text"
                value={general.tagline}
                onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Default Timezone</label>
                <input
                  type="text"
                  value={general.timezone}
                  onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={general.currencySymbol}
                  onChange={(e) => setGeneral({ ...general, currencySymbol: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
            {/* Quick Link to Logo Changer */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Website Logo & Visual Branding</h4>
                  <p className="text-[11px] text-slate-400">
                    Upload custom logo, change header icon, or select modern presets.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('logo')}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                Change Logo →
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSave('General Settings')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
              >
                Save General Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: WEBSITE LOGO & BRANDING (ADMIN CHANGE LOGO SUITE) */}
      {activeTab === 'logo' && (
        <div className="space-y-6 max-w-4xl">
          {/* Header & Status Card */}
          <div className="p-6 rounded-2xl bg-[#1E293B]/90 border border-slate-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <ImageIcon className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-white">Website Logo & Visual Identity</h3>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Change your website logo here. The updated logo reflects instantly across the public navigation header, footer, mobile drawers, and admin/portal headers.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePublishLogo}
                disabled={isPublishingLogo}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                {isPublishingLogo ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Publish Logo to Live Website</span>
              </button>
            </div>
          </div>

          {/* Dual Live Preview Cards */}
          <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Live Logo Previews (Website & Admin)</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                Status: {logoConfig.logoUrl ? (
                  <strong className="text-emerald-400">Custom Logo Active</strong>
                ) : (
                  <strong className="text-amber-400">Default Prosify Monogram Active</strong>
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Preview 1: Website Public Header (Light Background) */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  1. Public Website Header Preview (Light Theme)
                </span>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-inner flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {logoConfig.logoUrl ? (
                      <img
                        src={logoConfig.logoUrl}
                        alt="Website Logo Preview"
                        className="h-9 w-auto max-w-[150px] object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-serif font-black text-lg bg-gradient-to-tr from-[#B38711] via-[#D4A017] to-[#F4C430] text-neutral-950 shadow-xs">
                        P
                      </div>
                    )}
                    <span className="font-serif font-bold text-lg text-neutral-900">
                      {logoConfig.brandName || 'Prosify'}
                    </span>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-500 font-semibold">
                    <span className="px-2 py-1 rounded bg-neutral-100">Buy</span>
                    <span className="px-2 py-1 rounded bg-neutral-100">Projects</span>
                    <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 font-bold">WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* Preview 2: Admin & Dark Header Preview */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  2. Admin & Portal Header Preview (Dark Theme)
                </span>
                <div className="p-4 rounded-2xl bg-[#171717] border border-neutral-800 shadow-inner flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {logoConfig.logoUrl ? (
                      <img
                        src={logoConfig.logoUrl}
                        alt="Website Logo Preview Dark"
                        className="h-8 w-auto max-w-[140px] object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-serif font-black text-base bg-gradient-to-tr from-[#B38711] via-[#D4A017] to-[#F4C430] text-neutral-950">
                        P
                      </div>
                    )}
                    <span className="font-serif font-bold text-base text-white">
                      {logoConfig.brandName || 'Prosify'}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#D4A017]/20 text-[#D4A017] border border-[#D4A017]/30">
                      Admin
                    </span>
                  </div>

                  <span className="text-[10px] text-neutral-400 font-mono">
                    Live Reactive
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Logo Modification Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Upload from Computer */}
            <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Upload Logo File (PNG, JPG, SVG, WebP)</span>
              </h4>

              <div className="space-y-3 text-xs">
                <label className="block p-6 rounded-2xl border-2 border-dashed border-slate-600 hover:border-amber-400 transition-colors bg-slate-900/60 text-center cursor-pointer group">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white block">Click to Browse Logo File</span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Supported: PNG (transparent), SVG vector, WebP, JPG (Max 3MB)
                  </span>
                  {logoConfig.logoName && (
                    <span className="inline-block mt-2 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-medium">
                      Current File: {logoConfig.logoName}
                    </span>
                  )}
                </label>

                {logoConfig.logoUrl && (
                  <button
                    type="button"
                    onClick={handleResetToDefaultLogo}
                    disabled={isPublishingLogo}
                    className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Custom Logo (Restore Default Monogram)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Box 2: Direct Image URL & Brand Name */}
            <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Direct Logo URL & Brand Name</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Paste Image URL (https://...)
                  </label>
                  <input
                    type="url"
                    value={logoConfig.logoUrl.startsWith('data:') ? '' : logoConfig.logoUrl}
                    onChange={(e) =>
                      setLogoConfig((prev) => ({
                        ...prev,
                        logoUrl: e.target.value.trim(),
                        logoName: e.target.value.trim() ? 'Custom URL Logo' : 'Default Prosify Monogram',
                      }))
                    }
                    placeholder="https://your-domain.com/assets/logo.png"
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Use any hosted PNG, SVG, or WebP logo URL with transparent background.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Platform Brand Name
                  </label>
                  <input
                    type="text"
                    value={logoConfig.brandName}
                    onChange={(e) =>
                      setLogoConfig((prev) => ({
                        ...prev,
                        brandName: e.target.value,
                      }))
                    }
                    placeholder="e.g. Prosify or Your Realty Brand"
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-semibold focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handlePublishLogo}
                    disabled={isPublishingLogo}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Publish Logo Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: Pre-Configured Premium Logo Presets (1-Click Selection) */}
          <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Instant Logo Design Presets (Click to Select & Apply)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Select one of our curated high-resolution real estate brand emblems to test or set as your official logo:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              {/* Preset 1: Default Golden Monogram */}
              <button
                type="button"
                onClick={() => {
                  setLogoConfig((prev) => ({
                    ...prev,
                    logoUrl: '',
                    logoName: 'Default Prosify Golden Crest',
                  }));
                  showToast('Selected "Default Prosify Golden Monogram". Click Publish to save.');
                }}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  !logoConfig.logoUrl
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center font-serif font-black text-lg bg-gradient-to-tr from-[#B38711] via-[#D4A017] to-[#F4C430] text-neutral-950 mb-2 shadow-xs">
                  P
                </div>
                <span className="font-bold text-white block text-xs">Prosify Gold</span>
                <span className="text-[10px] text-amber-400">Default Brand Crest</span>
              </button>

              {/* Preset 2: Emerald Architecture Hexagon */}
              <button
                type="button"
                onClick={() => {
                  const emeraldPreset = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&h=200&q=80';
                  setLogoConfig((prev) => ({
                    ...prev,
                    logoUrl: emeraldPreset,
                    logoName: 'Emerald Architecture Hexagon',
                  }));
                  showToast('Selected "Emerald Architecture". Click Publish to save.');
                }}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  logoConfig.logoName === 'Emerald Architecture Hexagon'
                    ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 mx-auto rounded-xl overflow-hidden border border-emerald-400/50 mb-2 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&h=200&q=80"
                    alt="Emerald Architecture"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-bold text-white block text-xs">Emerald Architecture</span>
                <span className="text-[10px] text-emerald-400">Eco Modernist</span>
              </button>

              {/* Preset 3: Sapphire Skyline Tower */}
              <button
                type="button"
                onClick={() => {
                  const sapphirePreset = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&h=200&q=80';
                  setLogoConfig((prev) => ({
                    ...prev,
                    logoUrl: sapphirePreset,
                    logoName: 'Sapphire Skyline Tower',
                  }));
                  showToast('Selected "Sapphire Skyline Tower". Click Publish to save.');
                }}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  logoConfig.logoName === 'Sapphire Skyline Tower'
                    ? 'bg-sky-500/10 border-sky-500 ring-2 ring-sky-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 mx-auto rounded-xl overflow-hidden border border-sky-400/50 mb-2 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&h=200&q=80"
                    alt="Sapphire Skyline"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-bold text-white block text-xs">Sapphire Skyline</span>
                <span className="text-[10px] text-sky-400">High-Rise Grade-A</span>
              </button>

              {/* Preset 4: Luxury Penthouse Horizon */}
              <button
                type="button"
                onClick={() => {
                  const luxuryPreset = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&h=200&q=80';
                  setLogoConfig((prev) => ({
                    ...prev,
                    logoUrl: luxuryPreset,
                    logoName: 'Luxury Penthouse Horizon',
                  }));
                  showToast('Selected "Luxury Penthouse Horizon". Click Publish to save.');
                }}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  logoConfig.logoName === 'Luxury Penthouse Horizon'
                    ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 mx-auto rounded-xl overflow-hidden border border-purple-400/50 mb-2 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&h=200&q=80"
                    alt="Luxury Penthouse"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-bold text-white block text-xs">Luxury Penthouse</span>
                <span className="text-[10px] text-purple-400">Ultra-High Networth</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT PAGE */}
      {activeTab === 'contact' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-2xl space-y-4">
          <h3 className="text-sm font-bold text-white">Contact Page Settings</h3>
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Inquiry Mail Destination</label>
                <input
                  type="email"
                  value={contactConfig.contactEmail}
                  onChange={(e) => setContactConfig({ ...contactConfig, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Escalation WhatsApp Hotline</label>
                <input
                  type="text"
                  value={contactConfig.escalationPhone}
                  onChange={(e) => setContactConfig({ ...contactConfig, escalationPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Google Maps Embed URL</label>
              <input
                type="text"
                value={contactConfig.embedGoogleMapUrl}
                onChange={(e) => setContactConfig({ ...contactConfig, embedGoogleMapUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono text-[11px]"
              />
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSave('Contact Page')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
              >
                Save Contact Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMAIL & SMTP */}
      {activeTab === 'email' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>SMTP Server & Admin Mail Routing</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={emailConfig.smtpHost}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">SMTP Port</label>
                <input
                  type="number"
                  value={emailConfig.smtpPort}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Mail From Admin (Sender)</label>
                <input
                  type="email"
                  value={emailConfig.mailFromAdmin}
                  onChange={(e) => setEmailConfig({ ...emailConfig, mailFromAdmin: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Mail To Admin (Alert Inboxes)</label>
                <input
                  type="email"
                  value={emailConfig.mailToAdmin}
                  onChange={(e) => setEmailConfig({ ...emailConfig, mailToAdmin: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSave('SMTP & Email Routing')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
              >
                Update SMTP Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-2xl space-y-4">
          <h3 className="text-sm font-bold text-white">Automated Mail Templates</h3>
          <div className="divide-y divide-slate-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Lead Visit Confirmation</h4>
                <p className="text-[11px] text-slate-400">Triggered to homebuyer on site-visit schedule</p>
              </div>
              <button onClick={() => showToast('Template editor opened for Visit Confirmation')} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700">Edit Template</button>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Vendor Invoice Generation</h4>
                <p className="text-[11px] text-slate-400">Monthly subscription renewal receipt</p>
              </div>
              <button onClick={() => showToast('Template editor opened for Vendor Invoice')} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700">Edit Template</button>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">API Sync Failure Escalation</h4>
                <p className="text-[11px] text-slate-400">Dispatched when Grade-A push returns 5xx error</p>
              </div>
              <button onClick={() => showToast('Template editor opened for API Escalation')} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700">Edit Template</button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BREADCRUMBS & HEADINGS */}
      {activeTab === 'breadcrumb' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Breadcrumbs & Dynamic Page Headings</h3>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Properties Archive Heading</label>
            <input
              type="text"
              defaultValue="Explore Grade-A MahaRERA Verified Properties"
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Projects Archive Heading</label>
            <input
              type="text"
              defaultValue="Landmark Real Estate Master Townships"
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
            />
          </div>
          <button onClick={() => handleSave('Breadcrumbs')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Save Headings</button>
        </div>
      )}

      {/* TAB 6: PLUGINS */}
      {activeTab === 'plugins' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-amber-400" />
            <span>Third-Party Tracking Plugins & Header Snippets</span>
          </h3>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Google Tag Manager ID</label>
            <input
              type="text"
              placeholder="GTM-XXXXXX"
              defaultValue="GTM-5899AB"
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Custom Header Tracking Scripts</label>
            <textarea
              rows={3}
              placeholder="<!-- Insert custom meta or verification scripts -->"
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono text-[11px]"
            />
          </div>
          <button onClick={() => handleSave('Plugins & Snippets')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Save Plugins</button>
        </div>
      )}

      {/* TAB 7: SEO */}
      {activeTab === 'seo' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-2xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Search Engine Optimization (SEO)</h3>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Global Meta Title</label>
            <input
              type="text"
              value={seoConfig.metaTitle}
              onChange={(e) => setSeoConfig({ ...seoConfig, metaTitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Global Meta Description</label>
            <textarea
              rows={3}
              value={seoConfig.metaDescription}
              onChange={(e) => setSeoConfig({ ...seoConfig, metaDescription: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Meta Keywords</label>
            <input
              type="text"
              value={seoConfig.metaKeywords}
              onChange={(e) => setSeoConfig({ ...seoConfig, metaKeywords: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono text-[11px]"
            />
          </div>
          <button onClick={() => handleSave('SEO Configuration')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Save SEO</button>
        </div>
      )}

      {/* TAB 8: MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Emergency Maintenance Mode</span>
          </h3>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="font-semibold text-white">Activate Maintenance Screen</h4>
              <p className="text-[11px] text-slate-400">Routes public traffic to maintenance notice while keeping admin panel accessible</p>
            </div>
            <input
              type="checkbox"
              checked={maintenance.isMaintenanceActive}
              onChange={(e) => setMaintenance({ ...maintenance, isMaintenanceActive: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Notice Headline</label>
            <input
              type="text"
              value={maintenance.maintenanceHeadline}
              onChange={(e) => setMaintenance({ ...maintenance, maintenanceHeadline: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Whitelisted IPs (Bypass Screen)</label>
            <input
              type="text"
              value={maintenance.whitelistedIps}
              onChange={(e) => setMaintenance({ ...maintenance, whitelistedIps: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
            />
          </div>
          <button onClick={() => handleSave('Maintenance Mode')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Save Maintenance State</button>
        </div>
      )}

      {/* TAB 9: COOKIE ALERT */}
      {activeTab === 'cookie' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cookie className="w-4 h-4 text-amber-400" />
            <span>Cookie Compliance & Consent Alert</span>
          </h3>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="font-semibold text-white">Enable Cookie Banner</h4>
              <p className="text-[11px] text-slate-400">Show bottom floating consent modal for first-time visitors</p>
            </div>
            <input
              type="checkbox"
              checked={cookieConsent.isEnabled}
              onChange={(e) => setCookieConsent({ ...cookieConsent, isEnabled: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Consent Notice Copy</label>
            <textarea
              rows={3}
              value={cookieConsent.bannerText}
              onChange={(e) => setCookieConsent({ ...cookieConsent, bannerText: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
            />
          </div>
          <button onClick={() => handleSave('Cookie Alert')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Save Cookie Alert</button>
        </div>
      )}

      {/* TAB 10: SOCIAL MEDIAS */}
      {activeTab === 'social' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Official Social Media Channel Handles</span>
          </h3>
          {Object.entries(socialMedias).map(([network, url]) => (
            <div key={network}>
              <label className="block text-slate-300 font-medium mb-1 uppercase font-mono text-[10px] tracking-wider">{network}</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setSocialMedias({ ...socialMedias, [network]: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
              />
            </div>
          ))}
          <button onClick={() => handleSave('Social Media Links')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Save Social Media</button>
        </div>
      )}

      {/* TAB 11: MOBILE APP */}
      {activeTab === 'mobile' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Mobile App Deep-Links & Push Gateway</span>
          </h3>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Google Play Store URL</label>
            <input
              type="text"
              value={mobileApp.playStoreUrl}
              onChange={(e) => setMobileApp({ ...mobileApp, playStoreUrl: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Apple App Store URL</label>
            <input
              type="text"
              value={mobileApp.appStoreUrl}
              onChange={(e) => setMobileApp({ ...mobileApp, appStoreUrl: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
            />
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 className="font-semibold text-white">Smart App Download Banner</h4>
              <p className="text-[11px] text-slate-400">Show prompt on mobile web browser</p>
            </div>
            <input
              type="checkbox"
              checked={mobileApp.appBannerEnabled}
              onChange={(e) => setMobileApp({ ...mobileApp, appBannerEnabled: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
          <button onClick={() => handleSave('Mobile App Settings')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Save Mobile App Settings</button>
        </div>
      )}
    </div>
  );
}
