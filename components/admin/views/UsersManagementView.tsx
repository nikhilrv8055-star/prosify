'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  CheckCircle2,
  Trash2,
  Shield,
  Search,
  Filter,
  Calendar,
  Send,
  UserCheck,
} from 'lucide-react';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'BUYER' | 'INVESTOR' | 'BROKER' | 'VENDOR_AGENT';
  city: string;
  status: 'ACTIVE' | 'PENDING_KYC' | 'SUSPENDED';
  joinedDate: string;
  savedProperties: number;
}

export interface SubscriberItem {
  id: string;
  email: string;
  subscribedDate: string;
  source: 'FOOTER_FORM' | 'POPUP_MODAL' | 'NEW_LAUNCH_PAGE';
  status: 'SUBSCRIBED' | 'UNSUBSCRIBED';
}

const INITIAL_USERS: UserItem[] = [];

const INITIAL_SUBSCRIBERS: SubscriberItem[] = [];

export function UsersManagementView({ subview = 'users-registered' }: { subview?: string }) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [activeTab, setActiveTab] = useState<'registered' | 'add' | 'subscribers'>(
    subview === 'users-add' ? 'add' : subview === 'users-subscribers' ? 'subscribers' : 'registered'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [toast, setToast] = useState<string | null>(null);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'BUYER' as UserItem['role'],
    city: 'Mumbai',
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const u: UserItem = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      city: newUser.city,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
      savedProperties: 0,
    };

    setUsers([u, ...users]);
    setNewUser({ name: '', email: '', phone: '', role: 'BUYER', city: 'Mumbai' });
    setActiveTab('registered');
    showToast(`User account created for ${u.name}!`);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    showToast('User record removed.');
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Users & Homebuyer Accounts Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Administer registered homebuyers, high-net-worth investors, independent brokers, and newsletter subscribers.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('registered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'registered' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Registered Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'add' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Add New User
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'subscribers' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Subscribers ({subscribers.length})
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* VIEW 1: REGISTERED USERS */}
      {activeTab === 'registered' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white"
              >
                <option value="ALL">All Account Roles</option>
                <option value="BUYER">Homebuyer</option>
                <option value="INVESTOR">HNW Investor</option>
                <option value="BROKER">Independent Broker</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1E293B]/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">User Profile</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Saved Props</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                      No registered user accounts found. New customer signups will appear here automatically.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center font-mono">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Joined {u.joinedDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{u.email}</span>
                      </div>
                      <div className="text-slate-400 flex items-center gap-1.5 mt-0.5 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{u.phone}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300">{u.city}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-200">{u.savedProperties}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete user"
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

      {/* VIEW 2: ADD USER */}
      {activeTab === 'add' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-400" />
            <span>Create New User Profile</span>
          </h3>

          <form onSubmit={handleAddUser} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Anand Mahindra"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Phone (with WhatsApp)</label>
                <input
                  type="tel"
                  placeholder="+91 98200 00000"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Account Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                >
                  <option value="BUYER">Homebuyer</option>
                  <option value="INVESTOR">HNW Real Estate Investor</option>
                  <option value="BROKER">Independent Channel Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Primary City</label>
                <input
                  type="text"
                  value={newUser.city}
                  onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Register User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {subscribers.length} total active email subscribers receiving new project alerts and market price updates.
            </p>
            <button
              onClick={() => showToast('Exported CSV of subscriber list.')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1E293B]/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Email Address</th>
                  <th className="p-3.5">Lead Capture Source</th>
                  <th className="p-3.5">Date Subscribed</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                      No active newsletter subscribers yet. Subscribers from website forms will appear here.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-medium text-white flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>{s.email}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-800 text-slate-300">
                        {s.source}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">{s.subscribedDate}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSubscribers(subscribers.filter((sub) => sub.id !== s.id));
                          showToast('Subscriber removed.');
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400"
                        title="Unsubscribe"
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
    </div>
  );
}
