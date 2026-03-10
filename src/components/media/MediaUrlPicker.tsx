// src/components/media/MediaUrlPicker.tsx
'use client';

import { useMemo, useState } from 'react';
import { ImageIcon, Search, X } from 'lucide-react';
import { UploadedMedia } from '@/services/media';

interface MediaUrlPickerProps {
  value: string;
  onChange: (value: string) => void;
  media: UploadedMedia[];
  label?: string;
  placeholder?: string;
}

export function MediaUrlPicker({ value, onChange, media, label = 'Image URL', placeholder = 'https://...' }: MediaUrlPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const categories = useMemo(() => ['ALL', ...Array.from(new Set(media.map((m) => (m.category || 'Uncategorized').trim())))], [media]);

  const filtered = useMemo(
    () =>
      media.filter((m) => {
        const cat = (m.category || 'Uncategorized').trim();
        const q = search.toLowerCase();
        return (category === 'ALL' || category === cat) && (!q || (m.filename || '').toLowerCase().includes(q) || m.file.toLowerCase().includes(q));
      }),
    [media, category, search]
  );

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 ml-1">
        <ImageIcon className="w-3.5 h-3.5" /> {label}
      </label>
      <div className="flex gap-2.5">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all text-slate-800 dark:text-slate-100 font-medium"
        />
        <button 
          type="button" 
          onClick={() => setOpen(true)} 
          className="px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
        >
          Pick
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm p-0 sm:p-4 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 border-0 sm:border border-slate-200 dark:border-slate-800">
            
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 shrink-0">
              <div className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" />
                Select Media
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 bg-white dark:bg-slate-900">
              <div className="sm:col-span-2 relative">
                <Search className="w-5 h-5 absolute left-3 top-3 sm:top-3.5 text-slate-400" />
                <input 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  placeholder="Search files..." 
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all text-slate-800 dark:text-slate-100" 
                />
              </div>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full py-3 sm:py-3.5 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all appearance-none cursor-pointer"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 bg-slate-50 dark:bg-slate-950">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onChange(m.file);
                    setOpen(false);
                  }}
                  className="text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:ring-4 hover:ring-indigo-500/30 hover:border-indigo-500 transition-all shadow-sm group focus:outline-none focus:ring-4 focus:ring-indigo-500 flex flex-col"
                >
                  <div className="w-full aspect-square sm:aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.file} alt={m.filename || 'media'} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{m.filename || `media-${m.id}`}</p>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">{m.category || 'Uncategorized'}</p>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
                  <Search className="w-10 h-10 mb-3 opacity-20" />
                  <p className="text-sm font-medium">No media found matching criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}