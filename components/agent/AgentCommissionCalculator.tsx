'use client';

import React, { useState, useMemo } from 'react';
import {
  Calculator,
  IndianRupee,
  Award,
  Sparkles,
  TrendingUp,
  Percent,
  Copy,
  Check,
  Building,
  Users,
  ShieldCheck,
  Info,
  ArrowRight,
  Receipt,
  PiggyBank,
  Share2,
} from 'lucide-react';

export interface TierConfig {
  id: string;
  name: string;
  rate: number; // percentage, e.g. 2.0, 2.5
  description: string;
  minDealVolume: number; // in INR
  badgeColor: string;
  accentBg: string;
  borderColor: string;
}

export const AGENT_TIERS: TierConfig[] = [
  {
    id: 'silver',
    name: 'Silver Partner',
    rate: 2.0,
    description: 'Standard starting tier for registered MahaRERA channel partners',
    minDealVolume: 0,
    badgeColor: 'text-slate-300 bg-slate-700/50 border-slate-600',
    accentBg: 'from-slate-800/80 to-slate-900/90',
    borderColor: 'border-slate-700',
  },
  {
    id: 'gold',
    name: 'Gold Associate',
    rate: 2.5,
    description: 'Preferred volume partner with priority developer desk escalation',
    minDealVolume: 25000000, // 2.5 Cr
    badgeColor: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
    accentBg: 'from-amber-950/30 to-slate-900/90',
    borderColor: 'border-amber-500/40',
  },
  {
    id: 'platinum',
    name: 'Platinum Prime',
    rate: 3.0,
    description: 'High-performing closer tier with quarterly direct builder incentives',
    minDealVolume: 75000000, // 7.5 Cr
    badgeColor: 'text-sky-300 bg-sky-500/20 border-sky-500/40',
    accentBg: 'from-sky-950/30 to-slate-900/90',
    borderColor: 'border-sky-500/40',
  },
  {
    id: 'diamond',
    name: 'Diamond MahaRERA Elite',
    rate: 3.5,
    description: 'Maximum commission slab for enterprise channel networks & top closers',
    minDealVolume: 150000000, // 15 Cr
    badgeColor: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40',
    accentBg: 'from-emerald-950/30 to-slate-900/90',
    borderColor: 'border-emerald-500/40',
  },
];

const PRESET_VALUES = [
  { label: '₹60 Lakh', value: 6000000 },
  { label: '₹1.25 Cr', value: 12500000 },
  { label: '₹2.50 Cr', value: 25000000 },
  { label: '₹5.00 Cr', value: 50000000 },
  { label: '₹10.00 Cr', value: 100000000 },
];

