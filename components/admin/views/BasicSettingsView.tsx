'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export function BasicSettingsView({ subview = 'settings-general' }: { subview?: string }) {
  const [activeTab, setActiveTab] = useState<
    | 'general'
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
    supportNumber: '+91 93263 03244',
    officeAddress: 'Maker Chambers IV, Nariman Point, Mumbai 400021',
  });

  const [contactConfig, setContactConfig] = useState({
    contactEmail: 'contact@prosify.in',
    escalationPhone: '+91 93263 03244',
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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
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
            Configure enterprise parameters, SMTP mailers, SEO tags, cookie banners, maintenance mode, and mobile apps.
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
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800'
            }`}
          >
            {tab.label}
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
