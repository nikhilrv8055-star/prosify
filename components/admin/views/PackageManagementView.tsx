'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  CheckCircle2,
  Trash2,
  Edit3,
  Sliders,
  Sparkles,
  Menu,
  Shield,
  Eye,
  Save,
  Layers,
  ArrowUpDown,
} from 'lucide-react';

export interface PlanItem {
  id: string;
  name: string;
  price: number;
  duration: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  listingsLimit: number;
  featuredLimit: number;
  supportLevel: 'BASIC' | 'PRIORITY' | 'DEDICATED_VIP';
  activeSubscribers: number;
  badgeText?: string;
  isPopular?: boolean;
}

const INITIAL_PACKAGES: PlanItem[] = [
  {
    id: 'pkg-1',
    name: 'Starter Agent Plan',
    price: 1999,
    duration: 'MONTHLY',
    listingsLimit: 10,
    featuredLimit: 2,
    supportLevel: 'BASIC',
    activeSubscribers: 142,
    badgeText: 'Basic',
  },
  {
    id: 'pkg-2',
    name: 'Pro Broker Plan',
    price: 4999,
    duration: 'MONTHLY',
    listingsLimit: 50,
    featuredLimit: 10,
    supportLevel: 'PRIORITY',
    activeSubscribers: 86,
    badgeText: 'Most Popular',
    isPopular: true,
  },
  {
    id: 'pkg-3',
    name: 'Grade-A Developer Corporate',
    price: 14999,
    duration: 'MONTHLY',
    listingsLimit: 250,
    featuredLimit: 50,
    supportLevel: 'DEDICATED_VIP',
    activeSubscribers: 28,
    badgeText: 'Enterprise',
  },
  {
    id: 'pkg-4',
    name: 'Institutional Syndicate Annual',
    price: 129999,
    duration: 'ANNUAL',
    listingsLimit: 1000,
    featuredLimit: 200,
    supportLevel: 'DEDICATED_VIP',
    activeSubscribers: 12,
    badgeText: 'Syndicate',
  },
];

interface MenuItemConfig {
  id: string;
  title: string;
  url: string;
  visibleTo: 'ALL' | 'PAID_ONLY' | 'ENTERPRISE_ONLY';
  order: number;
  isEnabled: boolean;
}

const INITIAL_MENUS: MenuItemConfig[] = [
  { id: 'm-1', title: 'Dashboard & Analytics', url: '/vendor/dashboard', visibleTo: 'ALL', order: 1, isEnabled: true },
  { id: 'm-2', title: 'Property Management', url: '/vendor/properties', visibleTo: 'ALL', order: 2, isEnabled: true },
  { id: 'm-3', title: 'Property Messages & Enquiries', url: '/vendor/messages', visibleTo: 'ALL', order: 3, isEnabled: true },
  { id: 'm-4', title: 'Project Management & Towers', url: '/vendor/projects', visibleTo: 'PAID_ONLY', order: 4, isEnabled: true },
  { id: 'm-5', title: 'Sales Agents & Sub-Users', url: '/vendor/agents', visibleTo: 'PAID_ONLY', order: 5, isEnabled: true },
  { id: 'm-6', title: 'Developer Sync API Push Gateway', url: '/vendor/api-sync', visibleTo: 'ENTERPRISE_ONLY', order: 6, isEnabled: true },
  { id: 'm-7', title: 'Support & Concierge Tickets', url: '/vendor/tickets', visibleTo: 'ALL', order: 7, isEnabled: true },
  { id: 'm-8', title: 'Subscription & Buy Plan', url: '/vendor/buy-plan', visibleTo: 'ALL', order: 8, isEnabled: true },
];

