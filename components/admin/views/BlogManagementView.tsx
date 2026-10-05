'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  postsCount: number;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  status: 'PUBLISHED' | 'DRAFT';
  views: number;
  publishedDate: string;
}

const INITIAL_CATEGORIES: BlogCategory[] = [
  { id: 'bcat-1', name: 'MahaRERA & Legal Guidelines', slug: 'maharera-legal', postsCount: 14 },
  { id: 'bcat-2', name: 'Micro-Market Investment Reports', slug: 'market-reports', postsCount: 22 },
  { id: 'bcat-3', name: 'Home Loan & Tax Optimization', slug: 'home-loans-tax', postsCount: 9 },
  { id: 'bcat-4', name: 'Grade-A Builder Spotlight', slug: 'builder-spotlight', postsCount: 16 },
];

const INITIAL_POSTS: BlogPost[] = [];

export function BlogManagementView({ subview = 'blog-posts' }: { subview?: string }) {
  const [categories, setCategories] = useState<BlogCategory[]>(INITIAL_CATEGORIES);
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>(
    subview === 'blog-categories' ? 'categories' : 'posts'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // New Category State
  const [newCatName, setNewCatName] = useState('');

  // New Post Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    category: INITIAL_CATEGORIES[0]?.name || '',
    author: 'Editorial Desk',
    status: 'PUBLISHED' as BlogPost['status'],
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const cat: BlogCategory = {
      id: `bcat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      postsCount: 0,
    };
    setCategories([...categories, cat]);
    setNewCatName('');
    showToast(`Blog category created: ${cat.name}`);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim()) return;
    const p: BlogPost = {
      id: `bp-${Date.now()}`,
      title: newPost.title,
      slug: newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newPost.category,
      author: newPost.author,
      status: newPost.status,
      views: 0,
      publishedDate: new Date().toISOString().split('T')[0],
    };
    setPosts([p, ...posts]);
    setIsModalOpen(false);
    setNewPost({ title: '', category: categories[0]?.name || '', author: 'Editorial Desk', status: 'PUBLISHED' });
    showToast(`Blog article "${p.title}" published!`);
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
    showToast('Post deleted.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-400" />
            <span>Blog & Real Estate Knowledge Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage research insights, RERA advisory articles, buyer guides, and topical blog categories.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'posts' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Articles & Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'categories' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* VIEW 1: POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search articles by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Article</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1E293B]/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Article Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Author</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Reads / Views</th>
                  <th className="p-3.5">Published Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {posts
                  .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-white max-w-md truncate">{p.title}</td>
                      <td className="p-3.5 text-slate-300">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">{p.author}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-200">{p.views.toLocaleString()}</td>
                      <td className="p-3.5 text-slate-400 font-mono">{p.publishedDate}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeletePost(p.id)}
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

      {/* VIEW 2: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-4 max-w-2xl">
          <form onSubmit={handleAddCategory} className="p-4 rounded-xl bg-[#1E293B]/80 border border-slate-700 flex gap-2">
            <input
              type="text"
              required
              placeholder="New blog category name (e.g. NRI Tax & Remittance)..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs"
            >
              Add Category
            </button>
          </form>

          <div className="divide-y divide-slate-800 rounded-2xl bg-[#1E293B]/60 border border-slate-800">
            {categories.map((c) => (
              <div key={c.id} className="p-3.5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">{c.name}</h4>
                  <span className="text-[10px] font-mono text-slate-500">/{c.slug}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">{c.postsCount} Articles</span>
                  <button
                    onClick={() => {
                      setCategories(categories.filter((cat) => cat.id !== c.id));
                      showToast('Category deleted.');
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WRITE ARTICLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-400" />
              <span>Publish Research Article</span>
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Mumbai MMR Real Estate Absorption Index"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Author Name / Bylines</label>
                  <input
                    type="text"
                    value={newPost.author}
                    onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