export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (amount >= 100000) {
    const l = amount / 100000;
    return `₹${l.toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

interface AgentCommissionCalculatorProps {
  initialPropertyPrice?: number;
  currentAgentTier?: string;
  onEstimateCalculated?: (estimate: {
    propertyValue: number;
    tier: string;
    rate: number;
    grossCommission: number;
    tdsAmount: number;
    netPayable: number;
  }) => void;
}

export function AgentCommissionCalculator({
  initialPropertyPrice = 15000000, // ₹1.5 Cr default
  currentAgentTier = 'gold',
  onEstimateCalculated,
}: AgentCommissionCalculatorProps) {
  const [propertyValue, setPropertyValue] = useState<number>(initialPropertyPrice);
  const [selectedTierId, setSelectedTierId] = useState<string>(currentAgentTier);
  const [splitOption, setSplitOption] = useState<'100' | '50' | '70' | 'custom'>('100');
  const [customAgentSplitPercent, setCustomAgentSplitPercent] = useState<number>(80);
  const [dealType, setDealType] = useState<'NEW_BOOKING' | 'RE_SALE' | 'COMMERCIAL'>('NEW_BOOKING');
  const [gstApplicable, setGstApplicable] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  // Selected Tier object
  const activeTier = useMemo(() => {
    return AGENT_TIERS.find((t) => t.id === selectedTierId) || AGENT_TIERS[1];
  }, [selectedTierId]);

  // Deal type base multiplier/rate bonus if applicable
  const dealMultiplier = dealType === 'COMMERCIAL' ? 1.0 : dealType === 'RE_SALE' ? 0.95 : 1.0;

  // Active Rate
  const effectiveCommissionRate = Number((activeTier.rate * dealMultiplier).toFixed(2));

  // Split calculation
  const agentSharePercentage = useMemo(() => {
    if (splitOption === '100') return 100;
    if (splitOption === '50') return 50;
    if (splitOption === '70') return 70;
    return Math.max(1, Math.min(100, customAgentSplitPercent));
  }, [splitOption, customAgentSplitPercent]);

  // Core Financials
  const calculations = useMemo(() => {
    // 1. Total Gross Commission
    const grossTotal = Math.round((propertyValue * effectiveCommissionRate) / 100);

    // 2. Agent's Gross Cut after co-brokerage split
    const agentGrossCut = Math.round((grossTotal * agentSharePercentage) / 100);
    const coBrokerShare = grossTotal - agentGrossCut;

    // 3. Section 194H TDS Deduction (5% for Registered Channel Partners with PAN)
    const tdsAmount = Math.round((agentGrossCut * 5) / 100);

    // 4. GST 18% Output Invoice Value (Applicable if GST registered entity)
    const gstAmount = gstApplicable ? Math.round((agentGrossCut * 18) / 100) : 0;
    const grossInvoiceValue = agentGrossCut + gstAmount;

    // 5. Net Bank Disbursable
    const netDisbursable = agentGrossCut - tdsAmount;

    return {
      grossTotal,
      agentGrossCut,
      coBrokerShare,
      tdsAmount,
      gstAmount,
      grossInvoiceValue,
      netDisbursable,
    };
  }, [propertyValue, effectiveCommissionRate, agentSharePercentage, gstApplicable]);

  // Milestone to Next Tier
  const nextTier = useMemo(() => {
    const currentIndex = AGENT_TIERS.findIndex((t) => t.id === selectedTierId);
    if (currentIndex >= 0 && currentIndex < AGENT_TIERS.length - 1) {
      return AGENT_TIERS[currentIndex + 1];
    }
    return null;
  }, [selectedTierId]);

  const handleCopyQuote = () => {
    const quoteText = `-------------------------------------------
PROSIFY MAHARASHTRA AGENT COMMISSION ESTIMATE
-------------------------------------------
Property Valuation: ${formatIndianCurrency(propertyValue)} (₹${formatIndianNumber(propertyValue)})
Deal Type: ${dealType.replace('_', ' ')}
Agent Tier: ${activeTier.name} (${effectiveCommissionRate}% Commission Slab)
Co-Broker Split: ${agentSharePercentage}% to Agent (${splitOption === '100' ? 'Solo Deal' : 'Co-Broker Shared'})

FINANCIAL BREAKDOWN:
• Total Developer Payout: ${formatIndianCurrency(calculations.grossTotal)}
• Agent Gross Commission: ${formatIndianCurrency(calculations.agentGrossCut)}
• Statutory TDS Deduction (Sec 194H @ 5%): -${formatIndianCurrency(calculations.tdsAmount)}
${gstApplicable ? `• GST 18% Invoice Add-on: +${formatIndianCurrency(calculations.gstAmount)}\n` : ''}
-------------------------------------------
NET DIRECT DISBURSABLE TO BANK: ${formatIndianCurrency(calculations.netDisbursable)}
-------------------------------------------
Verified via Prosify Agent CRM (MahaRERA Regulated)`;

    navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    if (onEstimateCalculated) {
      onEstimateCalculated({
        propertyValue,
        tier: activeTier.id,
        rate: effectiveCommissionRate,
        grossCommission: calculations.agentGrossCut,
        tdsAmount: calculations.tdsAmount,
        netPayable: calculations.netDisbursable,
      });
    }
  };

  return (
    <div className="bg-[#1E293B]/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 sm:p-7 text-white shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/70">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Deal Commission &amp; Earnings Calculator
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Interactive
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Input property agreement value and active tier to project net bank disbursable earnings with MahaRERA TDS deductions.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyQuote}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-xs shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Quote Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-400" />
              <span>Copy Deal Quote</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Input Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Property Agreement Value Slider & Numeric Input */}
          <div className="bg-[#0B1120]/80 rounded-xl p-4 sm:p-5 border border-slate-700/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>Property Agreement Value (INR)</span>
              </label>

              <div className="flex items-center gap-1.5 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-xs font-bold text-emerald-400">₹</span>
                <input
                  type="number"
                  min={1000000}
                  max={250000000}
                  step={500000}
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value) || 0)}
                  className="bg-transparent text-sm sm:text-base font-extrabold text-white w-28 sm:w-36 focus:outline-none text-right font-mono"
                />
              </div>
            </div>

            {/* Range Slider */}
            <div>
              <input
                type="range"
                min={2000000} // 20 Lakhs
                max={250000000} // 25 Crores
                step={500000} // 5 Lakh steps
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1.5">
                <span>₹20 Lakh</span>
                <span className="text-emerald-400 font-bold">{formatIndianCurrency(propertyValue)}</span>
                <span>₹25 Crore</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Presets:</span>
              {PRESET_VALUES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setPropertyValue(preset.value)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                    propertyValue === preset.value
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Agent Tier Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Select Your Channel Partner Tier</span>
              </label>
              <span className="text-xs font-bold text-emerald-400">
                Current Slab: {activeTier.rate}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AGENT_TIERS.map((tier) => {
                const isSelected = selectedTierId === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`relative p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? `bg-slate-800/90 ${tier.borderColor} ring-2 ring-emerald-500/30 shadow-md`
                        : 'bg-[#0B1120]/60 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{tier.name}</span>
                          <span
                            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${tier.badgeColor}`}
                          >
                            {tier.rate}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {tier.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deal Category & Co-broker Split Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Deal Type */}
            <div className="bg-[#0B1120]/80 p-3.5 rounded-xl border border-slate-700/70 space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-sky-400" />
                <span>Deal Classification</span>
              </label>
              <select
                value={dealType}
                onChange={(e) => setDealType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="NEW_BOOKING">Direct Builder New Launch (100% Rate)</option>
                <option value="COMMERCIAL">Commercial / Office Floor (Standard Rate)</option>
                <option value="RE_SALE">Secondary Resale Mandate (Standard Net)</option>
              </select>
            </div>

            {/* Split Option */}
            <div className="bg-[#0B1120]/80 p-3.5 rounded-xl border border-slate-700/70 space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Co-Brokerage Split</span>
              </label>
              <select
                value={splitOption}
                onChange={(e) => setSplitOption(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="100">100% Solo Deal (Full Commission to You)</option>
                <option value="50">50-50 Equal Split (Two Channel Partners)</option>
                <option value="70">70-30 Team Lead Cut (70% to You)</option>
                <option value="custom">Custom Split %</option>
              </select>
            </div>
          </div>

          {splitOption === 'custom' && (
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-300 font-medium">Your Direct Take-Home Split:</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={10}
                  max={95}
                  value={customAgentSplitPercent}
                  onChange={(e) => setCustomAgentSplitPercent(Number(e.target.value))}
                  className="w-28 sm:w-36 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-xs font-bold text-emerald-400 font-mono w-10 text-right">
                  {customAgentSplitPercent}%
                </span>
              </div>
            </div>
          )}

          {/* Statutory TDS Checkbox */}
          <div className="flex items-center justify-between bg-[#0B1120]/40 p-3 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200">Include GST 18% Output Invoice Add-on</span>
                <p className="text-[10px] text-slate-400">For GST-registered firms claiming input tax credit</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={gstApplicable}
                onChange={(e) => setGstApplicable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* Right Column: Earnings & Disbursable Metrics Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-[#0B1120] to-slate-900 p-5 sm:p-6 rounded-2xl border border-emerald-500/40 shadow-xl relative overflow-hidden">
            {/* Top Glow Accent */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <PiggyBank className="w-4 h-4 text-emerald-400" />
                <span>Projected Earnings Summary</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                {activeTier.name}
              </span>
            </div>

            {/* Big Disbursable Stat */}
            <div className="py-4">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Net Direct Bank Disbursable
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight mt-1 flex items-baseline gap-1">
                <span>{formatIndianCurrency(calculations.netDisbursable)}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Post 5% Section 194H TDS deduction</span>
              </div>
            </div>

            {/* Line Item Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Total Gross Developer Payout:</span>
                <span className="font-bold text-white">{formatIndianCurrency(calculations.grossTotal)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Your Share ({agentSharePercentage}% cut):</span>
                <span className="font-bold text-emerald-300">{formatIndianCurrency(calculations.agentGrossCut)}</span>
              </div>

              {calculations.coBrokerShare > 0 && (
                <div className="flex items-center justify-between text-slate-400">
                  <span>Co-broker / Team Cut:</span>
                  <span className="text-amber-400 font-medium">-{formatIndianCurrency(calculations.coBrokerShare)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-rose-400">
                <span className="flex items-center gap-1">
                  <span>MahaRERA TDS (Sec 194H @ 5%):</span>
                  <Info className="w-3 h-3 text-slate-500" />
                </span>
                <span className="font-bold">-{formatIndianCurrency(calculations.tdsAmount)}</span>
              </div>

              {gstApplicable && (
                <div className="flex items-center justify-between text-sky-400">
                  <span>GST 18% Output Invoice:</span>
                  <span className="font-bold">+{formatIndianCurrency(calculations.gstAmount)}</span>
                </div>
              )}

              {gstApplicable && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-bold text-slate-200">
                  <span>Gross Invoice Total:</span>
                  <span className="text-white">{formatIndianCurrency(calculations.grossInvoiceValue)}</span>
                </div>
              )}
            </div>

            {/* Next Tier Upgrade Incentive */}
            {nextTier && (
              <div className="mt-5 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Next Milestone: {nextTier.name} ({nextTier.rate}%)</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    Requires {formatIndianCurrency(nextTier.minDealVolume)}
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((propertyValue / nextTier.minDealVolume) * 100))}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Closing this deal contributes{' '}
                  <span className="text-emerald-400 font-bold">
                    {Math.min(100, Math.round((propertyValue / nextTier.minDealVolume) * 100))}%
                  </span>{' '}
                  towards unlocking the higher {nextTier.rate}% slab!
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions Footer */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyQuote}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Estimate Copied to Clipboard!' : 'Export & Share Estimate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
