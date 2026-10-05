'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Sparkles,
  MapPin,
  IndianRupee,
  Home,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Filter,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { PropertyMatch } from '@/lib/types';
import { formatIndianPrice, formatArea } from '@/lib/utils';
import { PAN_INDIA_CITIES } from '@/lib/data/store';

interface SmartMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartMatcherModal({ isOpen, onClose }: SmartMatcherModalProps) {
  const [city, setCity] = useState('Thane');
  const [propertyType, setPropertyType] = useState('APARTMENT');
  const [bhk, setBhk] = useState('2 BHK');
  const [purpose, setPurpose] = useState('Self-Use');
  const [budgetRange, setBudgetRange] = useState('12000000'); // 1.20 Cr default
  const [possession, setPossession] = useState('READY_TO_MOVE');
  const [matches, setMatches] = useState<PropertyMatch[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRunMatch = async () => {
    setLoading(true);
    try {
      const budgetNum = parseFloat(budgetRange);
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: city,
          city,
          propertyType,
          configuration: bhk,
          bhk,
          budget: budgetNum,
          minBudget: budgetNum * 0.75,
          maxBudget: budgetNum * 1.25,
          purpose,
          possessionPreference: possession,
          possessionStatus: possession,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMatches(data.data);
        setHasCalculated(true);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#171717] text-white p-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4A017] text-neutral-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>ProMatch™ AI Property Matching Engine</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D4A017]/20 text-[#D4A017] border border-[#D4A017]/40">
                  100% Data-Driven
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Calculates weighted compatibility based on budget, micro-market, configuration, and MahaRERA verification.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Controls Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Target Hub</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#D4A017]"
              >
                {PAN_INDIA_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Configuration</label>
              <select
                value={bhk}
                onChange={(e) => setBhk(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#D4A017]"
              >
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Purchase Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#D4A017]"
              >
                <option value="Self-Use">Self-Use (End User)</option>
                <option value="Investment">Capital Growth</option>
                <option value="Rental Yield">High Rental Yield</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Possession</label>
              <select
                value={possession}
                onChange={(e) => setPossession(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#D4A017]"
              >
                <option value="READY_TO_MOVE">Ready To Move</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
                <option value="NEW_LAUNCH">New Launch</option>
              </select>
            </div>

            <div className="sm:col-span-4 pt-2">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 mb-1">
                <span>Target Budget: {formatIndianPrice(parseFloat(budgetRange))}</span>
                <span className="text-neutral-500 font-normal">Range: ₹25L to ₹6 Cr</span>
              </div>
              <input
                type="range"
                min="2500000"
                max="60000000"
                step="500000"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full accent-[#D4A017] cursor-pointer"
              />
            </div>

            <div className="sm:col-span-4 pt-1">
              <button
                onClick={handleRunMatch}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#D4A017] hover:bg-[#b8890f] text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Executing ProMatch™ Algorithms...' : 'Calculate ProMatch™ Compatibility'}</span>
              </button>
            </div>
          </div>

          {/* Results List */}
          {hasCalculated && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  {matches.length} Verified Properties Evaluated
                </h4>
                <span className="text-[11px] text-neutral-500 font-mono">
                  Weights: Budget 25% | Loc 20% | Config 15% | Poss 10% | Amen 15% | ProVerify 15%
                </span>
              </div>

              {matches.length === 0 ? (
                <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-sm font-semibold text-neutral-700">No properties matching exact tolerance</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Try adjusting the budget slider or selecting a different location.
                  </p>
                </div>
              ) : (
                matches.map((item) => {
                  const scoreVal = item.matchScore ?? item.score;
                  const reasons = item.matchingReasons || [];

                  return (
                    <div
                      key={item.property.id}
                      className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-[#D4A017] transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                scoreVal >= 90
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : scoreVal >= 75
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-neutral-100 text-neutral-800'
                              }`}
                            >
                              {scoreVal}% Match
                            </span>

                            {item.property.isProVerifyCertified && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#D4A017]/15 text-[#b8890f] border border-[#D4A017]/40 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-[#D4A017]" />
                                ProVerify Certified
                              </span>
                            )}
                          </div>

                          <h5 className="font-bold text-sm text-neutral-900 line-clamp-1">
                            {item.property.title}
                          </h5>
                          <p className="text-xs text-neutral-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-400" />
                            {item.property.locality}, {item.property.city} • <strong className="text-neutral-800 font-semibold">{formatIndianPrice(item.property.price)}</strong> ({item.property.bhk})
                          </p>
                        </div>

                        <Link
                          href={`/properties/${item.property.slug}`}
                          onClick={onClose}
                          className="shrink-0 text-xs px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-[#D4A017] hover:text-neutral-950 text-white font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Explore Property</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Section 6 Why this property matches you block */}
                      {reasons.length > 0 && (
                        <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
                          <span className="font-bold text-neutral-700 block text-[11px]">
                            Why this property matches you:
                          </span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-neutral-600">
                            {reasons.map((r, rIdx) => (
                              <li key={rIdx} className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

