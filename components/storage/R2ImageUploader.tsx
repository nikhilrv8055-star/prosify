'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  X,
  FileImage,
  Server,
  Zap,
} from 'lucide-react';
import { useBrandSettings, saveCachedBrandSettings } from '@/lib/data/useBrandSettings';

interface R2ImageUploaderProps {
  isLogoUploader?: boolean;
  uploadType?: 'logo' | 'property' | 'banner' | 'general';
  currentImageUrl?: string;
  onUploadComplete?: (result: {
    r2Key: string;
    mediaUrl: string;
    bucket: string;
    filename: string;
  }) => void;
  label?: string;
  description?: string;
  className?: string;
}

export function R2ImageUploader({
  isLogoUploader = true,
  uploadType = 'logo',
  currentImageUrl,
  onUploadComplete,
  label,
  description,
  className = '',
}: R2ImageUploaderProps) {
  const brandSettings = useBrandSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || (isLogoUploader ? brandSettings.logoUrl || null : null)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<'server_r2' | 'presigned_r2'>('server_r2');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    key: string;
    bucket: string;
    folder: string;
    mediaUrl: string;
    sizeFormatted: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync preview with brandSettings when logo updates externally
  useEffect(() => {
    if (isLogoUploader && brandSettings.logoUrl && !selectedFile) {
      setPreviewUrl(brandSettings.logoUrl);
    }
  }, [isLogoUploader, brandSettings.logoUrl, selectedFile]);

  const validateFile = (file: File): string | null => {
    const validTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/svg+xml',
      'image/gif',
    ];
    if (!validTypes.includes(file.type)) {
      return 'Invalid file format. Please select a PNG, JPG, WEBP, SVG, or GIF image.';
    }
    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds 10MB limit.`;
    }
    return null;
  };

  const handleFileSelection = (file: File) => {
    setErrorMessage(null);
    setSuccessInfo(null);

    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      return;
    }

    setSelectedFile(file);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // Auto-trigger upload immediately upon selection for seamless UX
    uploadFileToR2(file);
  };

  const uploadFileToR2 = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(15);
    setErrorMessage(null);

    try {
      if (uploadMethod === 'server_r2') {
        // Method A: Direct Server R2 Upload (Atomic & Reliable)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', uploadType);
        formData.append('isWebsiteLogo', String(isLogoUploader));
        formData.append('brandName', brandSettings.agencyName || 'Prosify');

        setUploadProgress(45);

        const res = await fetch('/api/r2/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        setUploadProgress(90);

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to upload image to Cloudflare R2');
        }

        const uploadedMediaUrl = data.mediaUrl;
        const newLogoUrl = data.universalLogoUrl || uploadedMediaUrl;

        setSuccessInfo({
          key: data.key,
          bucket: data.bucket || 'prosify',
          folder: data.folder || 'Photos/',
          mediaUrl: newLogoUrl,
          sizeFormatted: data.fileInfo?.sizeFormatted || `${(file.size / 1024).toFixed(1)} KB`,
        });

        setPreviewUrl(newLogoUrl);
        setUploadProgress(100);

        // Update brand state and localStorage for instant refresh persistence
        if (isLogoUploader && data.settings) {
          saveCachedBrandSettings(data.settings);
        }

        if (onUploadComplete) {
          onUploadComplete({
            r2Key: data.key,
            mediaUrl: newLogoUrl,
            bucket: data.bucket || 'prosify',
            filename: file.name,
          });
        }
      } else {
        // Method B: Presigned PUT URL Direct to Cloudflare R2 via @aws-sdk/s3-request-presigner
        setUploadProgress(25);
        const presignedRes = await fetch('/api/r2/presigned-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            type: uploadType,
            isWebsiteLogo: isLogoUploader,
          }),
        });

        const presignedData = await presignedRes.json();
        if (!presignedRes.ok || !presignedData.success) {
          throw new Error(presignedData.error || 'Could not generate R2 presigned URL');
        }

        setUploadProgress(60);

        // PUT directly to Cloudflare R2 S3 endpoint
        const uploadDirect = await fetch(presignedData.presignedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!uploadDirect.ok) {
          throw new Error(`Direct R2 upload failed with HTTP status ${uploadDirect.status}`);
        }

        setUploadProgress(85);

        // Confirm upload on backend to register settings
        const confirmRes = await fetch('/api/r2/presigned-url', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: presignedData.key,
            filename: file.name,
            isWebsiteLogo: isLogoUploader,
            brandName: brandSettings.agencyName,
          }),
        });
        const confirmData = await confirmRes.json();

        setSuccessInfo({
          key: presignedData.key,
          bucket: presignedData.bucket || 'prosify',
          folder: presignedData.folder || 'Photos/',
          mediaUrl: presignedData.targetMediaUrl,
          sizeFormatted: `${(file.size / 1024).toFixed(1)} KB`,
        });

        setPreviewUrl(presignedData.targetMediaUrl);
        setUploadProgress(100);

        if (isLogoUploader && confirmData.settings) {
          saveCachedBrandSettings(confirmData.settings);
        }

        if (onUploadComplete) {
          onUploadComplete({
            r2Key: presignedData.key,
            mediaUrl: presignedData.targetMediaUrl,
            bucket: presignedData.bucket || 'prosify',
            filename: file.name,
          });
        }
      }
    } catch (err: any) {
      console.error('R2 upload execution error:', err);
      setErrorMessage(err.message || 'Network error while uploading to Cloudflare R2.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleCopyUrl = () => {
    if (successInfo?.mediaUrl || previewUrl) {
      const urlToCopy = successInfo?.mediaUrl || previewUrl || '';
      const fullUrl = urlToCopy.startsWith('http')
        ? urlToCopy
        : `${window.location.origin}${urlToCopy}`;
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`bg-[#1E293B]/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 sm:p-6 text-white shadow-xl ${className}`}
    >
      {/* Header section with Cloudflare R2 Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/70">
        <div>
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-amber-400" />
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {label || (isLogoUploader ? 'Cloudflare R2 Website Logo Uploader' : 'Cloudflare R2 Media Storage')}
            </h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              R2 Bucket: prosify
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {description ||
              'Uploaded assets are instantly saved to folder "Photos/" in your Cloudflare R2 bucket and updated across the entire website.'}
          </p>
        </div>

        {/* Upload Mode Switcher (Server direct vs Presigned) */}
        <div className="flex items-center gap-1 bg-[#0B1120] p-1 rounded-xl border border-slate-700/70 text-[11px] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setUploadMethod('server_r2')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              uploadMethod === 'server_r2'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Fast direct server upload with atomic settings persistence"
          >
            Server S3 Pipeline
          </button>
          <button
            type="button"
            onClick={() => setUploadMethod('presigned_r2')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              uploadMethod === 'presigned_r2'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Direct browser-to-R2 upload using @aws-sdk/s3-request-presigner"
          >
            Presigned URL
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5">
        {/* Left: Drag & Drop Area (7 Cols) */}
        <div className="md:col-span-7 space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group select-none ${
              isDragging
                ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                : isUploading
                ? 'border-amber-500/50 bg-amber-500/5 cursor-wait'
                : 'border-slate-700 hover:border-slate-500 bg-[#0B1120]/60 hover:bg-[#0B1120]/90'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelection(e.target.files[0]);
                }
              }}
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="space-y-3 py-2 w-full max-w-xs">
                <Loader2 className="w-9 h-9 animate-spin text-amber-400 mx-auto" />
                <div className="text-xs font-bold text-amber-300">
                  Uploading to Cloudflare R2 Bucket...
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Target: prosify / Photos / {selectedFile?.name}
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">{uploadProgress}% complete</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-white">
                  Drop new logo or click to browse
                </div>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Supports <strong className="text-slate-300">PNG, JPG, SVG, WebP</strong> up to 10MB. Automatically organized in Cloudflare R2 folder <code className="text-emerald-400">Photos/</code>.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 group-hover:border-slate-500 group-hover:text-white">
                    <FileImage className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Choose File from Device</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Success Banner */}
          {successInfo && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cloudflare R2 Object Stored Successfully!</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {successInfo.sizeFormatted}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-300 bg-[#0B1120]/80 p-2 rounded-lg border border-slate-800 break-all space-y-0.5">
                <div>
                  <span className="text-slate-500">R2 Key: </span>
                  <span className="text-amber-300">{successInfo.key}</span>
                </div>
                <div>
                  <span className="text-slate-500">Bucket: </span>
                  <span className="text-sky-300">{successInfo.bucket}</span>
                </div>
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Updated universally across website, header, footer &amp; portals with refresh persistence.</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Preview & Metadata Card (5 Cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-[#0B1120]/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active Logo Preview</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Live Render
              </span>
            </div>

            {/* Preview Display Window */}
            <div className="h-32 sm:h-36 rounded-xl bg-neutral-950/80 border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden group/prev">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Website Logo"
                  className="max-h-full max-w-full object-contain drop-shadow-md transition-transform group-hover/prev:scale-105"
                />
              ) : (
                <div className="text-center text-slate-500 text-xs space-y-1">
                  <ImageIcon className="w-7 h-7 mx-auto opacity-40" />
                  <p>No custom logo uploaded</p>
                  <span className="text-[10px] text-slate-600">Default Prosify emblem active</span>
                </div>
              )}
            </div>

            {/* Storage Metadata Indicators */}
            <div className="text-[11px] font-mono space-y-1.5 text-slate-400 pt-1">
              <div className="flex justify-between items-center">
                <span>R2 Endpoint:</span>
                <span className="text-slate-300 truncate max-w-[170px]" title="https://477b7cf9388de6074251205b112c1164.r2.cloudflarestorage.com">
                  r2.cloudflarestorage.com
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bucket &amp; Folder:</span>
                <span className="text-emerald-400 font-bold">prosify / Photos /</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>S3 Compatible • Auto Sync</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Button Bar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyUrl}
              disabled={!previewUrl}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">URL Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Asset URL</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Change Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
