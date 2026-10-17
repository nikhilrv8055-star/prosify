'use client';

import React, { useState, useEffect } from 'react';
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
  Copy,
  Sparkles,
  Lock,
  Cloud,
  Database,
} from 'lucide-react';
import {
  PortalUser,
  getPortalUsers,
  createPortalUser,
  deletePortalUser,
  setPortalSession,
  syncPortalUsersFromCloud,
} from '@/lib/auth/portalUsers';
import {
  getScopedVendorData,
  createInitialVendorData,
  saveScopedVendorData,
} from '@/lib/auth/scopedPortalStorage';

export interface VendorRecord {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  username: string;
  password?: string;
  category: 'DEVELOPER' | 'MATERIAL_SUPPLIER' | 'LEGAL_FIRM' | 'INTERIOR_DESIGN';
  grade: 'GRADE_A' | 'GRADE_B' | 'PREMIUM';
  projectsCount: number;
  propertiesCount: number;
  status: 'VERIFIED' | 'PENDING_AUDIT' | 'SUSPENDED';
  joinedDate: string;
}

export function VendorsManagementView({ subview = 'vendors-registered' }: { subview?: string }) {
  const [activeTab, setActiveTab] = useState<'registered' | 'add' | 'settings'>(
    subview === 'vendors-add' ? 'add' : subview === 'vendors-settings' ? 'settings' : 'registered'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [toast, setToast] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Vendors state fetched from API
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const res = await fetch('/api/vendors');
        if (res.ok) {
          const data = await res.json();
          setVendors(Array.isArray(data) ? data : data.vendors || []);
        }
      } catch (err) {
        console.warn('Error fetching vendors from /api/vendors:', err);
      }
    }
    fetchVendors();
  }, []);

  // Sync with portal users
  const [portalVendors, setPortalVendors] = useState<PortalUser[]>(() =>
    getPortalUsers().filter((u) => u.role === 'VENDOR')
  );

  const refreshVendors = () => {
    setPortalVendors(getPortalUsers().filter((u) => u.role === 'VENDOR'));
    syncPortalUsersFromCloud().then((cloudUsers) => {
      setPortalVendors(cloudUsers.filter((u) => u.role === 'VENDOR'));
    });
  };

  useEffect(() => {
    // Live sync from persistent server storage on load/refresh
    syncPortalUsersFromCloud().then((cloudUsers) => {
      setPortalVendors(cloudUsers.filter((u) => u.role === 'VENDOR'));
    });
    const handleUpdate = () => refreshVendors();
    window.addEventListener('eni_portal_users_updated', handleUpdate);
    return () => window.removeEventListener('eni_portal_users_updated', handleUpdate);
  }, []);

  // Add Vendor State
  const [newVendor, setNewVendor] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    category: 'DEVELOPER' as VendorRecord['category'],
    grade: 'GRADE_A' as VendorRecord['grade'],
  });

  const handleGenerateVendorCredentials = () => {
    const code = Math.floor(100 + Math.random() * 900);
    const cleanComp = (newVendor.companyName || 'vendor')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 8);
    setNewVendor((prev) => ({
      ...prev,
      username: `vnd_${cleanComp || 'partner'}_${code}@prosify.in`,
      password: `Prosify#Vnd${code}!`,
    }));
  };

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

  const handleCopyCredentials = (vendor: PortalUser) => {
    const text = `Vendor Portal: ${window.location.origin}/vendor\nUsername/ID: ${vendor.username}\nPassword: ${vendor.password}\nRole: Dedicated Vendor Panel`;
    navigator.clipboard.writeText(text);
    setCopiedId(vendor.id);
    showToast(`Copied Vendor credentials for ${vendor.name}!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenVendorPanel = (vendor: PortalUser) => {
    setPortalSession('VENDOR', vendor);
    window.location.href = '/vendor';
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.companyName.trim()) return;

    const code = Math.floor(100 + Math.random() * 900);
    const finalUsername = newVendor.username.trim() || newVendor.email.trim().toLowerCase() || `vnd_${code}@prosify.in`;
    const finalPassword = newVendor.password.trim() || `Prosify#Vnd${code}!`;

    const createdUser = createPortalUser({
      name: newVendor.companyName,
      username: finalUsername,
      role: 'VENDOR',
      password: finalPassword,
      phone: newVendor.phone || '+91 98201 00000',
      companyOrProject: `${newVendor.companyName} (${newVendor.category.replace('_', ' ')})`,
      status: 'ACTIVE',
      portalUrl: '/vendor',
      assignedCode: `VND-${code}`,
    });

    // Initialize dedicated isolated data storage for this vendor ID
    const initialData = createInitialVendorData(createdUser);
    saveScopedVendorData(createdUser.id, initialData);

    // Synchronize to Cloud Storage Vault
    fetch('/api/admin/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'VENDOR',
        assignedCode: `VND-${code}`,
        username: finalUsername,
        password: finalPassword,
        name: newVendor.companyName,
        phone: newVendor.phone,
        companyOrProject: newVendor.companyName,
        status: 'ACTIVE',
      }),
    }).catch((err) => console.warn('Cloud sync error:', err));

    refreshVendors();
    setNewVendor({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      category: 'DEVELOPER',
      grade: 'GRADE_A',
    });
    setActiveTab('registered');
    showToast(`Vendor account created! ID: ${finalUsername} Password: ${finalPassword}`);
  };

  const handleDeleteVendor = (id: string) => {
    deletePortalUser(id);
    refreshVendors();
    showToast('Vendor record removed.');
  };

  const filteredVendors = portalVendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.companyOrProject && v.companyOrProject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
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
            Registered Vendors ({portalVendors.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'add' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Add Vendor (Create ID & Password)
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

      {/* Strict Account & Data Isolation Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-emerald-200/90 text-xs flex items-start gap-2.5 shadow-lg">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-emerald-300">Har Vendor ID Ka Alag Seperate Private Account (Strict Data Isolation)</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Admin panel se banayi gayi har Vendor ID aur Password ka alag independent account rehta hai. Is ID se jo bhi vendor login karega use sirf usiki properties, projects, client inquiries aur financial details dikhayi dengi.
          </p>
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
                  <th className="p-3.5">Portal Login ID & Password</th>
                  <th className="p-3.5">Category & Details</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                      No corporate vendors registered yet. Use the "Add Vendor" tab to register builders, suppliers, or legal partners.
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center font-mono">
                          {v.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{v.name}</span>
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{v.assignedCode || 'VND-PORTAL'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-200">
                          <span className="text-slate-500 text-[10px]">ID:</span>
                          <span className="font-bold text-white">{v.username}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                          <span className="text-slate-500 text-[10px]">Pass:</span>
                          <span className="text-amber-300 font-bold">{v.password}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleCopyCredentials(v)}
                            className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3 h-3 text-emerald-400" />
                            <span>{copiedId === v.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenVendorPanel(v)}
                            className="px-2 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-[10px] text-emerald-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Login As this Vendor in isolated portal"
                          >
                            <span>Open Panel</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-300 text-xs font-medium">{v.companyOrProject || 'Vendor Account'}</div>
                      <div className="text-slate-400 text-[11px] font-mono mt-0.5">{v.phone || 'Phone not set'}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {getScopedVendorData(v.id, v).properties.length} Properties
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {getScopedVendorData(v.id, v).messages.length} Inquiries
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {v.status}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-sky-400 font-mono">
                          <Cloud className="w-2.5 h-2.5" />
                          <span>Cloud Synced</span>
                        </div>
                      </div>
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
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: ADD VENDOR */}
      {activeTab === 'add' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Provision Dedicated Vendor ID & Password</span>
            </h3>
            <button
              type="button"
              onClick={handleGenerateVendorCredentials}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center gap-1 border border-emerald-500/30 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto-Generate</span>
            </button>
          </div>

          <form onSubmit={handleAddVendor} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company / Developer Entity Name *</label>
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
                <label className="block text-slate-300 font-medium mb-1">Vendor Login ID / Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. vnd_prestige@prosify.in"
                  value={newVendor.username}
                  onChange={(e) => setNewVendor({ ...newVendor, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Generated Password *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prosify#Vnd842!"
                  value={newVendor.password}
                  onChange={(e) => setNewVendor({ ...newVendor, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Primary Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Irfan Razack"
                  value={newVendor.contactPerson}
                  onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Official Contact Email</label>
                <input
                  type="email"
                  placeholder="contact@prestige.com"
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

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold block">Isolated Panel Access:</span>
              This vendor will log into <strong className="text-white">/vendor</strong> using the generated ID and Password. Their dashboard and properties are completely isolated from other vendors and agents.
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Generate Credentials & Activate Vendor
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
