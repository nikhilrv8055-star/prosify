'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  X,
  Copy,
  Check,
  Terminal,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

interface APKInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function APKInstallModal({ isOpen, onClose }: APKInstallModalProps) {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (!isOpen) return null;

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-ybropz42nbfxkecc7l6thr-684722435546.asia-southeast1.run.app';

  const pwabuilderUrl = `https://www.pwabuilder.com/?url=${encodeURIComponent(currentUrl)}`;

  const bubblewrapCommand = `npm install -g @bubblewrap/cli
bubblewrap init --manifest="${currentUrl}/manifest.json"
bubblewrap build`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {}
  };

  const handleCopyCli = async () => {
    try {
      await navigator.clipboard.writeText(bubblewrapCommand);
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2500);
    } catch {}
  };

  const handleDirectInstall = async () => {
    setInstalling(true);
    try {
      await install();
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 text-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D4A017]/15 border border-[#D4A017]/30 flex items-center justify-center text-[#D4A017]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Prosify Android APK & Web App
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Install as Android App or Generate Signed .APK File
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status Banner */}
          {isInstalled ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-emerald-300">App Already Installed</p>
                <p className="text-neutral-400">
                  Prosify is currently running as an installed native WebAPK on your device.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#D4A017]/10 border border-[#D4A017]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#D4A017] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Method 1: Direct Android WebAPK Install
                </span>
                <p className="text-xs text-neutral-300">
                  Android Chrome / Edge browser automatically compiles and installs a native WebAPK directly onto your device.
                </p>
              </div>
              {isInstallable ? (
                <button
                  type="button"
                  onClick={handleDirectInstall}
                  disabled={installing}
                  className="px-4 py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 text-xs font-bold shrink-0 shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {installing ? 'Installing...' : 'Install WebAPK'}
                </button>
              ) : (
                <div className="text-[11px] text-neutral-400 bg-neutral-950/60 px-3 py-2 rounded-lg border border-neutral-800 shrink-0">
                  {isAndroid ? 'Tap Chrome ⋮ Menu → "Install app"' : 'Open in Android Chrome to 1-Click Install'}
                </div>
              )}
            </div>
          )}

          {/* Method 2: PWABuilder APK Generator */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                Method 2: 1-Click APK Generator (PWABuilder)
              </span>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-medium">
                Free & Instant .apk
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Microsoft & Google backed <strong>PWABuilder</strong> automatically converts this live PWA into a production-ready signed Android package (<code className="text-[#D4A017]">.apk</code> / <code className="text-[#D4A017]">.aab</code>) for direct device installation or Google Play Store deployment.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href={pwabuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>Open PWABuilder & Generate APK</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Copied URL!' : 'Copy App URL'}</span>
              </button>
            </div>
          </div>

          {/* Method 3: Google Bubblewrap CLI for Developers */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Method 3: Google Bubblewrap CLI (Terminal)
              </span>
              <button
                type="button"
                onClick={handleCopyCli}
                className="text-[11px] text-[#D4A017] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedCli ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCli ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>
            <pre className="p-3 bg-black/60 rounded-lg text-[11px] font-mono text-neutral-300 overflow-x-auto border border-neutral-800/80 select-all">
              {bubblewrapCommand}
            </pre>
            <p className="text-[11px] text-neutral-400">
              Builds a standalone Android Studio Trusted Web Activity (TWA) APK using Android SDK.
            </p>
          </div>

          {/* Hindi Instructions / FAQs */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-neutral-300 font-semibold">
              <Info className="w-4 h-4 text-[#D4A017]" />
              <span>Android Phone me Kaise Chalayein? (Instructions)</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1.5 text-[12px] text-neutral-300">
              <li>
                <strong>Android Chrome par kholein:</strong> Apne Android phone ke Google Chrome browser me is website ko open karein.
              </li>
              <li>
                <strong>Install App:</strong> Chrome ke top right <strong>⋮ (Menu)</strong> par tap karke <strong>&quot;Install app&quot;</strong> ya <strong>&quot;Add to Home screen&quot;</strong> par click karein. Android background me turant <strong>WebAPK</strong> generate karke phone me install kar dega.
              </li>
              <li>
                <strong>Direct .APK file:</strong> Agar aapko independent <code className="text-[#D4A017]">.apk</code> file download karni hai, toh upar diye gaye <strong>PWABuilder</strong> button par tap karein aur &quot;Build Android Package&quot; par click karein.
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
          <span>Web Manifest: Compliant (192px / 512px / Maskable)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
