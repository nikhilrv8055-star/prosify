'use client';

import React, { useState } from 'react';
import {
  Building2,
  UserPlus,
  Sliders,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Search,
  BadgeCheck,
  Mail,
  Phone,
  Layers,
  Key,
} from 'lucide-react';

export interface VendorRecord {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: 'DEVELOPER' | 'MATERIAL_SUPPLIER' | 'LEGAL_FIRM' | 'INTERIOR_DESIGN';
  grade: 'GRADE_A' | 'GRADE_B' | 'PREMIUM';
  projectsCount: number;
  propertiesCount: number;
  status: 'VERIFIED' | 'PENDING_AUDIT' | 'SUSPENDED';
  joinedDate: string;
}

const INITIAL_VENDORS: VendorRecord[] = [
  {
    id: 'vnd-1',
    companyName: 'Godrej Properties Limited',
    contactPerson: 'Adarsh Malhotra',
    email: 'vendor@eni.com',
    phone: '+91 22 6169 8500',
    category: 'DEVELOPER',
    grade: 'GRADE_A',
    projectsCount: 14,
    propertiesCount: 42,
    status: 'VERIFIED',
    joinedDate: '2026-06-12',
  },
  {
    id: 'vnd-2',
    companyName: 'Lodha Group (Macrotech Developers)',
    contactPerson: 'Sandeep Poddar',
    email: 'sandeep.p@lodhagroup.com',
    phone: '+91 22 2302 4400',
    category: 'DEVELOPER',
    grade: 'GRADE_A',
    projectsCount: 22,
    propertiesCount: 88,
    status: 'VERIFIED',
    joinedDate: '2026-05-20',
  },
  {
    id: 'vnd-3',
    companyName: 'Hiranandani Communities',
    contactPerson: 'Meera Hiranandani',
    email: 'meera.h@hiranandani.net',
    phone: '+91 22 2576 6800',
    category: 'DEVELOPER',
    grade: 'GRADE_A',
    projectsCount: 9,
    propertiesCount: 31,
    status: 'VERIFIED',
    joinedDate: '2026-07-04',
  },
  {
    id: 'vnd-4',
    companyName: 'UltraTech Cement & Construction Solutions',
    contactPerson: 'Rajiv Singhal',
    email: 'rajiv.s@ultratech.adityabirla.com',
    phone: '+91 22 6691 7800',
    category: 'MATERIAL_SUPPLIER',
    grade: 'PREMIUM',
    projectsCount: 0,
    propertiesCount: 18,
    status: 'VERIFIED',
    joinedDate: '2026-08-11',
  },
];

