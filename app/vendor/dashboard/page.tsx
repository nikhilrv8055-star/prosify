'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Package,
  Layers,
  Inbox,
  CreditCard,
  FileText,
  User,
  LogOut,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Download,
  Edit,
  Trash2,
  DollarSign,
  Tag,
  Eye,
  Check,
} from 'lucide-react';
import { ProsifyAnimatedLogo } from '@/components/brand/ProsifyAnimatedLogo';

interface VendorListing {
  id: string;
  title: string;
  category: string;
  price: string;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'ON_ORDER';
  inquiriesCount: number;
  lastUpdated: string;
}

interface VendorOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  itemOrService: string;
  amount: string;
  stage: 'NEW_INQUIRY' | 'PRICE_QUOTED' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';
  date: string;
}

interface VendorPayout {
  id: string;
  invoiceNumber: string;
  period: string;
  grossAmount: string;
  platformCommission: string;
  netPayout: string;
  status: 'SETTLED' | 'PENDING_CLEARANCE';
  settlementDate: string;
}

const INITIAL_LISTINGS: VendorListing[] = [
  {
    id: 'lst-1',
    title: 'Grade-A AAC Lightweight Aerated Autoclaved Blocks (600x200x150mm)',
    category: 'Masonry & Wall Materials',
    price: '₹3,450 / Cubic Meter',
    stockStatus: 'IN_STOCK',
    inquiriesCount: 28,
    lastUpdated: 'Today, 11:30 AM',
  },
  {
    id: 'lst-2',
    title: 'Ultratech Super Cement (PPC 50kg Weather-Proof Bags)',
    category: 'Cement & Binding Agents',
    price: '₹385 / Bag',
    stockStatus: 'IN_STOCK',
    inquiriesCount: 64,
    lastUpdated: 'Yesterday',
  },
  {
    id: 'lst-3',
    title: 'Fe-550D TMT Rebars (8mm - 32mm High Ductility Steel)',
    category: 'Structural Steel',
    price: '₹54,200 / Metric Ton',
    stockStatus: 'LOW_STOCK',
    inquiriesCount: 19,
    lastUpdated: '3 days ago',
  },
  {
    id: 'lst-4',
    title: 'Turnkey Luxury Modular Kitchen Fabrication (Anti-Bacterial Finish)',
    category: 'Interior Contracting',
    price: '₹2,75,000 / Setup',
    stockStatus: 'IN_STOCK',
    inquiriesCount: 12,
    lastUpdated: '5 days ago',
  },
];

const INITIAL_ORDERS: VendorOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-VEN-8921-992',
    customerName: 'Godrej Properties (Procurement)',
    customerPhone: '+91 98200 44321',
    itemOrService: '120 MT Fe-550D TMT Steel Rebars',
    amount: '₹65,04,000',
    stage: 'DISPATCHED',
    date: '2026-10-15',
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-VEN-8921-988',
    customerName: 'Shapoorji Pallonji Joyville Site',
    customerPhone: '+91 97110 55432',
    itemOrService: '450 Cu.M AAC Blocks',
    amount: '₹15,52,500',
    stage: 'PRICE_QUOTED',
    date: '2026-10-14',
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-VEN-8921-975',
    customerName: 'Lodha Crown Tower B Contractor',
    customerPhone: '+91 98221 88765',
    itemOrService: '2,500 Bags PPC Weather Proof Cement',
    amount: '₹9,62,500',
    stage: 'COMPLETED',
    date: '2026-10-10',
  },
];

