'use client';

import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  RefreshCw,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Copy,
  Sliders,
  Check,
  Building2,
  DollarSign,
  Compass,
} from 'lucide-react';
import { ImportValidationReport, ImportFieldMapping } from '@/lib/types';

interface CsvImportWizardProps {
  onSuccess?: () => void;
  projectId?: string;
}

const SAMPLE_CSV = `Flat No,BHK,Floor,Carpet Area,Price,Tower,Status,Facing
A-301,2 BHK,3,720,8600000,Tower Aqua,AVAILABLE,East
A-302,2 BHK,3,720,8600000,Tower Aqua,HOLD,West
A-303,3 BHK,3,1050,13200000,Tower Aqua,AVAILABLE,North-East
A-401,2 BHK,4,720,8750000,Tower Aqua,AVAILABLE,East
A-402,3 BHK,4,1050,13500000,Tower Aqua,AVAILABLE,West
B-201,1 BHK,2,480,5100000,Tower Breeze,AVAILABLE,North
B-202,1 BHK,2,480,5100000,Tower Breeze,BOOKED,East
B-301,2 BHK,3,690,7900000,Tower Breeze,AVAILABLE,South-East`;

const TARGET_FIELDS = [
  { field: 'unitNumber', label: 'Unit / Flat Number', required: true },
  { field: 'price', label: 'Agreement Value / Price', required: true },
  { field: 'carpetArea', label: 'RERA Carpet Area (sq.ft)', required: true },
  { field: 'bhk', label: 'BHK Configuration', required: true },
  { field: 'floor', label: 'Floor Level', required: false },
  { field: 'tower', label: 'Tower / Wing', required: false },
  { field: 'status', label: 'Inventory Status', required: false },
  { field: 'facing', label: 'Vastu / Facing', required: false },
];

