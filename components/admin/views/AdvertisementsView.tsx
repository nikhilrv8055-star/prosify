'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Plus,
  Eye,
  MousePointer,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  ExternalLink,
  X,
  Sparkles,
  Layout,
  BellRing,
} from 'lucide-react';

export interface PhotoAdItem {
  id: string;
  title: string;
  slot: 'HOMEPAGE_HERO_BANNER' | 'PROPERTY_SIDEBAR' | 'PROJECT_FOOTER_STRIP' | 'POPUP_MODAL' | 'CATEGORY_TOP';
  imageUrl: string;
  targetUrl: string;
  advertiserName: string;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED';
}

const INITIAL_ADS: PhotoAdItem[] = [];

interface AdvertisementsViewProps {
  subview?: 'ads-settings' | 'ads-photo-ads' | 'ads-announcements';
}

export function AdvertisementsView({ subview = 'ads-photo-ads' }: AdvertisementsViewProps) {
  const [ads, setAds] = useState<PhotoAdItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementText, setAnnouncementText] = useState('Festive Grand Offer: 0% Stamp Duty on all Grade-A projects till Oct 31!');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Form State for Photo Ads
  const [form, setForm] = useState({
    title: '',
    slot: 'HOMEPAGE_HERO_BANNER' as PhotoAdItem['slot'],
    imageUrl: '',
    targetUrl: '',
    advertiserName: '',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
  });

  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) return;

    const newAd: PhotoAdItem = {
      id: `ad-${Date.now()}`,
      title: form.title,
      slot: form.slot,
      imageUrl: form.imageUrl,
      targetUrl: form.targetUrl || '#',
      advertiserName: form.advertiserName || 'Direct Advertiser',
      impressions: 0,
      clicks: 0,
      startDate: form.startDate,
      endDate: form.endDate,
      status: 'ACTIVE',
    };

    setAds([newAd, ...ads]);
    setIsModalOpen(false);
    setToast('New Photo Ad Published to Slot!');
    setTimeout(() => setToast(null), 3000);
    setForm({
      title: '',
      slot: 'HOMEPAGE_HERO_BANNER',
      imageUrl: '',
      targetUrl: '',
      advertiserName: '',
      startDate: '2026-10-01',
      endDate: '2026-11-30',
    });
  };

  const handleDeleteAd = (id: string) => {
    setAds(ads.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-400" />
            <span>Advertisements & Property Photo Ads Console</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage sponsored photo banners, developer brand spotlight takeovers, and announcement popups.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Photo Ad</span>
        </button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Announcement Popup Manager */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <BellRing className="w-4 h-4 text-amber-400" />
            <span>Global Announcement Popup / Notification Bar</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={announcementEnabled}
              onChange={(e) => setAnnouncementEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600"
            />
            <span className="text-slate-300 font-semibold">{announcementEnabled ? 'Active' : 'Disabled'}</span>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          />
          <button
            onClick={() => {
              setToast('Global Announcement Updated Live!');
              setTimeout(() => setToast(null), 3000);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
          >
            Update Banner
          </button>
        </div>
      </div>

      {/* Active Photo Ads Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ads.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
            No active photo advertisements running. Click &quot;Upload Photo Ad&quot; to configure hero or sidebar banners.
          </div>
        ) : (
          ads.map((ad) => (
          <div
            key={ad.id}
            className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              {/* Photo Preview */}
              <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-cyan-300 font-mono text-[9px] font-bold border border-cyan-500/30">
                  {ad.slot.replace(/_/g, ' ')}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 text-[9px] font-bold border border-emerald-500/40">
                  {ad.status}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{ad.title}</h3>
                <span className="text-[11px] text-slate-400 font-medium">Advertiser: {ad.advertiserName}</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 truncate">
                Target: <span className="text-cyan-400">{ad.targetUrl}</span>
              </div>

              {/* Engagement Stats */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1 border-t border-slate-800">
                <div className="p-1.5 rounded-lg bg-slate-900">
                  <span className="text-[10px] text-slate-500 block">Impressions</span>
                  <strong className="text-white font-mono text-xs">{ad.impressions.toLocaleString()}</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-900">
                  <span className="text-[10px] text-slate-500 block">Clicks</span>
                  <strong className="text-emerald-400 font-mono text-xs">{ad.clicks.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500">Exp: {ad.endDate}</span>
              <button
                onClick={() => handleDeleteAd(ad.id)}
                className="p-1.5 rounded-lg hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                title="Remove Ad"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
      </div>

      {/* Upload Photo Ad Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-400" />
                <span>Upload New Property Photo Ad</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAd} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Ad Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Godrej Horizon Sky Exclusive Penthouse Banner"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Display Slot Position</label>
                <select
                  value={form.slot}
                  onChange={(e) => setForm({ ...form, slot: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
                >
                  <option value="HOMEPAGE_HERO_BANNER">Homepage Hero Banner (1200x500)</option>
                  <option value="PROPERTY_SIDEBAR">Property Sidebar Ad (600x600)</option>
                  <option value="PROJECT_FOOTER_STRIP">Project Footer Strip (1200x200)</option>
                  <option value="POPUP_MODAL">Announcement Popup Modal</option>
                  <option value="CATEGORY_TOP">Category Top Header Ad</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Photo Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or picsum.photos/..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Click Destination URL</label>
                  <input
                    type="text"
                    placeholder="/projects/godrej-riviera"
                    value={form.targetUrl}
                    onChange={(e) => setForm({ ...form, targetUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Advertiser / Sponsor Name</label>
                  <input
                    type="text"
                    placeholder="Godrej Properties Ltd"
                    value={form.advertiserName}
                    onChange={(e) => setForm({ ...form, advertiserName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  Publish Photo Ad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
