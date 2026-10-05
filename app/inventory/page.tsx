'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Layers,
  Building2,
  Filter,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  IndianRupee,
  Compass,
  Maximize2,
  Eye,
  MessageCircle,
  Sparkles,
  RefreshCw,
  X,
  Lock,
  Download,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { store } from '@/lib/data/store';
import { Unit, UnitStatus, Project } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import { EnquiryModal } from '@/components/marketplace/EnquiryModal';

const STATUS_CONFIG: Record<
  UnitStatus,
  { label: string; bg: string; text: string; border: string; badgeBg: string }
> = {
  AVAILABLE: {
    label: 'Available',
    bg: 'bg-emerald-500 hover:bg-emerald-600',
    text: 'text-white',
    border: 'border-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  HOLD: {
    label: 'On Hold',
    bg: 'bg-amber-500 hover:bg-amber-600',
    text: 'text-white',
    border: 'border-amber-600',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  BOOKED: {
    label: 'Booked',
    bg: 'bg-sky-500 hover:bg-sky-600',
    text: 'text-white',
    border: 'border-sky-600',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  SOLD: {
    label: 'Sold Out',
    bg: 'bg-slate-400 hover:bg-slate-500',
    text: 'text-white',
    border: 'border-slate-400',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
  },
  BLOCKED: {
    label: 'Blocked',
    bg: 'bg-rose-500 hover:bg-rose-600',
    text: 'text-white',
    border: 'border-rose-600',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

export default function InventoryPage() {
  const { toast } = useToast();
  const [syncKey, setSyncKey] = useState(0);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setSyncKey((k) => k + 1);
    });
    const handleUpdate = () => setSyncKey((k) => k + 1);
    window.addEventListener('prosify:store-updated', handleUpdate);
    return () => {
      unsub();
      window.removeEventListener('prosify:store-updated', handleUpdate);
    };
  }, []);

  const allProjects = useMemo(() => store.getProjects(), [syncKey]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(allProjects[0]?.id || 'proj-1');
  const selectedProject = useMemo(
    () => allProjects.find((p) => p.id === selectedProjectId) || allProjects[0],
    [allProjects, selectedProjectId]
  );

  const towers = useMemo(() => selectedProject?.towers || ['Tower A', 'Tower B'], [selectedProject]);
  const [selectedTower, setSelectedTower] = useState<string>(towers[0] || 'Tower A');

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [bhkFilter, setBhkFilter] = useState<string>('ALL');
  const [searchUnit, setSearchUnit] = useState<string>('');

  // Selected Unit for inspection modal
  const [inspectedUnit, setInspectedUnit] = useState<Unit | null>(null);
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  // New Unit Form State
  const [newUnitNumber, setNewUnitNumber] = useState('');
  const [newUnitFloor, setNewUnitFloor] = useState('1');
  const [newUnitBhk, setNewUnitBhk] = useState('2 BHK');
  const [newUnitArea, setNewUnitArea] = useState('750');
  const [newUnitPrice, setNewUnitPrice] = useState('8500000');
  const [newUnitFacing, setNewUnitFacing] = useState('East');

  // Load units from store with syncKey
  const allUnitsForProject = useMemo(
    () => store.getUnits(selectedProject?.id, selectedTower),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedProject?.id, selectedTower, inspectedUnit, syncKey]
  );

  // Group by floor in descending order (stacking plan)
  const floorMap = useMemo(() => {
    let filtered = [...allUnitsForProject];

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }
    if (bhkFilter !== 'ALL') {
      filtered = filtered.filter((u) => u.bhk.toLowerCase().includes(bhkFilter.toLowerCase()));
    }
    if (searchUnit.trim()) {
      filtered = filtered.filter((u) => u.unitNumber.toLowerCase().includes(searchUnit.toLowerCase()));
    }

    const map: Record<number, Unit[]> = {};
    filtered.forEach((u) => {
      if (!map[u.floor]) map[u.floor] = [];
      map[u.floor].push(u);
    });

    return Object.keys(map)
      .map(Number)
      .sort((a, b) => b - a)
      .map((floorNum) => ({
        floorNumber: floorNum,
        units: map[floorNum].sort((a, b) => a.unitNumber.localeCompare(b.unitNumber)),
      }));
  }, [allUnitsForProject, statusFilter, bhkFilter, searchUnit]);

  // Inventory stats
  const stats = useMemo(() => {
    const total = allUnitsForProject.length;
    const available = allUnitsForProject.filter((u) => u.status === 'AVAILABLE').length;
    const hold = allUnitsForProject.filter((u) => u.status === 'HOLD').length;
    const booked = allUnitsForProject.filter((u) => u.status === 'BOOKED').length;
    const sold = allUnitsForProject.filter((u) => u.status === 'SOLD').length;
    const totalValue = allUnitsForProject.reduce((acc, u) => acc + u.price, 0);

    return { total, available, hold, booked, sold, totalValue };
  }, [allUnitsForProject]);

  const handleUpdateUnitStatus = (unitId: string, newStatus: UnitStatus) => {
    const updated = store.updateUnitStatus(unitId, newStatus);
    if (updated) {
      setInspectedUnit({ ...updated });
      toast({
        title: 'Inventory Status Updated',
        description: `Unit ${updated.unitNumber} marked as ${newStatus}.`,
        type: 'success',
      });
    }
  };

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitNumber || !newUnitPrice) return;

    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      projectId: selectedProject.id,
      tower: selectedTower,
      floor: Number(newUnitFloor) || 1,
      unitNumber: newUnitNumber,
      bhk: newUnitBhk,
      configuration: `${newUnitBhk} Luxury`,
      carpetArea: Number(newUnitArea) || 750,
      builtUpArea: Math.round((Number(newUnitArea) || 750) * 1.3),
      balconyArea: 65,
      price: Number(newUnitPrice),
      parking: '1 Covered',
      facing: newUnitFacing,
      status: 'AVAILABLE',
      possession: selectedProject.possessionDate,
    };

    store.bulkImportUnits([newUnit]);
    setIsAddingUnit(false);
    setNewUnitNumber('');
    toast({
      title: 'Unit Added to Inventory',
      description: `Unit ${newUnit.unitNumber} successfully added to ${selectedTower}.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Navbar />

      {/* Header */}
      <section className="bg-[#171717] text-white py-12 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4A017]">
                <Layers className="w-4 h-4" />
                <span>Interactive Inventory Hierarchy & Stacking Matrix</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Live Project Stacking Plan
              </h1>
              <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
                Real-time unit availability matrix, floor rise premiums, carpet area audits, and instant booking reservation controls.
              </p>
            </div>

            <button
              onClick={() => setIsAddingUnit(true)}
              className="py-2.5 px-4 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Unit to Tower</span>
            </button>
          </div>

          {/* Project & Tower Selectors */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Select Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  const p = allProjects.find((proj) => proj.id === e.target.value);
                  if (p?.towers?.length) setSelectedTower(p.towers[0]);
                }}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:outline-hidden focus:ring-2 focus:ring-[#D4A017]"
              >
                {allProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.locality}, {p.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Select Tower / Wing</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {towers.map((towerName) => (
                  <button
                    key={towerName}
                    onClick={() => setSelectedTower(towerName)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      selectedTower === towerName
                        ? 'bg-[#D4A017] text-neutral-950 shadow-xs'
                        : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-700'
                    }`}
                  >
                    {towerName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Stacking Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Real-time KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-center shadow-xs">
            <span className="block text-xl font-bold text-neutral-900">{stats.total}</span>
            <span className="text-[11px] text-neutral-500 font-medium">Total Units</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-center shadow-xs">
            <span className="block text-xl font-bold text-emerald-600">{stats.available}</span>
            <span className="text-[11px] text-neutral-500 font-medium">Available</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-center shadow-xs">
            <span className="block text-xl font-bold text-amber-600">{stats.hold}</span>
            <span className="text-[11px] text-neutral-500 font-medium">On Hold</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-center shadow-xs">
            <span className="block text-xl font-bold text-sky-600">{stats.booked}</span>
            <span className="text-[11px] text-neutral-500 font-medium">Booked</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-center shadow-xs">
            <span className="block text-xl font-bold text-slate-500">{stats.sold}</span>
            <span className="text-[11px] text-neutral-500 font-medium">Sold Out</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-center shadow-xs">
            <span className="block text-xs font-bold text-[#D4A017] truncate">
              {formatIndianPrice(stats.totalValue)}
            </span>
            <span className="text-[11px] text-neutral-500 font-medium">Inventory GDV</span>
          </div>
        </div>

        {/* Legend & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Legend */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-neutral-600 mr-1">Status Legend:</span>
            {(['AVAILABLE', 'HOLD', 'BOOKED', 'SOLD'] as UnitStatus[]).map((st) => (
              <div key={st} className="flex items-center gap-1.5 text-xs font-medium">
                <span className={`w-3.5 h-3.5 rounded-sm ${STATUS_CONFIG[st].bg}`} />
                <span className="text-neutral-700">{STATUS_CONFIG[st].label}</span>
              </div>
            ))}
          </div>

          {/* Filter Dropdowns & Unit Search */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-neutral-300 bg-white font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available Only</option>
              <option value="HOLD">On Hold</option>
              <option value="BOOKED">Booked</option>
              <option value="SOLD">Sold</option>
            </select>

            <select
              value={bhkFilter}
              onChange={(e) => setBhkFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-neutral-300 bg-white font-medium"
            >
              <option value="ALL">All BHKs</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchUnit}
                onChange={(e) => setSearchUnit(e.target.value)}
                placeholder="Unit No (e.g. 102)"
                className="pl-8 pr-3 py-1.5 rounded-xl border border-neutral-300 text-xs w-36 focus:outline-hidden focus:ring-2 focus:ring-[#D4A017]"
              />
            </div>
          </div>
        </div>

        {/* Stacking Plan Matrix Display */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="font-bold text-neutral-950 text-base">
                {selectedProject.name} — {selectedTower} Stacking Matrix
              </h3>
              <p className="text-xs text-neutral-500">
                Click on any unit tile to inspect carpet specs, price sheet, or reserve unit
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              {floorMap.length} Floors Configured
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {floorMap.map((fl) => (
              <div
                key={fl.floorNumber}
                className="flex items-center gap-3 p-2 rounded-xl bg-neutral-50/70 border border-neutral-100"
              >
                {/* Floor Label */}
                <div className="w-20 text-center shrink-0 border-r border-neutral-200 pr-2">
                  <span className="block text-xs font-bold text-neutral-900">
                    Floor {fl.floorNumber}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {fl.units.length} Units
                  </span>
                </div>

                {/* Units on Floor */}
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  {fl.units.map((unit) => {
                    const cfg = STATUS_CONFIG[unit.status] || STATUS_CONFIG.AVAILABLE;

                    return (
                      <button
                        key={unit.id}
                        onClick={() => setInspectedUnit(unit)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all min-w-[90px] shadow-xs active:scale-95 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                      >
                        <span className="font-bold leading-none">{unit.unitNumber}</span>
                        <span className="text-[10px] opacity-90 leading-none mt-1">
                          {unit.bhk}
                        </span>
                        <span className="text-[9px] opacity-80 leading-none mt-0.5">
                          {unit.carpetArea} sq.ft
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {floorMap.length === 0 && (
              <div className="p-10 text-center text-xs text-neutral-500 space-y-2">
                <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="font-semibold text-neutral-800">No units match the selected filters.</p>
                <p>Try resetting the status or BHK filter to view all inventory.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Unit Inspector Modal */}
      {inspectedUnit && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-neutral-950 text-white p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-white">
                    Unit {inspectedUnit.unitNumber}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      STATUS_CONFIG[inspectedUnit.status].badgeBg
                    }`}
                  >
                    {STATUS_CONFIG[inspectedUnit.status].label}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  {selectedProject.name} • {inspectedUnit.tower} • Floor {inspectedUnit.floor}
                </p>
              </div>

              <button
                onClick={() => setInspectedUnit(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Specifications Matrix */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="block text-neutral-500">Configuration</span>
                  <strong className="text-neutral-900 text-sm">{inspectedUnit.configuration}</strong>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="block text-neutral-500">RERA Carpet Area</span>
                  <strong className="text-neutral-900 text-sm">
                    {inspectedUnit.carpetArea} sq.ft
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="block text-neutral-500">Facing Direction</span>
                  <strong className="text-neutral-900 text-sm">
                    {inspectedUnit.facing || 'East Facing'}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="block text-neutral-500">Allotted Parking</span>
                  <strong className="text-neutral-900 text-sm">
                    {inspectedUnit.parking || '1 Covered Slot'}
                  </strong>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-xl bg-neutral-900 text-white space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-400">
                  <span>Base Consideration Value</span>
                  <span>{formatIndianPrice(inspectedUnit.price * 0.9)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-neutral-400">
                  <span>Floor Rise & Prime Location Charge</span>
                  <span>{formatIndianPrice(inspectedUnit.price * 0.1)}</span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-300">All-Inclusive Agreement Value</span>
                  <span className="text-base font-extrabold text-[#D4A017]">
                    {formatIndianPrice(inspectedUnit.price)}
                  </span>
                </div>
              </div>

              {/* Status Controller (RBAC / Sales modifier) */}
              <div className="space-y-2 pt-2">
                <span className="block text-xs font-bold text-neutral-700">
                  Update Unit Status:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {(['AVAILABLE', 'HOLD', 'BOOKED', 'SOLD'] as UnitStatus[]).map((statusKey) => (
                    <button
                      key={statusKey}
                      onClick={() => handleUpdateUnitStatus(inspectedUnit.id, statusKey)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        inspectedUnit.status === statusKey
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                          : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      {STATUS_CONFIG[statusKey].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/919326303244"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 text-xs font-bold transition-all shadow-xs"
                >
                  Reserve / Enquire
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      {isAddingUnit && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-neutral-200 shadow-2xl overflow-hidden">
            <div className="bg-neutral-950 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Add Unit to {selectedTower}</h3>
                <p className="text-xs text-neutral-400">{selectedProject.name}</p>
              </div>
              <button onClick={() => setIsAddingUnit(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Unit Number</label>
                  <input
                    type="text"
                    required
                    value={newUnitNumber}
                    onChange={(e) => setNewUnitNumber(e.target.value)}
                    placeholder="e.g. 1804"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Floor Level</label>
                  <input
                    type="number"
                    required
                    value={newUnitFloor}
                    onChange={(e) => setNewUnitFloor(e.target.value)}
                    min="1"
                    max="60"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Configuration</label>
                  <select
                    value={newUnitBhk}
                    onChange={(e) => setNewUnitBhk(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    required
                    value={newUnitArea}
                    onChange={(e) => setNewUnitArea(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Facing</label>
                  <select
                    value={newUnitFacing}
                    onChange={(e) => setNewUnitFacing(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  >
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="Sea View">Sea View</option>
                    <option value="Garden View">Garden View</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(e.target.value)}
                    step="50000"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold text-xs shadow-xs"
              >
                Create Inventory Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reservation & Enquiry Modal */}
      {isEnquiryOpen && inspectedUnit && (
        <EnquiryModal
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
          propertyTitle={`Booking Hold: Unit ${inspectedUnit.unitNumber} (${inspectedUnit.bhk})`}
          propertyLocation={`${selectedProject.name}, ${inspectedUnit.tower}`}
        />
      )}

      <Footer />
    </div>
  );
}
