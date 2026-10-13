'use client';

import React, { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Link,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface QuickLinkItem {
  id: string;
  label: string;
  url: string;
  category: 'EXPLORE' | 'LEGAL' | 'COMMUNITIES';
}

interface CustomPageItem {
  id: string;
  title: string;
  slug: string;
  status: 'PUBLISHED' | 'DRAFT';
  updatedAt: string;
}

export function FooterCmsView({ subview = 'footer-logo' }: { subview?: string }) {
  const [activeTab, setActiveTab] = useState<'logo' | 'content' | 'links' | 'pages'>(
    subview === 'footer-content'
      ? 'content'
      : subview === 'footer-quick-links'
      ? 'links'
      : subview === 'footer-custom-pages'
      ? 'pages'
      : 'logo'
  );

  const [footerContent, setFooterContent] = useState({
    logoUrl: 'https://mkblktzjrmjktfdnmtql.supabase.co/storage/v1/object/public/eni%20ai%20logo/eni%20ai%20robot%20model.png',
    brandName: 'Prosify Technologies Private Limited',
    aboutParagraph:
      'Prosify is India’s premier Grade-A real estate syndication platform. Connecting verified homebuyers, developers, and brokers with 100% MahaRERA transparency.',
    copyrightText: '© 2026 Prosify Technologies Private Limited. All Rights Reserved. MahaRERA Reg No: A51900012345.',
    officeAddress: 'Floor 18, Maker Chambers IV, Nariman Point, Mumbai MMR 400021',
    supportEmail: 'contact@prosify.in',
    supportPhone: '+91 93263 03244',
  });

  const [links, setLinks] = useState<QuickLinkItem[]>([
    { id: 'l-1', label: 'Explore Luxury Apartments', url: '/properties?category=apartments', category: 'EXPLORE' },
    { id: 'l-2', label: 'Upcoming Grade-A Projects', url: '/projects', category: 'EXPLORE' },
    { id: 'l-3', label: 'MahaRERA Compliance Disclosures', url: '/rera-disclaimer', category: 'LEGAL' },
    { id: 'l-4', label: 'Privacy & Cookie Policy', url: '/privacy', category: 'LEGAL' },
    { id: 'l-5', label: 'Vendor & Builder Syndication Network', url: '/vendor', category: 'COMMUNITIES' },
  ]);

  const [pages, setPages] = useState<CustomPageItem[]>([
    { id: 'p-1', title: 'About Prosify Enterprise', slug: 'about-us', status: 'PUBLISHED', updatedAt: '2026-09-20' },
    { id: 'p-2', title: 'Why Choose Zero Brokerage', slug: 'why-choose-us', status: 'PUBLISHED', updatedAt: '2026-09-22' },
    { id: 'p-3', title: 'MahaRERA Compliance & Title Deed Verification Guide', slug: 'rera-guide', status: 'PUBLISHED', updatedAt: '2026-09-28' },
    { id: 'p-4', title: 'Channel Partner Code of Ethics & Commission Rules', slug: 'partner-ethics', status: 'PUBLISHED', updatedAt: '2026-09-29' },
  ]);

  const [toast, setToast] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({ label: '', url: '', category: 'EXPLORE' as QuickLinkItem['category'] });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.label || !newLink.url) return;
    const l: QuickLinkItem = {
      id: `l-${Date.now()}`,
      label: newLink.label,
      url: newLink.url,
      category: newLink.category,
    };
    setLinks([...links, l]);
    setNewLink({ label: '', url: '', category: 'EXPLORE' });
    showToast(`Quick link added: ${l.label}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <span>Footer CMS & Custom Pages</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure footer branding logos, corporate descriptions, quick links, and static custom legal pages.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('logo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'logo' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Logo & Identity
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'content' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Content & Address
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'links' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quick Links ({links.length})
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pages' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom Pages ({pages.length})
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* VIEW: LOGO & IDENTITY */}
      {activeTab === 'logo' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-teal-400" />
            <span>Footer Brand Logo & Visual Assets</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Footer Brand Logo URL</label>
              <input
                type="text"
                value={footerContent.logoUrl}
                onChange={(e) => setFooterContent({ ...footerContent, logoUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Legal Entity Title</label>
              <input
                type="text"
                value={footerContent.brandName}
                onChange={(e) => setFooterContent({ ...footerContent, brandName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => showToast('Footer logo & company name saved!')}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
              >
                Save Identity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CONTENT */}
      {activeTab === 'content' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Footer Copywriting & Address</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">About Company Paragraph</label>
              <textarea
                rows={3}
                value={footerContent.aboutParagraph}
                onChange={(e) => setFooterContent({ ...footerContent, aboutParagraph: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Copyright Line & MahaRERA Registration Notice</label>
              <input
                type="text"
                value={footerContent.copyrightText}
                onChange={(e) => setFooterContent({ ...footerContent, copyrightText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Headquarters Address</label>
              <input
                type="text"
                value={footerContent.officeAddress}
                onChange={(e) => setFooterContent({ ...footerContent, officeAddress: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => showToast('Footer copy and address updated live!')}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
              >
                Save Footer Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: QUICK LINKS */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          <form onSubmit={handleAddLink} className="p-4 rounded-xl bg-[#1E293B]/80 border border-slate-700 flex flex-wrap gap-3 items-end text-xs">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-slate-300 font-medium mb-1">Link Title</label>
              <input
                type="text"
                placeholder="e.g. MahaRERA Filing Status"
                value={newLink.label}
                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700 text-white"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-slate-300 font-medium mb-1">URL Target</label>
              <input
                type="text"
                placeholder="/rera-filing"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={newLink.category}
                onChange={(e) => setNewLink({ ...newLink, category: e.target.value as any })}
                className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700 text-white"
              >
                <option value="EXPLORE">Explore</option>
                <option value="LEGAL">Legal & Compliance</option>
                <option value="COMMUNITIES">Communities</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg"
            >
              Add Link
            </button>
          </form>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1E293B]/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Target Destination</th>
                  <th className="p-3.5">Column Category</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {links.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-semibold text-white">{l.label}</td>
                    <td className="p-3.5 font-mono text-teal-300">{l.url}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {l.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setLinks(links.filter((link) => link.id !== l.id));
                          showToast('Quick link removed.');
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400"
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

      {/* VIEW: CUSTOM PAGES */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => showToast('Opening Rich-Text Page Builder Modal...')}
              className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom CMS Page</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1E293B]/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Page Title</th>
                  <th className="p-3.5">Permalink Slug</th>
                  <th className="p-3.5">Publication Status</th>
                  <th className="p-3.5">Last Updated</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-white">{p.title}</td>
                    <td className="p-3.5 font-mono text-slate-400">/{p.slug}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">{p.updatedAt}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => showToast(`Edit mode for /${p.slug}`)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                      >
                        Edit Page
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