export function VendorsManagementView({ subview = 'vendors-registered' }: { subview?: string }) {
  const [vendors, setVendors] = useState<VendorRecord[]>(INITIAL_VENDORS);
  const [activeTab, setActiveTab] = useState<'registered' | 'add' | 'settings'>(
    subview === 'vendors-add' ? 'add' : subview === 'vendors-settings' ? 'settings' : 'registered'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [toast, setToast] = useState<string | null>(null);

  // Add Vendor State
  const [newVendor, setNewVendor] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    category: 'DEVELOPER' as VendorRecord['category'],
    grade: 'GRADE_A' as VendorRecord['grade'],
  });

  // Settings State
  const [vendorSettings, setVendorSettings] = useState({
    autoApproveGradeA: true,
    requireReraVerification: true,
    maxFreeListings: 15,
    enableVendorPublicProfile: true,
    commissionSplitPercent: 2.5,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.companyName.trim() || !newVendor.email.trim()) return;

    const v: VendorRecord = {
      id: `vnd-${Date.now()}`,
      companyName: newVendor.companyName,
      contactPerson: newVendor.contactPerson,
      email: newVendor.email,
      phone: newVendor.phone,
      category: newVendor.category,
      grade: newVendor.grade,
      projectsCount: 0,
      propertiesCount: 0,
      status: 'VERIFIED',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setVendors([v, ...vendors]);
    setNewVendor({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      category: 'DEVELOPER',
      grade: 'GRADE_A',
    });
    setActiveTab('registered');
    showToast(`Vendor enterprise "${v.companyName}" successfully enrolled!`);
  };

  const handleDeleteVendor = (id: string) => {
    setVendors(vendors.filter((v) => v.id !== id));
    showToast('Vendor record removed.');
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || v.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Vendors & Developers Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Administer Grade-A builders, construction contractors, material vendors, and their dedicated portal access credentials.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('registered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'registered' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Registered Vendors ({vendors.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'add' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Add Vendor
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
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

      {/* VIEW 1: REGISTERED VENDORS */}
      {activeTab === 'registered' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search vendor by company or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white"
              >
                <option value="ALL">All Categories</option>
                <option value="DEVELOPER">Real Estate Developer</option>
                <option value="MATERIAL_SUPPLIER">Material Supplier</option>
                <option value="LEGAL_FIRM">Legal / RERA Auditor</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1E293B]/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Vendor Enterprise</th>
                  <th className="p-3.5">Category & Grade</th>
                  <th className="p-3.5">Contact Details</th>
                  <th className="p-3.5">Projects / Units</th>
                  <th className="p-3.5">Audit Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center font-mono">
                          {v.companyName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{v.companyName}</span>
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <div className="text-[11px] text-slate-400">{v.contactPerson}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-200">{v.category.replace('_', ' ')}</div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {v.grade}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-300 flex items-center gap-1 font-mono text-[11px]">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{v.email}</span>
                      </div>
                      <div className="text-slate-400 flex items-center gap-1 font-mono text-[11px] mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{v.phone}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono">
                      <div className="text-white font-semibold">{v.projectsCount} Projects</div>
                      <div className="text-slate-400 text-[11px]">{v.propertiesCount} Listed Units</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteVendor(v.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete vendor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: ADD VENDOR */}
      {activeTab === 'add' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Onboard New Real Estate Vendor</span>
          </h3>

          <form onSubmit={handleAddVendor} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company / Developer Entity Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Prestige Estates Projects Ltd"
                value={newVendor.companyName}
                onChange={(e) => setNewVendor({ ...newVendor, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Primary Representative</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Irfan Razack"
                  value={newVendor.contactPerson}
                  onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="vendor@company.com"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Telephone / Hotline</label>
                <input
                  type="tel"
                  placeholder="+91 22 0000 0000"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Industry Classification</label>
                <select
                  value={newVendor.category}
                  onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                >
                  <option value="DEVELOPER">Grade-A Real Estate Developer</option>
                  <option value="MATERIAL_SUPPLIER">Building Material Supplier</option>
                  <option value="LEGAL_FIRM">Legal & Title Firm</option>
                  <option value="INTERIOR_DESIGN">Luxury Interior Architect</option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Enroll Vendor & Provision Portal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Vendor Protocol Policies</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="font-semibold text-white">Auto-Approve Grade-A Developer Push</h4>
                <p className="text-[11px] text-slate-400">Allow verified conglomerates to push real-time inventory updates without manual approval</p>
              </div>
              <input
                type="checkbox"
                checked={vendorSettings.autoApproveGradeA}
                onChange={(e) => setVendorSettings({ ...vendorSettings, autoApproveGradeA: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="font-semibold text-white">Strict MahaRERA Certification Check</h4>
                <p className="text-[11px] text-slate-400">Require all vendor-uploaded projects to have a verified RERA registration number</p>
              </div>
              <input
                type="checkbox"
                checked={vendorSettings.requireReraVerification}
                onChange={(e) => setVendorSettings({ ...vendorSettings, requireReraVerification: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Default Free Listings Cap</label>
                <input
                  type="number"
                  value={vendorSettings.maxFreeListings}
                  onChange={(e) => setVendorSettings({ ...vendorSettings, maxFreeListings: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Standard Commission Split (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vendorSettings.commissionSplitPercent}
                  onChange={(e) => setVendorSettings({ ...vendorSettings, commissionSplitPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => showToast('Vendor governance policies updated!')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