const INITIAL_PAYOUTS: VendorPayout[] = [
  {
    id: 'pay-201',
    invoiceNumber: 'INV-PROS-2026-10-091',
    period: 'Oct 01 - Oct 15, 2026',
    grossAmount: '₹18,45,000',
    platformCommission: '₹36,900 (2%)',
    netPayout: '₹18,08,100',
    status: 'SETTLED',
    settlementDate: '2026-10-15',
  },
  {
    id: 'pay-202',
    invoiceNumber: 'INV-PROS-2026-10-098',
    period: 'Oct 16 - Oct 31, 2026 (Accruing)',
    grossAmount: '₹2,40,000',
    platformCommission: '₹4,800 (2%)',
    netPayout: '₹2,35,200',
    status: 'PENDING_CLEARANCE',
    settlementDate: 'Scheduled: Oct 31',
  },
];

export default function VendorDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'financials' | 'profile'>('listings');
  const [listings, setListings] = useState<VendorListing[]>(INITIAL_LISTINGS);
  const [orders, setOrders] = useState<VendorOrder[]>(INITIAL_ORDERS);
  const [payouts, setPayouts] = useState<VendorPayout[]>(INITIAL_PAYOUTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Item Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ secureId: string; name: string; username?: string } | null>(null);

  useEffect(() => {
    try {
      const match = document.cookie.match(/prosify_vendor_session=([^;]+)/);
      if (match && match[1]) {
        const decoded = JSON.parse(atob(decodeURIComponent(match[1])));
        if (decoded) {
          setCurrentUser(decoded);
        }
      }
    } catch {}
  }, []);

  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Masonry & Wall Materials',
    price: '',
  });

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/vendor/logout', { method: 'POST' });
      router.push('/vendor/login');
      router.refresh();
    } catch {
      router.push('/vendor/login');
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.price) return;

    const item: VendorListing = {
      id: `lst-${Date.now()}`,
      title: newItem.title,
      category: newItem.category,
      price: newItem.price,
      stockStatus: 'IN_STOCK',
      inquiriesCount: 0,
      lastUpdated: 'Just now',
    };

    setListings([item, ...listings]);
    setNewItem({ title: '', category: 'Masonry & Wall Materials', price: '' });
    setIsAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col font-sans selection:bg-[#D4A017] selection:text-neutral-950">
      {/* Top Navbar */}
      <header className="px-6 py-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <ProsifyAnimatedLogo size="sm" />
          <span className="hidden sm:inline-block h-4 w-px bg-neutral-700" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {currentUser?.secureId || 'VEN-PARTNER'}
            </span>
            <span className="text-xs text-neutral-300 font-semibold hidden md:inline">
              {currentUser?.name || 'Verified Vendor Enterprise'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Verified Vendor
          </span>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium border border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 shadow-md">
            <div className="text-xs text-neutral-400 font-medium">Total Settled Amount</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">₹18,45,000</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              100% Cleared via RTGS
            </div>
          </div>

          <div className="bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 shadow-md">
            <div className="text-xs text-neutral-400 font-medium">Pending Clearance</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">₹2,40,000</div>
            <div className="text-[11px] text-neutral-400 mt-1">Settlement scheduled on 31st</div>
          </div>

          <div className="bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 shadow-md">
            <div className="text-xs text-neutral-400 font-medium">Active Catalog Listings</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{listings.length}</div>
            <div className="text-[11px] text-neutral-400 mt-1">Visible to 450+ verified buyers</div>
          </div>

          <div className="bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 shadow-md">
            <div className="text-xs text-neutral-400 font-medium">Open Inquiry Pipeline</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 mt-1">{orders.length}</div>
            <div className="text-[11px] text-sky-400/80 mt-1">Active RFQs &amp; builder orders</div>
          </div>
        </div>

        {/* Dashboard Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto">
          {[
            { id: 'listings', label: 'Inventory & Services Catalog', icon: Package },
            { id: 'orders', label: 'Inquiry & Orders Pipeline', icon: Inbox },
            { id: 'financials', label: 'Financials & Invoices', icon: CreditCard },
            { id: 'profile', label: 'Profile & KYC Settings', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: INVENTORY & SERVICES CATALOG */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter listings by title or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={() => setIsAddOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item / Service</span>
              </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-950/60 border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Item / Service Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Pricing</th>
                      <th className="py-3 px-4">Availability</th>
                      <th className="py-3 px-4">Buyer Leads</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {listings.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white max-w-xs">{item.title}</td>
                        <td className="py-3.5 px-4 text-neutral-400">{item.category}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-300">{item.price}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.stockStatus === 'IN_STOCK'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {item.stockStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white">{item.inquiriesCount} inquiries</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            title="Edit Listing"
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer mr-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INQUIRY & ORDER PIPELINE */}
        {activeTab === 'orders' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">Orders &amp; Direct Builder RFQs</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Procurement orders directed to your vendor profile from registered Grade-A builders.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-950/60 border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Order Ref &amp; Date</th>
                    <th className="py-3 px-4">Builder / Client</th>
                    <th className="py-3 px-4">Item / Volume</th>
                    <th className="py-3 px-4">Deal Value</th>
                    <th className="py-3 px-4">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white text-[11px]">{ord.orderNumber}</div>
                        <div className="text-[10px] text-neutral-500">{ord.date}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{ord.customerName}</div>
                        <div className="text-neutral-400 font-mono text-[11px]">{ord.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-300">{ord.itemOrService}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-300">{ord.amount}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.stage === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : ord.stage === 'DISPATCHED'
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {ord.stage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FINANCIALS & INVOICES */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-white">Settlement Ledgers &amp; Platform Split</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Bi-monthly automated RTGS payouts with automated GST tax invoices.
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-950/60 border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Invoice Ref</th>
                      <th className="py-3 px-4">Billing Period</th>
                      <th className="py-3 px-4">Gross Revenue</th>
                      <th className="py-3 px-4">Commission</th>
                      <th className="py-3 px-4">Net Settled</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {payouts.map((pay) => (
                      <tr key={pay.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">{pay.invoiceNumber}</td>
                        <td className="py-3.5 px-4 text-neutral-300">{pay.period}</td>
                        <td className="py-3.5 px-4 font-mono text-white">{pay.grossAmount}</td>
                        <td className="py-3.5 px-4 font-mono text-neutral-400">{pay.platformCommission}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{pay.netPayout}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              pay.status === 'SETTLED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {pay.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => alert(`Downloading GST Tax Invoice ${pay.invoiceNumber}...`)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE & KYC SETTINGS */}
        {activeTab === 'profile' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm max-w-3xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Vendor Enterprise Profile &amp; KYC</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Verified commercial entity details on file with Prosify Administration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500 font-semibold block mb-1">Company Legal Name</span>
                <span className="text-white font-bold text-sm">BuildTech Smart Materials Ltd</span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500 font-semibold block mb-1">GSTIN Number</span>
                <span className="text-amber-400 font-mono font-bold text-sm">27AABCB1234F1Z5</span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500 font-semibold block mb-1">Settlement Bank</span>
                <span className="text-white font-bold">HDFC Bank, Fort Branch</span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500 font-semibold block mb-1">Account Number</span>
                <span className="text-neutral-300 font-mono">••••••••••••4123 (IFSC: HDFC0000123)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>KYC verified and approved by Central Risk &amp; Compliance Team.</span>
            </div>
          </div>
        )}
      </main>

      {/* Add Item Modal */}
      {isAddOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Add New Item or Service</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Publish material supplies or turnkey services to builder procurement desks.
            </p>

            <form onSubmit={handleAddItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Item Title / Specification</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ready-Mix Concrete Grade M-25"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white"
                >
                  <option value="Masonry & Wall Materials">Masonry &amp; Wall Materials</option>
                  <option value="Cement & Binding Agents">Cement &amp; Binding Agents</option>
                  <option value="Structural Steel">Structural Steel</option>
                  <option value="Interior Contracting">Interior Contracting</option>
                  <option value="Plumbing & Electrical">Plumbing &amp; Electrical</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Unit Pricing</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹4,200 / Cu.M"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
