'use client';

import React, { useState, useEffect } from 'react';
import {
  Layout,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  Sparkles,
  Type,
  Sliders,
  Edit2,
  RotateCcw,
} from 'lucide-react';
import { CmsSectionConfig } from '@/lib/data/serverStore';

const STORAGE_KEY = 'prosify_homepage_cms';

export function HomePageCmsView() {
  const [sections, setSections] = useState<CmsSectionConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch sections from server API
  useEffect(() => {
    fetch('/api/cms/homepage', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.sections && Array.isArray(data.sections)) {
          setSections(data.sections);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.sections));
          } catch {}
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch CMS settings:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleToggle = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  const handleUpdateText = (id: string, field: 'title' | 'subtitle', value: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/cms/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });

      if (res.ok) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
          window.dispatchEvent(new Event('prosify_cms_updated'));
        } catch {}

        setToast('Homepage CMS sections and copy updated live on public website!');
        setEditingId(null);
        setTimeout(() => setToast(null), 4000);
      } else {
        setToast('Failed to save to server. Please try again.');
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      setToast('Network error while saving CMS changes.');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-400" />
            <span>Home Page CMS & Live Content Customizer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Customize headlines, subtitles, and toggle visibility for all homepage sections in real time.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving to Server...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading CMS sections...</div>
      ) : (
        <div className="space-y-3">
          {sections.map((sec, idx) => {
            const isEditing = editingId === sec.id;
            return (
              <div
                key={sec.id}
                className="p-5 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-md flex flex-col gap-4"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{sec.name}</h3>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                            sec.isEnabled
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}
                        >
                          {sec.isEnabled ? 'LIVE ON SITE' : 'HIDDEN'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {sec.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingId(isEditing ? null : sec.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{isEditing ? 'Close Editor' : 'Edit Copy'}</span>
                    </button>

                    <button
                      onClick={() => handleToggle(sec.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border cursor-pointer transition-colors ${
                        sec.isEnabled
                          ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                          : 'bg-rose-950/60 border-rose-800 text-rose-300'
                      }`}
                    >
                      {sec.isEnabled ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Inline Editing Mode */}
                {isEditing ? (
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Section Headline / Title
                      </label>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleUpdateText(sec.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                        placeholder="Enter headline..."
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Section Subtitle / Description
                      </label>
                      <textarea
                        rows={2}
                        value={sec.subtitle}
                        onChange={(e) => handleUpdateText(sec.id, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                        placeholder="Enter subtext..."
                      />
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={handleSave}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-bold text-xs"
                      >
                        Save This Section
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-300 pl-10 border-l-2 border-slate-800 space-y-0.5">
                    <div>
                      <span className="text-slate-500 font-medium">Headline: </span>
                      <strong className="text-white">{sec.title}</strong>
                    </div>
                    <p className="text-[11px] text-slate-400">{sec.subtitle}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
