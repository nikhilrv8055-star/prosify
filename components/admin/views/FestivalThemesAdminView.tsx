'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Palette,
  CheckCircle2,
  Calendar,
  Flame,
  Layers,
  Sliders,
  Eye,
  Save,
  RotateCcw,
  Volume2,
  Bell,
  Gift,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Info,
  Radio,
  Check,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Clock,
  Settings2,
  Trash2,
  Play,
  Monitor,
} from 'lucide-react';
import {
  FestivalThemeConfig,
  FestivalThemeDefinition,
  FestivalThemeId,
  AmbientEffectType,
  HolidayCustomization,
  HolidayScheduleItem,
} from '@/lib/theme/festivalThemeTypes';
import {
  DEFAULT_FESTIVAL_CONFIG,
  FESTIVAL_THEMES,
  INDIAN_HOLIDAY_SCHEDULE,
  getFestivalThemeDefinition,
  loadFestivalThemeConfig,
  saveFestivalThemeConfig,
  getAutoScheduledThemeId,
} from '@/lib/theme/festivalThemeStore';
import { useFestivalTheme } from '@/components/theme/FestivalThemeProvider';
import { ThemeHomepagePreviewModal } from './ThemeHomepagePreviewModal';

interface FestivalThemesAdminViewProps {
  subview?: string;
}