export function CsvImportWizard({ onSuccess, projectId = 'proj-1' }: CsvImportWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [csvContent, setCsvContent] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const [loading, setLoading] = useState(false);
  const [validationReport, setValidationReport] = useState<ImportValidationReport | null>(null);
  const [customMappings, setCustomMappings] = useState<Record<string, string>>({});
  const [duplicateStrategy, setDuplicateStrategy] = useState<'SKIP' | 'OVERWRITE'>('SKIP');
  const [commitResult, setCommitResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoadSample = () => {
    setCsvContent(SAMPLE_CSV);
    setErrorMsg('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvContent(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  // Run Pre-Import Validation & Smart Field Mapping
  const handleRunValidation = async () => {
    if (!csvContent.trim()) {
      setErrorMsg('Please paste or upload CSV/Excel data first');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/import/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvText: csvContent,
          projectId: selectedProjectId,
          defaultTower: 'Tower Aqua',
          customMapping: customMappings,
          mode: 'VALIDATE',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setValidationReport(data.report);

        // Seed initial detected mappings
        const initialMap: Record<string, string> = { ...customMappings };
        data.report.detectedMappings.forEach((m: ImportFieldMapping) => {
          if (!initialMap[m.targetField]) {
            initialMap[m.targetField] = m.sourceColumn;
          }
        });
        setCustomMappings(initialMap);

        setStep(2);
      } else {
        setErrorMsg(data.error?.message || 'Validation failed');
      }
    } catch {
      setErrorMsg('Network error while running pre-import validation');
    } finally {
      setLoading(false);
    }
  };

  // Commit Import with Chosen Strategy
  const handleCommitImport = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/import/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvText: csvContent,
          projectId: selectedProjectId,
          defaultTower: 'Tower Aqua',
          customMapping: customMappings,
          mode: 'COMMIT',
          strategy: duplicateStrategy,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCommitResult(data);
        setStep(3);
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(data.error?.message || 'Failed to commit inventory import');
      }
    } catch {
      setErrorMsg('Network error while executing import commit');
    } finally {
      setLoading(false);
    }
  };

  const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const detectedHeaders =
    lines[0]?.includes('\t')
      ? lines[0].split('\t').map((h) => h.trim().replace(/^["']|["']$/g, ''))
      : lines[0]?.split(',').map((h) => h.trim().replace(/^["']|["']$/g, '')) || [];

  return (
    <div className="bg-[#1E293B] rounded-2xl border border-slate-700 p-6 shadow-xl space-y-6 text-slate-200">
      {/* Wizard Header & Step Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#10B981]" />
            <span>Developer CSV & Excel Inventory Import Wizard</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Smart field mapping, pre-import syntax validation, duplicate collision detection & delta reconciliation
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span
            className={`px-3 py-1 rounded-xl transition-all ${
              step === 1
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            1. Data Source
          </span>
          <span className="text-slate-600">→</span>
          <span
            className={`px-3 py-1 rounded-xl transition-all ${
              step === 2
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            2. Smart Mapping & Duplicates
          </span>
          <span className="text-slate-600">→</span>
          <span
            className={`px-3 py-1 rounded-xl transition-all ${
              step === 3
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            3. Summary Report
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Upload / Input */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span>Paste CSV / Excel Tab-Delimited Data</span>
                  <span className="text-slate-400 font-normal">({lines.length > 0 ? `${lines.length - 1} rows detected` : 'Empty'})</span>
                </label>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 hover:bg-slate-750 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Load Sample CSV</span>
                </button>
              </div>

              <textarea
                rows={9}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="Flat No,BHK,Floor,Carpet Area,Price,Tower,Status&#10;A-101,2 BHK,1,650,7500000,Tower A,AVAILABLE"
                className="w-full p-3.5 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Target Project Inventory *
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="proj-1">Godrej Ascend, Kolshet Road</option>
                  <option value="proj-2">Lodha Bellagio, Powai</option>
                  <option value="proj-3">Piramal Mahalaxmi, South Mumbai</option>
                  <option value="proj-4">Hiranandani Fortune City, Panvel</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Units will be reconciled against this project&apos;s master unit registry.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Automated Validations</span>
                </h4>
                <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                  <li>Carpet area &gt; 0 sq.ft verification</li>
                  <li>Agreement value INR numerical parser</li>
                  <li>Duplicate tower & unit number conflict test</li>
                  <li>RERA mandatory fields enforcement</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".csv,.txt,.tsv"
                id="csvFileInput"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="csvFileInput"
                className="text-xs px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 cursor-pointer font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload .CSV / Excel File</span>
              </label>
              <span className="text-xs text-slate-400">Supported: Comma or Tab separated text</span>
            </div>

            <button
              type="button"
              disabled={!csvContent.trim() || loading}
              onClick={handleRunValidation}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validating Rows...</span>
                </>
              ) : (
                <>
                  <span>Next: Smart Mapping & Duplicates</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Smart Field Mapping & Duplicate Resolution */}
      {step === 2 && validationReport && (
        <div className="space-y-6 animate-in fade-in">
          {/* Validation Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Total Data Rows</span>
              <strong className="text-lg font-mono text-white font-bold">{validationReport.totalRows}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-emerald-400 block text-[11px]">Valid Syntax</span>
              <strong className="text-lg font-mono text-emerald-400 font-bold">{validationReport.validRows}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-amber-400 block text-[11px]">Duplicates Identified</span>
              <strong className="text-lg font-mono text-amber-400 font-bold">{validationReport.duplicatesFound}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-rose-400 block text-[11px]">Validation Errors</span>
              <strong className="text-lg font-mono text-rose-400 font-bold">{validationReport.invalidRows}</strong>
            </div>
          </div>

          {/* Validation Error Notices if any */}
          {validationReport.errors && validationReport.errors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-2">
              <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Validation Notices ({validationReport.errors.length} rows will be skipped):</span>
              </h4>
              <div className="max-h-32 overflow-y-auto space-y-1 text-xs font-mono text-rose-300/90 divide-y divide-rose-900/40">
                {validationReport.errors.map((err, idx) => (
                  <div key={idx} className="pt-1 flex items-center justify-between">
                    <span>Row {err.row} [{err.field}]: {err.error}</span>
                    <span className="text-rose-400/60 text-[10px]">Value: &quot;{err.rawValue}&quot;</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Field Mapping Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Smart Field Mapping Engine</span>
              </h4>
              <span className="text-[11px] text-slate-400">Auto-detected via semantic aliases</span>
            </div>

            <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Target Field</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Mapped CSV Column</th>
                    <th className="py-2.5 px-3 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {TARGET_FIELDS.map((tf) => {
                    const detected = validationReport.detectedMappings.find((m) => m.targetField === tf.field);
                    const currentSelected = customMappings[tf.field] || detected?.sourceColumn || '';
                    const confidence = detected?.confidence || 100;

                    return (
                      <tr key={tf.field} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-white">
                          <div className="flex items-center gap-1.5">
                            <span>{tf.label}</span>
                            {tf.required && <span className="text-rose-400 font-bold">*</span>}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          {currentSelected ? (
                            <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                              <Check className="w-3 h-3" /> Mapped
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Unmapped</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <select
                            value={currentSelected}
                            onChange={(e) =>
                              setCustomMappings({ ...customMappings, [tf.field]: e.target.value })
                            }
                            className="w-full max-w-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                          >
                            <option value="">-- Select Column --</option>
                            {detectedHeaders.map((header) => (
                              <option key={header} value={header}>
                                {header}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                              confidence >= 95
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            }`}
                          >
                            {confidence}% Match
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Duplicate Detection & Strategy Selection */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Duplicate Collision Handling Strategy</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {validationReport.duplicatesFound > 0
                    ? `Found ${validationReport.duplicatesFound} matching units already present in current project inventory.`
                    : 'No existing inventory duplicates detected in this file.'}
                </p>
              </div>

              {/* Strategy Selector Buttons */}
              <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setDuplicateStrategy('SKIP')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    duplicateStrategy === 'SKIP'
                      ? 'bg-slate-700 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Skip Duplicates
                </button>
                <button
                  type="button"
                  onClick={() => setDuplicateStrategy('OVERWRITE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    duplicateStrategy === 'OVERWRITE'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Overwrite & Update
                </button>
              </div>
            </div>

            {/* If duplicates exist, display side-by-side comparison table */}
            {validationReport.duplicateRows && validationReport.duplicateRows.length > 0 && (
              <div className="border border-slate-800 rounded-xl overflow-x-auto max-h-48">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 sticky top-0">
                    <tr>
                      <th className="py-2 px-3">Unit Number</th>
                      <th className="py-2 px-3">Tower</th>
                      <th className="py-2 px-3">Existing DB Price</th>
                      <th className="py-2 px-3">New CSV Price</th>
                      <th className="py-2 px-3">Existing Status</th>
                      <th className="py-2 px-3">New Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                    {validationReport.duplicateRows.map((dup, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 text-white font-bold">{dup.unitNumber}</td>
                        <td className="py-2 px-3 text-slate-300">{dup.tower}</td>
                        <td className="py-2 px-3 text-slate-400">₹{(dup.existingPrice / 100000).toFixed(2)}L</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">₹{(dup.newPrice / 100000).toFixed(2)}L</td>
                        <td className="py-2 px-3 text-slate-400">{dup.existingStatus}</td>
                        <td className="py-2 px-3 text-cyan-300">{dup.newStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="text-xs px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-750 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to File</span>
            </button>

            <button
              onClick={handleCommitImport}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Committing Changes...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Commit Import ({duplicateStrategy === 'OVERWRITE' ? 'Update & Create' : 'Create New Only'})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Ingestion Report */}
      {step === 3 && commitResult && (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-6 bg-emerald-950/40 rounded-2xl border border-emerald-500/40 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white">
              Inventory Import Executed Successfully
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Master repository has reconciled inventory with strategy: <strong className="text-emerald-400">{commitResult.strategy}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Total Rows</span>
              <strong className="text-xl font-bold font-mono text-white">
                {commitResult.report?.totalRows || 0}
              </strong>
            </div>
            <div className="p-4 bg-emerald-950/50 rounded-xl border border-emerald-800/60">
              <span className="text-emerald-400 block text-[11px]">New Units Created</span>
              <strong className="text-xl font-bold font-mono text-emerald-400">
                +{commitResult.createdCount || 0}
              </strong>
            </div>
            <div className="p-4 bg-cyan-950/50 rounded-xl border border-cyan-800/60">
              <span className="text-cyan-400 block text-[11px]">Existing Units Updated</span>
              <strong className="text-xl font-bold font-mono text-cyan-400">
                {commitResult.updatedCount || 0}
              </strong>
            </div>
            <div className="p-4 bg-amber-950/50 rounded-xl border border-amber-800/60">
              <span className="text-amber-400 block text-[11px]">Duplicates Handled</span>
              <strong className="text-xl font-bold font-mono text-amber-400">
                {commitResult.duplicatesSkipped || commitResult.updatedCount || 0}
              </strong>
            </div>
          </div>

          <div className="pt-3 text-center flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setStep(1);
                setCsvContent('');
                setValidationReport(null);
                setCommitResult(null);
              }}
              className="text-xs px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              Import Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
