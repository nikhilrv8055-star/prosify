'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Save,
  CheckCircle2,
  Server,
  Lock,
  Globe,
  ExternalLink,
  Percent,
  MessageCircle,
  Mail,
  Phone,
  Image as ImageIcon,
  Trash2,
  Upload,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { saveCachedBrandSettings } from '@/lib/data/useBrandSettings';

export function SettingsTab() {
  const { toast } = useToast();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    agencyName: 'Prosify Technologies Private Limited',
    adminHost: 'admin.prosify.in',
    whatsappNumber: '+91 91679 91679',
    contactEmail: 'hello4home@gmail.com',
    supportEmail: 'hello4home@gmail.com',
    phone: '+91 91679 91679',
    logoUrl: '',
    logoName: 'Default Monogram',
    tdsRate: 5.0,
    silverRate: 2.0,
    goldRate: 2.5,
    platinumRate: 3.0,
    diamondRate: 3.5,
    sessionTimeoutMins: 15,
    ipWhitelist: '103.21.14.82, 192.168.1.0/24',
    enableAuditLogs: true,
  });

  // Load live settings from cloud API
  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setSettings((prev) => ({
            ...prev,
            agencyName: data.settings.agencyName || prev.agencyName,
            whatsappNumber: data.settings.whatsappNumber || prev.whatsappNumber,
            contactEmail: data.settings.contactEmail || prev.contactEmail,
            supportEmail: data.settings.supportEmail || prev.supportEmail,
            phone: data.settings.phone || prev.phone,
            logoUrl: data.settings.logoUrl || '',
            logoName: data.settings.logoName || 'Default Monogram',
          }));
        }
      })
      .catch(() => {});
  }, []);

  const cleanWhatsAppRaw = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const formattedWhatsAppLink = `https://wa.me/${cleanWhatsAppRaw.startsWith('91') ? cleanWhatsAppRaw : '91' + cleanWhatsAppRaw}`;

  const handleSaveAndPublish = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsPublishing(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyName: settings.agencyName,
          whatsappNumber: settings.whatsappNumber,
          contactEmail: settings.contactEmail,
          supportEmail: settings.supportEmail,
          phone: settings.phone,
          logoUrl: settings.logoUrl,
          logoName: settings.logoName,
        }),
      });

      const data = await res.json();
      if (data?.success && data?.settings) {
        saveCachedBrandSettings(data.settings);
        setSavedSuccess(true);
        toast({
          title: 'Settings Published Successfully! 🚀',
          description: 'WhatsApp, Email, and Logo changes are now live across the entire website.',
          type: 'success',
        });
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch {
      toast({
        title: 'Error Publishing Settings',
        description: 'Failed to sync with cloud server. Please retry.',
        type: 'error',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Logo image must be smaller than 2MB.',
        type: 'error',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSettings((prev) => ({
        ...prev,
        logoUrl: result,
        logoName: file.name,
      }));
      toast({
        title: 'Logo Uploaded',
        description: 'Click "Publish Settings to Live Website" to apply it to all pages.',
        type: 'info',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setSettings((prev) => ({
      ...prev,
      logoUrl: '',
      logoName: 'Default Prosify Monogram',
    }));
    toast({
      title: 'Logo Removed',
      description: 'Restored default Prosify Monogram. Click Publish to save.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#10B981]" />
            <span>Platform Configuration, Contact Channels & Logo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage live WhatsApp integration, support email, website logo, and agency policies
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSaveAndPublish()}
          disabled={isPublishing}
          className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-black text-xs shadow-lg shadow-[#10B981]/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          {isPublishing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Publish Settings to Live Website</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Contact details & website logo successfully published to Cloud and live across all client browsers!</span>
        </div>
      )}

      <form onSubmit={handleSaveAndPublish} className="space-y-6">
        {/* ================================================================= */}
        {/* 1. WHATSAPP & EMAIL CUSTOMER CONTACT INTEGRATION (REQUIREMENTS 1 & 2) */}
        {/* ================================================================= */}
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#10B981]" />
              <span>WhatsApp Integration & Official Support Email (Edit & Publish)</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              Live Cloud Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* WhatsApp Number Field */}
            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#10B981]" />
                <span>WhatsApp Contact Number</span>
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="e.g. 9167991679 or +91 91679 91679"
                className="w-full px-3.5 py-2.5 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#10B981] text-sm"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Active link preview:</span>
                <a
                  href={formattedWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-mono hover:underline flex items-center gap-1"
                >
                  <span>{formattedWhatsAppLink}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Support Email Field */}
            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Support & Customer Contact Email</span>
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value, contactEmail: e.target.value })}
                placeholder="hello4home@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#10B981] text-sm"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Direct mail link:</span>
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="text-amber-400 font-mono hover:underline"
                >
                  mailto:{settings.supportEmail}
                </a>
              </div>
            </div>

            {/* Helpline Phone Number */}
            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>Helpline / Calling Phone Number</span>
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+91 91679 91679"
                className="w-full px-3.5 py-2.5 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#10B981] text-sm"
              />
              <span className="text-[11px] text-slate-500 block">
                Displayed across platform footer, property inspection desk, and callback forms.
              </span>
            </div>

            {/* Quick Action Button within card */}
            <div className="flex flex-col justify-end space-y-2">
              <span className="text-[11px] text-slate-400">
                Publishing updates all WhatsApp buttons, enquiry links, email client triggers, and footer support in real-time.
              </span>
              <button
                type="button"
                onClick={() => handleSaveAndPublish()}
                disabled={isPublishing}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Publish WhatsApp & Email Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. WEBSITE LOGO MANAGEMENT (REQUIREMENT 6)                         */}
        {/* ================================================================= */}
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Website Logo Management (Add, Customize & Remove)</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              Header, Footer & Mobile Drawers
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-xs">
            {/* Left Column: Current Logo Live Preview */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Live Logo Preview
              </span>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center justify-center min-h-[90px] shadow-inner">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt="Custom Website Logo"
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-black text-xl bg-gradient-to-tr from-[#B38711] via-[#D4A017] to-[#F4C430] text-neutral-950 shadow-sm">
                      P
                    </div>
                    <div className="text-left">
                      <span className="font-serif font-bold text-xl text-neutral-950 block">Prosify</span>
                      <span className="text-[9px] font-mono uppercase text-amber-600 block">Default Emblem</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center min-h-[70px]">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt="Custom Website Logo on Dark"
                    className="max-h-12 max-w-full object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-serif font-black text-base bg-gradient-to-tr from-[#B38711] via-[#D4A017] to-[#F4C430] text-neutral-950">
                      P
                    </div>
                    <span className="font-serif font-bold text-lg text-white">Prosify</span>
                  </div>
                )}
              </div>

              <span className="text-[11px] text-slate-500 block">
                Status: {settings.logoUrl ? <strong className="text-emerald-400">Custom Logo Active</strong> : <strong className="text-amber-400">Default Brand Logo</strong>}
              </span>

              {settings.logoUrl && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="w-full py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Custom Logo</span>
                </button>
              )}
            </div>

            {/* Right Column: Upload & URL Inputs */}
            <div className="lg:col-span-2 space-y-4">
              {/* Option A: Image URL */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">
                  Logo Image URL (Online / Hosted Image)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    placeholder="https://example.com/assets/logo.png"
                    className="flex-1 px-3.5 py-2.5 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <span className="text-[11px] text-slate-500">
                  Provide a direct PNG, SVG, or JPG URL with transparent background.
                </span>
              </div>

              {/* Option B: Direct File Upload */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">
                  Upload Logo File from Computer
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-600 font-semibold text-xs cursor-pointer flex items-center gap-2 transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Choose Logo File...</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {settings.logoName || 'PNG or SVG recommended (Max 2MB)'}
                  </span>
                </div>
              </div>

              {/* Option C: Preset Designer Logos */}
              <div className="pt-2 space-y-2">
                <label className="block text-slate-300 font-semibold">
                  Or Apply High-Resolution Brand Presets:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
                        logoName: 'Gold Abstract Luxury Emblem',
                      })
                    }
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left text-[11px] text-slate-300 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Gold Crest</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        logoUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=200&q=80',
                        logoName: 'Architectural Monogram',
                      })
                    }
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left text-[11px] text-slate-300 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">Modern Corporate</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left text-[11px] text-amber-400 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Reset Default</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agency Identity Card */}
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0EA5E9]" />
            <span>Agency & Host Topology</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Agency Legal Title</label>
              <input
                type="text"
                value={settings.agencyName}
                onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Administrative Domain Host</label>
              <input
                type="text"
                disabled
                value={settings.adminHost}
                className="w-full px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800 text-[#0EA5E9] font-mono focus:outline-none cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Strict isolation: Never exposed through public website links
              </span>
            </div>
          </div>
        </div>

        {/* Financial Slabs & TDS */}
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#F59E0B]" />
            <span>Statutory Section 194H & Channel Partner Slabs</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">TDS Rate (194H)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={settings.tdsRate}
                  onChange={(e) => setSettings({ ...settings, tdsRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
                <span className="absolute right-3 top-2 text-slate-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Silver Slab (1-3 Deals)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={settings.silverRate}
                  onChange={(e) => setSettings({ ...settings, silverRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
                <span className="absolute right-3 top-2 text-slate-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Gold Slab (4-8 Deals)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={settings.goldRate}
                  onChange={(e) => setSettings({ ...settings, goldRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
                <span className="absolute right-3 top-2 text-slate-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Platinum (9-15 Deals)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={settings.platinumRate}
                  onChange={(e) => setSettings({ ...settings, platinumRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
                <span className="absolute right-3 top-2 text-slate-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Diamond (16+ Deals)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={settings.diamondRate}
                  onChange={(e) => setSettings({ ...settings, diamondRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
                <span className="absolute right-3 top-2 text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer with WhatsApp Direct */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <a
            href={formattedWhatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 text-xs font-semibold transition-colors"
          >
            <span>WhatsApp (+91 91679 91679)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="submit"
            disabled={isPublishing}
            className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-xs shadow-lg shadow-[#10B981]/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Persist & Publish System Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