// Preset banner images curated for Indian celebration holidays
const FESTIVAL_BANNER_PRESETS: Record<FestivalThemeId, Array<{ label: string; url: string }>> = {
  default: [
    { label: 'Modern Luxury Villa', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Obsidian Highrise Skyline', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80' },
  ],
  diwali: [
    { label: 'Golden Diyas & Sparks', url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Diwali Night Sky Fireworks', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Auspicious Clay Lamps & Rangoli', url: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Royal Festive Palace Lights', url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=2000&q=80' },
  ],
  new_year: [
    { label: 'New Year Fireworks Gala', url: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Midnight Celebration Lights', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Champagne Sparkler Glow', url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=2000&q=80' },
  ],
  christmas: [
    { label: 'Christmas Pine & Festive Warmth', url: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Snow Crystals & Winter Glow', url: 'https://images.unsplash.com/photo-1482686115713-0fbcaced6e28?auto=format&fit=crop&w=2000&q=80' },
  ],
  republic_day: [
    { label: 'India Gate & Tricolor Dignity', url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Patriotic Tricolor Sky & Flags', url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=2000&q=80' },
  ],
  holi: [
    { label: 'Vibrant Gulal Color Explosions', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Festive Spring Colors Celebration', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=2000&q=80' },
  ],
  gudi_padwa: [
    { label: 'Marigold Garlands & Traditional Decor', url: 'https://images.unsplash.com/photo-1609137144822-263626786c75?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Chaitra Spring Sunshine Villa', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80' },
  ],
  independence_day: [
    { label: 'National Flag Freedom Memorial', url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Tricolor Patriotic Celebration', url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=2000&q=80' },
  ],
  raksha_bandhan: [
    { label: 'Traditional Festive Thread & Sweets', url: 'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Warm Family Estate Sanctuary', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80' },
  ],
  navratri_dussehra: [
    { label: 'Royal Navratri Festive Illuminations', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80' },
    { label: 'Vijayadashami Auspicious Allotments', url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=2000&q=80' },
  ],
};

const POPULAR_ACCENT_COLORS = [
  { name: 'Imperial Gold', hex: '#F59E0B' },
  { name: 'Royal Saffron', '#FF671F': '#FF671F', hex: '#FF671F' },
  { name: 'Deep Saffron', hex: '#EA580C' },
  { name: 'Gulal Pink', hex: '#EC4899' },
  { name: 'Peacock Blue', hex: '#0EA5E9' },
  { name: 'Tricolor Emerald', hex: '#046A38' },
  { name: 'Festive Crimson', hex: '#EF4444' },
  { name: 'Royal Violet', hex: '#8B5CF6' },
  { name: 'Marigold Yellow', hex: '#FDE047' },
];

export function FestivalThemesAdminView({ subview }: FestivalThemesAdminViewProps) {
  const {
    config: globalConfig,
    updateConfig,
    previewTheme,
    previewThemeId,
    clearPreview,
  } = useFestivalTheme();

  // Local draft state for editing before saving
  const [draftConfig, setDraftConfig] = useState<FestivalThemeConfig>(globalConfig);
  const [activeTab, setActiveTab] = useState<'themes' | 'customization' | 'banner' | 'effects' | 'schedule'>('themes');
  const [selectedHolidayToEdit, setSelectedHolidayToEdit] = useState<FestivalThemeId>(globalConfig.activeThemeId);
  const [savedSuccessToast, setSavedSuccessToast] = useState(false);

  // Live Homepage Preview Modal state
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [modalTargetThemeId, setModalTargetThemeId] = useState<FestivalThemeId>(globalConfig.activeThemeId);

  // Image upload ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Schedule Simulation State
  const [simulatedDateStr, setSimulatedDateStr] = useState<string>('');
  const [simulatedMatchThemeId, setSimulatedMatchThemeId] = useState<FestivalThemeId | null>(null);

  useEffect(() => {
    setDraftConfig(globalConfig);
    setSelectedHolidayToEdit(globalConfig.activeThemeId);
  }, [globalConfig]);

  const activeThemeDef = getFestivalThemeDefinition(draftConfig.activeThemeId);
  const editingThemeDef = getFestivalThemeDefinition(selectedHolidayToEdit);
  const currentHolidayCustom = draftConfig.holidayCustomizations?.[selectedHolidayToEdit] || {};

  // Handle uploading banner image via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        handleUpdateHolidayCustomization(selectedHolidayToEdit, {
          bannerImageUrl: dataUrl,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateHolidayCustomization = (
    holidayId: FestivalThemeId,
    updates: Partial<HolidayCustomization>
  ) => {
    setDraftConfig((prev) => {
      const existing = prev.holidayCustomizations?.[holidayId] || {};
      const updatedHoliday = { ...existing, ...updates };

      const nextHolidayCustomizations = {
        ...prev.holidayCustomizations,
        [holidayId]: updatedHoliday,
      };

      // If updating currently active holiday, also sync top-level overrides
      const isCurrentlyActive = prev.activeThemeId === holidayId;

      return {
        ...prev,
        holidayCustomizations: nextHolidayCustomizations,
        ...(isCurrentlyActive && updates.accentColor
          ? { accentColorOverride: updates.accentColor }
          : {}),
        ...(isCurrentlyActive && updates.bannerImageUrl
          ? { customBannerImage: updates.bannerImageUrl }
          : {}),
        ...(isCurrentlyActive && updates.festiveOverlay
          ? { festiveOverlayOverride: updates.festiveOverlay }
          : {}),
      };
    });
  };

  const handleSelectTheme = (themeId: FestivalThemeId) => {
    const targetTheme = getFestivalThemeDefinition(themeId);
    const custom = draftConfig.holidayCustomizations?.[themeId];

    setDraftConfig((prev) => ({
      ...prev,
      activeThemeId: themeId,
      customBannerImage: custom?.bannerImageUrl || targetTheme.defaultBannerImage,
      accentColorOverride: custom?.accentColor || targetTheme.primaryColor,
      festiveOverlayOverride: custom?.festiveOverlay || targetTheme.ambientEffectType,
      customBannerGreeting: custom?.customGreeting || targetTheme.defaultBannerGreeting,
      customBannerSubtext: custom?.customSubtext || targetTheme.defaultBannerSubtext,
      customCtaText: custom?.customCtaText || targetTheme.defaultCtaText,
      customBadgeText: custom?.customBadgeText || targetTheme.defaultBadgeText,
    }));

    setSelectedHolidayToEdit(themeId);
  };

  const handleSaveAndSync = () => {
    updateConfig(draftConfig);
    clearPreview();
    setSavedSuccessToast(true);
    setTimeout(() => setSavedSuccessToast(false), 4000);
  };

  const handleOpenPreviewModal = (themeId?: FestivalThemeId) => {
    const targetId = themeId || selectedHolidayToEdit || draftConfig.activeThemeId;
    setModalTargetThemeId(targetId);
    setPreviewModalOpen(true);
  };

  const handleApplyFromPreviewModal = () => {
    // Select this theme as active and save globally
    const targetTheme = getFestivalThemeDefinition(modalTargetThemeId);
    const custom = draftConfig.holidayCustomizations?.[modalTargetThemeId];

    const updatedConfig: FestivalThemeConfig = {
      ...draftConfig,
      activeThemeId: modalTargetThemeId,
      isEnabled: true,
      customBannerImage: custom?.bannerImageUrl || targetTheme.defaultBannerImage,
      accentColorOverride: custom?.accentColor || targetTheme.primaryColor,
      festiveOverlayOverride: custom?.festiveOverlay || targetTheme.ambientEffectType,
      customBannerGreeting: custom?.customGreeting || targetTheme.defaultBannerGreeting,
      customBannerSubtext: custom?.customSubtext || targetTheme.defaultBannerSubtext,
      customCtaText: custom?.customCtaText || targetTheme.defaultCtaText,
      customBadgeText: custom?.customBadgeText || targetTheme.defaultBadgeText,
      updatedAt: new Date().toISOString(),
    };

    setDraftConfig(updatedConfig);
    updateConfig(updatedConfig);
    clearPreview();
    setSavedSuccessToast(true);
    setTimeout(() => setSavedSuccessToast(false), 4000);
  };

  const handleSimulateDateChange = (dateVal: string) => {
    setSimulatedDateStr(dateVal);
    if (!dateVal) {
      setSimulatedMatchThemeId(null);
      return;
    }
    const parsed = new Date(dateVal);
    if (!isNaN(parsed.getTime())) {
      const matched = getAutoScheduledThemeId(parsed);
      setSimulatedMatchThemeId(matched);
    }
  };

  const themesList = Object.values(FESTIVAL_THEMES);

  return (
    <div className="space-y-6">
      {/* 1. TOP BANNER & HEADER TOOLBAR */}
      <div className="rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Specular Ambient Glow */}
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ backgroundColor: activeThemeDef.primaryColor }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Festival Theme Management
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Live Real-Time Sync
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Festival Theme Management</span>
              <span className="text-xl">🪔 🎨 🇮🇳 🎄</span>
            </h1>
            <p className="text-sm text-neutral-400 max-w-2xl mt-1.5">
              Upload custom banner images, configure accent color overrides, and set festive overlays for Indian holidays. Themes dynamically apply based on the active holiday schedule with instant public homepage preview.
            </p>
          </div>

          {/* ACTION BUTTONS: PREVIEW THEME & SAVE */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* PREVIEW THEME BUTTON: OPENS MODAL SHOWING LIVE PREVIEW OF HOMEPAGE */}
            <button
              onClick={() => handleOpenPreviewModal(draftConfig.activeThemeId)}
              className="px-4 py-2.5 rounded-xl border border-amber-500/50 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Preview Theme</span>
            </button>

            <button
              onClick={handleSaveAndSync}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-neutral-950 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
              style={{ backgroundColor: activeThemeDef.primaryColor }}
            >
              <Save className="w-4 h-4" />
              <span>Save & Sync To Website</span>
            </button>
          </div>
        </div>

        {/* Global Master Toggles Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-800/80">
          {/* Master Enable */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: `${activeThemeDef.primaryColor}25`, color: activeThemeDef.primaryColor }}
              >
                {activeThemeDef.iconEmoji}
              </div>
              <div>
                <p className="text-xs font-bold text-white">Festive Visuals Master</p>
                <p className="text-[10px] text-neutral-400">Display festive styling on website</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={draftConfig.isEnabled}
                onChange={(e) => setDraftConfig((prev) => ({ ...prev, isEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Auto Calendar Schedule */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Dynamic Holiday Schedule</p>
                <p className="text-[10px] text-neutral-400">Auto-applies theme on holiday dates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={draftConfig.autoScheduleEnabled}
                onChange={(e) => setDraftConfig((prev) => ({ ...prev, autoScheduleEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>

          {/* Active Theme Status */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Active Holiday Theme</p>
                <p className="text-[10px] font-bold" style={{ color: activeThemeDef.primaryColor }}>
                  {activeThemeDef.name}
                </p>
              </div>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wider"
              style={{
                backgroundColor: `${activeThemeDef.primaryColor}20`,
                color: activeThemeDef.primaryColor,
                borderColor: `${activeThemeDef.primaryColor}50`,
              }}
            >
              {draftConfig.isEnabled ? 'Live on Site' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Toast */}
      {savedSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">
                Festival Theme Successfully Synchronized!
              </p>
              <p className="text-xs text-emerald-200/80">
                Active theme '{activeThemeDef.name}' is now live with all custom banners, color overrides, and festive overlays.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500 text-neutral-950">
            Synced
          </span>
        </div>
      )}

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('themes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'themes'
              ? 'bg-amber-500 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>All Indian Festival Themes ({themesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customization')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'customization'
              ? 'bg-amber-500 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>Banner Upload & Color Overrides</span>
        </button>

        <button
          onClick={() => setActiveTab('banner')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'banner'
              ? 'bg-amber-500 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Greetings & Announcement Bar</span>
        </button>

        <button
          onClick={() => setActiveTab('effects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'effects'
              ? 'bg-amber-500 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Festive Overlays & Particles</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'schedule'
              ? 'bg-amber-500 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Holiday Schedule Timeline</span>
        </button>
      </div>

      {/* TAB 1: ALL THEMES GRID WITH DIRECT PREVIEW BUTTON ON EACH CARD */}
      {activeTab === 'themes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-xs text-neutral-400">
              Each holiday theme has tailored color palettes, auspicious greetings, and overlay animations. Click 'Preview Theme' to view how it looks on the public homepage.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenPreviewModal(draftConfig.activeThemeId)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/25 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Active Theme</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {themesList.map((theme) => {
              const isSelected = draftConfig.activeThemeId === theme.id;
              const custom = draftConfig.holidayCustomizations?.[theme.id];
              const effectiveAccent = custom?.accentColor || theme.primaryColor;
              const hasCustomBanner = !!custom?.bannerImageUrl;
              const hasCustomColor = !!custom?.accentColor;
              const overlayType = custom?.festiveOverlay || theme.ambientEffectType;

              return (
                <div
                  key={theme.id}
                  className={`rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-neutral-900 border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                      : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/10"
                          style={{
                            backgroundColor: `${effectiveAccent}25`,
                          }}
                        >
                          {theme.iconEmoji}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                            {theme.name}
                          </h4>
                          <p className="text-xs font-semibold" style={{ color: effectiveAccent }}>
                            {theme.hindiName}
                          </p>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-neutral-950 flex items-center gap-1 shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-500 font-medium">
                          {theme.season}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                      {theme.tagline}
                    </p>

                    {/* Cultural Note & Dates */}
                    <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800/80 mb-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400">Festive Season:</span>
                        <span className="font-bold text-neutral-200">{theme.dates}</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 leading-tight">
                        {theme.culturalNote}
                      </p>
                    </div>

                    {/* Customization Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-3 text-[10px]">
                      {hasCustomBanner && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                          Custom Banner
                        </span>
                      )}
                      {hasCustomColor && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                          Color Override
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 font-medium capitalize">
                        Overlay: {overlayType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Actions Strip */}
                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                    {/* PREVIEW THEME BUTTON: OPENS LIVE HOMEPAGE PREVIEW MODAL */}
                    <button
                      type="button"
                      onClick={() => handleOpenPreviewModal(theme.id)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 hover:border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Theme</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHolidayToEdit(theme.id);
                          setActiveTab('customization');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold border border-neutral-800 transition-colors cursor-pointer"
                        title="Customize this holiday"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectTheme(theme.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Apply Theme'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMIZATION STUDIO (BANNER IMAGES, ACCENT COLORS, FESTIVE OVERLAYS) */}
      {activeTab === 'customization' && (
        <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-6 shadow-xl">
          {/* Holiday Selector Sub-bar */}
          <div className="border-b border-neutral-800 pb-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Holiday Customization Studio</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Select a holiday below to upload custom banner images, override accent colors, and choose celebration overlays.
                </p>
              </div>

              {/* Preview Button for the currently edited holiday */}
              <button
                onClick={() => handleOpenPreviewModal(selectedHolidayToEdit)}
                className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
              >
                <Eye className="w-4 h-4" />
                <span>Preview {editingThemeDef.name}</span>
              </button>
            </div>

            {/* Quick Holiday Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1">
              {themesList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedHolidayToEdit(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedHolidayToEdit === t.id
                      ? 'bg-amber-500 text-neutral-950 shadow-md font-black'
                      : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <span>{t.iconEmoji}</span>
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. CUSTOM BANNER IMAGE SECTION */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-bold text-white">1. Custom Banner Image</h4>
                </div>
                {currentHolidayCustom.bannerImageUrl && (
                  <button
                    onClick={() =>
                      handleUpdateHolidayCustomization(selectedHolidayToEdit, {
                        bannerImageUrl: undefined,
                      })
                    }
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset Image</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-neutral-400">
                Upload your own festival promotional banner or select from verified high-resolution festival backdrops.
              </p>

              {/* Upload Input */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-neutral-800 hover:border-amber-500/60 rounded-2xl bg-neutral-900/50 hover:bg-neutral-900 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <Upload className="w-6 h-6 text-neutral-400 group-hover:text-amber-400 transition-colors" />
                  <div className="text-center">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300">
                      Upload Custom Banner Image
                    </span>
                    <span className="text-[11px] text-neutral-500 block">
                      PNG, JPG, WEBP • Recommended 2000x800 px
                    </span>
                  </div>
                </button>
              </div>

              {/* Or Direct Image URL */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                  Or Paste Custom Image URL
                </label>
                <input
                  type="text"
                  value={currentHolidayCustom.bannerImageUrl || ''}
                  onChange={(e) =>
                    handleUpdateHolidayCustomization(selectedHolidayToEdit, {
                      bannerImageUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com/banner.jpg"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Curated Festival Presets */}
              <div>
                <span className="block text-[11px] font-bold text-neutral-400 mb-2">
                  Curated Presets for {editingThemeDef.name}:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(FESTIVAL_BANNER_PRESETS[selectedHolidayToEdit] || FESTIVAL_BANNER_PRESETS.default).map(
                    (preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          handleUpdateHolidayCustomization(selectedHolidayToEdit, {
                            bannerImageUrl: preset.url,
                          })
                        }
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                          currentHolidayCustom.bannerImageUrl === preset.url
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-neutral-800 bg-neutral-900/70 hover:border-neutral-700'
                        }`}
                      >
                        <div className="relative h-14 w-full rounded-lg overflow-hidden bg-neutral-800">
                          <Image
                            src={preset.url}
                            alt={preset.label}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-300 truncate">
                          {preset.label}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Active Banner Image Preview */}
              <div className="pt-2 border-t border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block mb-1.5 font-bold">
                  Current Selected Banner:
                </span>
                <div className="relative h-28 w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
                  <Image
                    src={
                      currentHolidayCustom.bannerImageUrl ||
                      editingThemeDef.defaultBannerImage ||
                      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80'
                    }
                    alt="Current Banner"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 bg-neutral-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-white">
                    {currentHolidayCustom.bannerImageUrl ? 'Custom Uploaded' : 'Default Preset'}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ACCENT COLOR OVERRIDES & FESTIVE OVERLAYS */}
            <div className="space-y-6">
              {/* ACCENT COLOR OVERRIDE */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">2. Accent Color Override</h4>
                  </div>
                  {currentHolidayCustom.accentColor && (
                    <button
                      onClick={() =>
                        handleUpdateHolidayCustomization(selectedHolidayToEdit, {
                          accentColor: undefined,
                        })
                      }
                      className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-neutral-400">
                  Override the holiday's primary accent color used on banners, buttons, borders, and highlights across the entire app.
                </p>

                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <input
                      type="color"
                      value={currentHolidayCustom.accentColor || editingThemeDef.primaryColor}
                      onChange={(e) =>
                        handleUpdateHolidayCustomization(selectedHolidayToEdit, {
                          accentColor: e.target.value,
                        })
                      }
                      className="w-12 h-12 rounded-xl cursor-pointer border border-neutral-700 bg-neutral-900 p-1"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      HEX Code
                    </label>
                    <input
                      type="text"
                      value={currentHolidayCustom.accentColor || editingThemeDef.primaryColor}
                      onChange={(e) =>
                        handleUpdateHolidayCustomization(selectedHolidayToEdit, {
                          accentColor: e.target.value,
                        })
                      }
                      placeholder="#F59E0B"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500 uppercase"
                    />
                  </div>

                  {/* Sample Button Preview */}
                  <div className="text-center">
                    <span className="block text-[10px] text-neutral-400 mb-1">Button Preview</span>
                    <button
                      type="button"
                      className="px-3 py-2 rounded-xl text-xs font-black text-neutral-950 shadow-md"
                      style={{
                        backgroundColor: currentHolidayCustom.accentColor || editingThemeDef.primaryColor,
                      }}
                    >
                      Explore
                    </button>
                  </div>
                </div>

                {/* Popular Indian Festive Colors */}
                <div>
                  <span className="block text-[11px] font-bold text-neutral-400 mb-2">
                    Auspicious Color Presets:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {POPULAR_ACCENT_COLORS.map((col, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          handleUpdateHolidayCustomization(selectedHolidayToEdit, {
                            accentColor: col.hex,
                          })
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-[11px] text-neutral-300 transition-colors cursor-pointer"
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. FESTIVE OVERLAYS SECTION */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-bold text-white">3. Festive Overlays & Effects</h4>
                  </div>
                </div>

                <p className="text-xs text-neutral-400">
                  Select celebratory floating animation particles for {editingThemeDef.name}.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'diya_sparkles', label: 'Diya Sparkles', emoji: '🪔' },
                    { id: 'confetti_stars', label: 'Confetti & Stars', emoji: '🎉' },
                    { id: 'snow_crystals', label: 'Snow Crystals', emoji: '❄️' },
                    { id: 'tricolor_ribbons', label: 'Tricolor Ribbons', emoji: '🇮🇳' },
                    { id: 'holi_colors', label: 'Holi Gulal Colors', emoji: '🎨' },
                    { id: 'marigold_petals', label: 'Marigold Petals', emoji: '🌼' },
                    { id: 'none', label: 'None (Disabled)', emoji: '🚫' },
                  ].map((overlay) => {
                    const currentSelected =
                      currentHolidayCustom.festiveOverlay || editingThemeDef.ambientEffectType;
                    const isPicked = currentSelected === overlay.id;

                    return (
                      <button
                        key={overlay.id}
                        type="button"
                        onClick={() =>
                          handleUpdateHolidayCustomization(selectedHolidayToEdit, {
                            festiveOverlay: overlay.id as AmbientEffectType,
                          })
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          isPicked
                            ? 'bg-amber-500/15 border-amber-500 text-white font-bold shadow-xs'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <span className="text-base">{overlay.emoji}</span>
                        <span className="text-xs truncate">{overlay.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Row for Customization Tab */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => handleOpenPreviewModal(selectedHolidayToEdit)}
              className="px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-white font-bold text-xs flex items-center gap-2 hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Preview On Public Homepage</span>
            </button>

            <button
              onClick={handleSaveAndSync}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-neutral-950 flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{ backgroundColor: activeThemeDef.primaryColor }}
            >
              <Save className="w-4 h-4" />
              <span>Save Changes & Sync Live</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: BANNER GREETINGS & OFFERS */}
      {activeTab === 'banner' && (
        <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Festive Announcement Banner & Offer Ads
              </h3>
              <p className="text-xs text-neutral-400">
                Customize the top website announcement greeting for {activeThemeDef.name}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner Toggle */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Enable Top Announcement Bar</p>
                <p className="text-xs text-neutral-400">Show high-visibility festive banner at top of site</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftConfig.bannerEnabled}
                  onChange={(e) => setDraftConfig((prev) => ({ ...prev, bannerEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Welcome Modal Toggle */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Welcome Festive Modal Dialog</p>
                <p className="text-xs text-neutral-400">Show celebratory greeting popup to new visitors</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftConfig.festiveModalGreetingEnabled}
                  onChange={(e) => setDraftConfig((prev) => ({ ...prev, festiveModalGreetingEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Festive Headline Greeting (Hindi or English)
              </label>
              <input
                type="text"
                value={draftConfig.customBannerGreeting ?? activeThemeDef.defaultBannerGreeting}
                onChange={(e) => setDraftConfig((prev) => ({ ...prev, customBannerGreeting: e.target.value }))}
                placeholder="E.g. 🪔 Shubh Deepawali! Festive Real Estate Dhamaka Live"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Festive Offer & Discount Subtext
              </label>
              <input
                type="text"
                value={draftConfig.customBannerSubtext ?? activeThemeDef.defaultBannerSubtext}
                onChange={(e) => setDraftConfig((prev) => ({ ...prev, customBannerSubtext: e.target.value }))}
                placeholder="E.g. 0% Brokerage + Spot Gold Coin on Token + Up to ₹5 Lakhs Builder Discounts!"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={draftConfig.customCtaText ?? activeThemeDef.defaultCtaText}
                  onChange={(e) => setDraftConfig((prev) => ({ ...prev, customCtaText: e.target.value }))}
                  placeholder="E.g. View Diwali Deals"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  CTA Destination URL
                </label>
                <input
                  type="text"
                  value={draftConfig.customCtaLink || '/properties'}
                  onChange={(e) => setDraftConfig((prev) => ({ ...prev, customCtaLink: e.target.value }))}
                  placeholder="/properties"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VISUAL & FLOATING CELEBRATION EFFECTS */}
      {activeTab === 'effects' && (
        <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-6 shadow-xl">
          <div>
            <h3 className="text-base font-bold text-white">
              Visual & Floating Celebration Effects
            </h3>
            <p className="text-xs text-neutral-400">
              Floating Diya sparkles, festive confetti, snowflakes, tricolor ribbons aur badges control karein.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ambient Particle Toggle */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Floating Ambient Celebration Particles</p>
                <p className="text-xs text-neutral-400">Subtle floating sparks, diyas, or confetti across screen</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftConfig.ambientEffectsEnabled}
                  onChange={(e) => setDraftConfig((prev) => ({ ...prev, ambientEffectsEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Festive Card Badges Toggle */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Festive Property Card Badges</p>
                <p className="text-xs text-neutral-400">Display festival tag on inventory & property listings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftConfig.festiveBadgesEnabled}
                  onChange={(e) => setDraftConfig((prev) => ({ ...prev, festiveBadgesEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Particle Intensity Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-2">
              Particle Density & Intensity
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['subtle', 'moderate', 'festive'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDraftConfig((prev) => ({ ...prev, effectIntensity: level }))}
                  className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                    draftConfig.effectIntensity === level
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {level} Mode
                </button>
              ))}
            </div>
          </div>

          {/* Card Badge Text Customizer */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Custom Card Badge Label
            </label>
            <input
              type="text"
              value={draftConfig.customBadgeText ?? activeThemeDef.defaultBadgeText}
              onChange={(e) => setDraftConfig((prev) => ({ ...prev, customBadgeText: e.target.value }))}
              placeholder="E.g. 🪔 Diwali Shubh Labh"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* TAB 5: HOLIDAY SCHEDULE TIMELINE & AUTO SCHEDULING */}
      {activeTab === 'schedule' && (
        <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Indian Holiday Schedule & Auto-Application</span>
              </h3>
              <p className="text-xs text-neutral-400">
                When enabled, the theme-provider automatically detects the active holiday from the schedule and dynamically applies banner images, color overrides, and overlays.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">Dynamic Schedule:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftConfig.autoScheduleEnabled}
                  onChange={(e) => setDraftConfig((prev) => ({ ...prev, autoScheduleEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
          </div>

          {/* Interactive Holiday Simulator */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Interactive Schedule Tester (Simulate Date)</span>
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="date"
                value={simulatedDateStr}
                onChange={(e) => handleSimulateDateChange(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-purple-500"
              />
              {simulatedMatchThemeId && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-400">Matches Holiday:</span>
                  <span className="px-2.5 py-1 rounded-lg font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    {getFestivalThemeDefinition(simulatedMatchThemeId).name}
                  </span>
                  <button
                    onClick={() => handleOpenPreviewModal(simulatedMatchThemeId)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 text-amber-300 text-xs font-bold hover:bg-neutral-700 cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Complete Indian Holidays Schedule Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Official Indian Holiday Schedule
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {INDIAN_HOLIDAY_SCHEDULE.map((item) => {
                const themeDef = getFestivalThemeDefinition(item.themeId);
                const isCurrentlyActive = getAutoScheduledThemeId() === item.themeId;

                return (
                  <div
                    key={item.themeId}
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      isCurrentlyActive
                        ? 'bg-purple-950/30 border-purple-500/60 shadow-lg'
                        : 'bg-neutral-950 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{item.name}</span>
                          {isCurrentlyActive && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-500 text-white">
                              ACTIVE CALENDAR
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {item.hindiName} • <strong>{item.dateRangeLabel}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenPreviewModal(item.themeId)}
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 text-xs font-bold border border-neutral-800 cursor-pointer"
                        title="Preview theme"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSelectTheme(item.themeId)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                      >
                        Activate
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. STICKY ACTION BAR AT BOTTOM */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4 shadow-2xl sticky bottom-4 z-40">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ backgroundColor: `${activeThemeDef.primaryColor}25` }}
          >
            {activeThemeDef.iconEmoji}
          </div>
          <div>
            <p className="text-xs font-bold text-white">
              Selected Theme: <strong style={{ color: activeThemeDef.primaryColor }}>{activeThemeDef.name}</strong>
            </p>
            <p className="text-[10px] text-neutral-400">
              Click 'Preview Theme' to view public homepage mockup before applying globally.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenPreviewModal(draftConfig.activeThemeId)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Theme</span>
          </button>
          <button
            onClick={handleSaveAndSync}
            className="px-5 py-2 rounded-xl text-xs font-bold text-neutral-950 flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{ backgroundColor: activeThemeDef.primaryColor }}
          >
            <Save className="w-4 h-4" />
            <span>Save & Sync To Website</span>
          </button>
        </div>
      </div>

      {/* 4. LIVE HOMEPAGE PREVIEW MODAL */}
      <ThemeHomepagePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        theme={getFestivalThemeDefinition(modalTargetThemeId)}
        config={draftConfig}
        customization={draftConfig.holidayCustomizations?.[modalTargetThemeId]}
        onApplyGlobally={handleApplyFromPreviewModal}
      />
    </div>
  );
}