export function PackageManagementView({ subview = 'pkg-packages' }: { subview?: string }) {
  const [packages, setPackages] = useState<PlanItem[]>(INITIAL_PACKAGES);
  const [menuItems, setMenuItems] = useState<MenuItemConfig[]>(INITIAL_MENUS);
  const [activeTab, setActiveTab] = useState<'packages' | 'settings' | 'menu-builder'>(
    subview === 'pkg-settings' ? 'settings' : subview === 'pkg-menu-builder' ? 'menu-builder' : 'packages'
  );

  const [settings, setSettings] = useState({
    currency: 'INR (₹)',
    gstRate: 18,
    trialDays: 14,
    allowFreeDowngrade: false,
    autoInvoiceGeneration: true,
  });

  const [toast, setToast] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: 2999,
    duration: 'MONTHLY' as PlanItem['duration'],
    listingsLimit: 25,
    featuredLimit: 5,
    supportLevel: 'PRIORITY' as PlanItem['supportLevel'],
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name.trim()) return;
    const p: PlanItem = {
      id: `pkg-${Date.now()}`,
      name: newPlan.name,
      price: Number(newPlan.price),
      duration: newPlan.duration,
      listingsLimit: Number(newPlan.listingsLimit),
      featuredLimit: Number(newPlan.featuredLimit),
      supportLevel: newPlan.supportLevel,
      activeSubscribers: 0,
      badgeText: 'New',
    };
    setPackages([...packages, p]);
    setIsAddModalOpen(false);
    setNewPlan({ name: '', price: 2999, duration: 'MONTHLY', listingsLimit: 25, featuredLimit: 5, supportLevel: 'PRIORITY' });
    showToast(`Package "${p.name}" created successfully!`);
  };

  const handleDeletePlan = (id: string) => {
    setPackages(packages.filter((p) => p.id !== id));
    showToast('Package removed.');
  };

  const handleToggleMenu = (id: string) => {
    setMenuItems(menuItems.map((m) => (m.id === id ? { ...m, isEnabled: !m.isEnabled } : m)));
    showToast('Menu item visibility updated.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>Package Management & Monetization</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure vendor subscription tiers, pricing plans, billing settings, and dynamic navigation menu builder.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'packages'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Packages ({packages.length})
          </button>
          <button
            onClick={() => setActiveTab('menu-builder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'menu-builder'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Menu Builder
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* VIEW 1: PACKAGES */}
      {activeTab === 'packages' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-5 rounded-2xl bg-[#1E293B]/80 border transition-all flex flex-col justify-between ${
                  pkg.isPopular
                    ? 'border-amber-500/60 ring-1 ring-amber-500/30 bg-slate-900/90'
                    : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {pkg.badgeText || pkg.duration}
                    </span>
                    <button
                      onClick={() => handleDeletePlan(pkg.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-2xl font-black text-amber-400">₹{pkg.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-400 font-mono">/{pkg.duration.toLowerCase()}</span>
                  </div>

                  <ul className="text-xs text-slate-300 space-y-2 py-3 border-t border-b border-slate-800/80">
                    <li className="flex items-center justify-between">
                      <span className="text-slate-400">Listings Limit:</span>
                      <strong className="text-white">{pkg.listingsLimit} properties</strong>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-slate-400">Featured Slots:</span>
                      <strong className="text-amber-300">{pkg.featuredLimit} slots</strong>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-slate-400">Support Level:</span>
                      <strong className="text-sky-300">{pkg.supportLevel.replace('_', ' ')}</strong>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-slate-400">Active Subscribers:</span>
                      <span className="font-mono text-emerald-400 font-bold">{pkg.activeSubscribers} vendors</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <button
                    onClick={() => showToast(`Edit modal opened for ${pkg.name}`)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Plan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: MENU BUILDER */}
      {activeTab === 'menu-builder' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Menu className="w-4 h-4 text-amber-400" />
                <span>Vendor Portal Menu Item Builder & Access Control</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Enable or restrict portal sidebar links based on vendor membership subscription tier.
              </p>
            </div>
            <button
              onClick={() => showToast('Vendor menu layout published live to portal!')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {menuItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-center font-bold">
                    {item.order}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{item.url}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      item.visibleTo === 'ALL'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : item.visibleTo === 'PAID_ONLY'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {item.visibleTo}
                  </span>

                  <button
                    onClick={() => handleToggleMenu(item.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      item.isEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {item.isEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Monetization & Billing Rules</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Billing Currency</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">GST / Tax Percentage (%)</label>
                <input
                  type="number"
                  value={settings.gstRate}
                  onChange={(e) => setSettings({ ...settings, gstRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Free Trial Duration (Days)</label>
                <input
                  type="number"
                  value={settings.trialDays}
                  onChange={(e) => setSettings({ ...settings, trialDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Auto Tax-Compliant Invoicing</h4>
                <p className="text-[11px] text-slate-400">Generate GST-compliant PDF invoice upon payment gateway callback</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoInvoiceGeneration}
                onChange={(e) => setSettings({ ...settings, autoInvoiceGeneration: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => showToast('Billing parameters successfully updated!')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PACKAGE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              <span>Create Subscription Package</span>
            </h3>

            <form onSubmit={handleAddPlan} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultra Luxury Broker Pro"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Duration Cycle</label>
                  <select
                    value={newPlan.duration}
                    onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="ANNUAL">Annual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Property Listings Limit</label>
                  <input
                    type="number"
                    value={newPlan.listingsLimit}
                    onChange={(e) => setNewPlan({ ...newPlan, listingsLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Featured Ad Slots</label>
                  <input
                    type="number"
                    value={newPlan.featuredLimit}
                    onChange={(e) => setNewPlan({ ...newPlan, featuredLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
