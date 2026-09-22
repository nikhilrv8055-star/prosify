'use client';

import React, { useState } from 'react';
import { Building2, Layers, CheckCircle2, Lock, Tag, Clock, ShieldAlert } from 'lucide-react';
import { Unit, UnitStatus } from '@/lib/types';
import { formatIndianPrice, formatArea } from '@/lib/utils';

interface InventoryMatrixProps {
  units: Unit[];
  canEdit?: boolean;
  onUpdateStatus?: (unitId: string, status: UnitStatus) => Promise<void>;
  projectName?: string;
}

export function InventoryMatrix({
  units,
  canEdit = false,
  onUpdateStatus,
  projectName = 'Project Inventory Matrix',
}: InventoryMatrixProps) {
  // Extract unique towers
  const towers = Array.from(new Set(units.map((u) => u.tower)));
  const [selectedTower, setSelectedTower] = useState<string>(towers[0] || 'Tower A');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);
  const [updating, setUpdating] = useState(false);

  // Filter units for selected tower
  const towerUnits = units.filter((u) => u.tower === selectedTower);

  // Group by floor (descending from top floor to bottom floor)
  const floorMap = new Map<number, Unit[]>();
  towerUnits.forEach((unit) => {
    const list = floorMap.get(unit.floor) || [];
    list.push(unit);
    floorMap.set(unit.floor, list);
  });

  const sortedFloors = Array.from(floorMap.keys()).sort((a, b) => b - a);

  const getStatusColor = (status: UnitStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100';
      case 'HOLD':
        return 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100';
      case 'BOOKED':
        return 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100';
      case 'SOLD':
        return 'bg-neutral-100 text-neutral-500 border-neutral-300 cursor-not-allowed opacity-80';
      case 'BLOCKED':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const handleStatusChange = async (newStatus: UnitStatus) => {
    if (!activeUnit || !onUpdateStatus) return;
    setUpdating(true);
    try {
      await onUpdateStatus(activeUnit.id, newStatus);
      setActiveUnit({ ...activeUnit, status: newStatus });
    } catch {}
    setUpdating(false);
  };

  // Counts
  const availableCount = towerUnits.filter((u) => u.status === 'AVAILABLE').length;
  const holdCount = towerUnits.filter((u) => u.status === 'HOLD').length;
  const bookedCount = towerUnits.filter((u) => u.status === 'BOOKED').length;
  const soldCount = towerUnits.filter((u) => u.status === 'SOLD').length;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-6">
      {/* Header & Tower Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-neutral-950 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#D4A017]" />
            <span>Interactive Floor-by-Floor Inventory Matrix</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time unit availability and layout configurations
          </p>
        </div>

        {/* Tower Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {towers.map((tower) => (
            <button
              key={tower}
              onClick={() => setSelectedTower(tower)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                selectedTower === tower
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{tower}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Summary Counters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Available ({availableCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Hold ({holdCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Booked ({bookedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-neutral-400" />
            <span>Sold ({soldCount})</span>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 font-medium">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1 px-2 rounded-lg border border-neutral-300 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available Only</option>
            <option value="HOLD">Hold Only</option>
            <option value="BOOKED">Booked Only</option>
            <option value="SOLD">Sold Only</option>
          </select>
        </div>
      </div>

      {/* Grid: Floor rows */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {sortedFloors.map((floorNum) => {
          const rawUnits = floorMap.get(floorNum) || [];
          const filteredUnits =
            statusFilter === 'ALL'
              ? rawUnits
              : rawUnits.filter((u) => u.status === statusFilter);

          if (filteredUnits.length === 0 && statusFilter !== 'ALL') return null;

          return (
            <div
              key={floorNum}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-100 hover:border-neutral-200 bg-neutral-50/50"
            >
              {/* Floor Label */}
              <div className="w-20 shrink-0 text-xs font-bold text-neutral-700 flex items-center gap-1">
                <span>Floor {floorNum}</span>
              </div>

              {/* Units List */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {filteredUnits.map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() => setActiveUnit(unit)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs ${getStatusColor(
                      unit.status
                    )} ${activeUnit?.id === unit.id ? 'ring-2 ring-neutral-900' : ''}`}
                    title={`${unit.unitNumber} • ${unit.bhk} • ${formatIndianPrice(unit.price)}`}
                  >
                    <span>{unit.unitNumber}</span>
                    <span className="text-[10px] opacity-75 font-normal">({unit.bhk.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Unit Details Modal / Drawer */}
      {activeUnit && (
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#171717] text-white">
                Unit {activeUnit.unitNumber}
              </span>
              <span className="text-xs text-neutral-600">
                {activeUnit.tower}, Floor {activeUnit.floor}
              </span>
            </div>
            <button
              onClick={() => setActiveUnit(null)}
              className="text-neutral-500 hover:text-neutral-900 text-xs font-semibold"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-neutral-500 block">Configuration</span>
              <strong className="text-neutral-900">{activeUnit.bhk}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Carpet Area</span>
              <strong className="text-neutral-900">{formatArea(activeUnit.carpetArea)}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">All-Inclusive Price</span>
              <strong className="text-neutral-900 text-sm font-bold">
                {formatIndianPrice(activeUnit.price)}
              </strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Current Status</span>
              <strong className="text-neutral-900 uppercase font-bold">
                {activeUnit.status}
              </strong>
            </div>
          </div>

          {/* Admin / Developer Edit Controls */}
          {canEdit && onUpdateStatus && (
            <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-neutral-700">Update Inventory Status:</span>
              {(['AVAILABLE', 'HOLD', 'BOOKED', 'SOLD', 'BLOCKED'] as UnitStatus[]).map((st) => (
                <button
                  key={st}
                  disabled={updating || activeUnit.status === st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors ${
                    activeUnit.status === st
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100 disabled:opacity-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
