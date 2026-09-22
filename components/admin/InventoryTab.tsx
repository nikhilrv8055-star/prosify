'use client';

import React, { useState } from 'react';
import {
  Layers,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Lock,
  IndianRupee,
  Building,
  Sparkles,
  X,
} from 'lucide-react';
import { Unit, UnitStatus } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';
import { store } from '@/lib/data/store';

interface InventoryTabProps {
  units: Unit[];
  onRefresh: () => void;
}

export function InventoryTab({ units, onRefresh }: InventoryTabProps) {
  const [selectedTower, setSelectedTower] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newUnitData, setNewUnitData] = useState({
    unitNumber: 'A-1502',
    tower: 'Tower A',
    floor: 15,
    bhk: '3 BHK',
    carpetArea: 1120,
    basePrice: 16500000,
    facing: 'North-East (River View)',
    status: 'AVAILABLE' as UnitStatus,
  });

  const towers = Array.from(new Set(units.map((u) => u.tower))).filter(Boolean);

  const filteredUnits = units.filter((u) => {
    const matchesTower = selectedTower === 'ALL' || u.tower === selectedTower;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesSearch =
      u.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.tower.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTower && matchesStatus && matchesSearch;
  });

  const handleStatusChange = (unitId: string, newStatus: UnitStatus) => {
    store.updateUnitStatus(unitId, newStatus);
    onRefresh();
  };

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitData.unitNumber) return;

    store.createUnit({
      ...newUnitData,
      price: newUnitData.basePrice,
      projectId: 'proj-1',
      totalPrice: newUnitData.basePrice * 1.1,
    });

    setIsModalOpen(false);
    onRefresh();
  };

  const getStatusBadge = (status: UnitStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40';
      case 'HOLD':
        return 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40';
      case 'BOOKED':
        return 'bg-[#0EA5E9]/20 text-[#0EA5E9] border-[#0EA5E9]/40';
      case 'SOLD':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'BLOCKED':
        return 'bg-slate-700 text-slate-400 border-slate-600';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#10B981]" />
            <span>Tower & Unit Inventory Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time unit availability matrix, floor plates, reservation locks, and instant status overrides
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#10B981]/20 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Unit</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search unit number (e.g. A-1402)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedTower}
            onChange={(e) => setSelectedTower(e.target.value)}
            className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-slate-200 focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Towers / Wings</option>
            {towers.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-slate-200 focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="HOLD">ON HOLD</option>
            <option value="BOOKED">BOOKED</option>
            <option value="SOLD">SOLD</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>
      </div>

      {/* Inventory Unit Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredUnits.map((u) => (
          <div
            key={u.id}
            className="p-4 rounded-2xl bg-[#1E293B]/90 backdrop-blur-md border border-slate-700 hover:border-slate-600 transition-all shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-sm font-bold text-white font-mono">{u.unitNumber}</span>
                  <div className="text-[11px] text-slate-400">{u.tower} • Floor {u.floor}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(u.status)} font-mono`}>
                  {u.status}
                </span>
              </div>

              <div className="space-y-1 my-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Configuration:</span>
                  <span className="font-semibold text-white">{u.bhk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Carpet Area:</span>
                  <span>{u.carpetArea} sq.ft.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Price:</span>
                  <span className="font-bold text-[#10B981]">{formatIndianPrice(u.basePrice || u.price)}</span>
                </div>
                {u.facing && (
                  <div className="text-[11px] text-slate-400 truncate pt-1 border-t border-slate-800">
                    Orientation: {u.facing}
                  </div>
                )}
              </div>
            </div>

            {/* Status Switcher Control */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">Override Status:</span>
              <select
                value={u.status}
                onChange={(e) => handleStatusChange(u.id, e.target.value as UnitStatus)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-[#10B981]"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="HOLD">HOLD</option>
                <option value="BOOKED">BOOKED</option>
                <option value="SOLD">SOLD</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add Unit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#10B981]" />
                <span>Add Unit to Inventory</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Unit Number *</label>
                  <input
                    type="text"
                    required
                    value={newUnitData.unitNumber}
                    onChange={(e) => setNewUnitData({ ...newUnitData, unitNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tower / Wing</label>
                  <input
                    type="text"
                    value={newUnitData.tower}
                    onChange={(e) => setNewUnitData({ ...newUnitData, tower: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Floor Level</label>
                  <input
                    type="number"
                    value={newUnitData.floor}
                    onChange={(e) => setNewUnitData({ ...newUnitData, floor: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">BHK Type</label>
                  <input
                    type="text"
                    value={newUnitData.bhk}
                    onChange={(e) => setNewUnitData({ ...newUnitData, bhk: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Carpet Area (sq. ft.)</label>
                  <input
                    type="number"
                    value={newUnitData.carpetArea}
                    onChange={(e) => setNewUnitData({ ...newUnitData, carpetArea: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Base Price (INR)</label>
                  <input
                    type="number"
                    value={newUnitData.basePrice}
                    onChange={(e) => setNewUnitData({ ...newUnitData, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold cursor-pointer">
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
