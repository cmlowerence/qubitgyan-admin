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
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
        <ImageIcon className="w-3 h-3" /> {label}
      </label>
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
        />
        <button type="button" onClick={() => setOpen(true)} className="px-3 py-2 text-xs rounded-lg bg-slate-100 hover:bg-slate-200">
          Pick
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[120] bg-black/60 p-3 sm:p-6">
          <div className="bg-white rounded-xl w-full max-w-4xl mx-auto h-[90vh] flex flex-col overflow-hidden">
            <div className="p-3 border-b flex items-center justify-between gap-2">
              <div className="font-semibold">Select media from storage</div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-slate-100"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-3 border-b grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 absolute left-2 top-2.5 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search media" className="w-full pl-8 pr-2 py-2 border rounded-lg text-sm" />
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full py-2 px-2 border rounded-lg text-sm bg-white">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="p-3 overflow-auto grid grid-cols-2 md:grid-cols-4 gap-3">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onChange(m.file);
                    setOpen(false);
                  }}
                  className="text-left border rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-400"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.file} alt={m.filename || 'media'} className="w-full h-24 object-cover bg-slate-100" />
                  <div className="p-2">
                    <p className="text-[11px] font-medium truncate">{m.filename || `media-${m.id}`}</p>
                    <p className="text-[10px] text-slate-500 truncate">{m.category || 'Uncategorized'}</p>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-sm text-slate-500 col-span-full">No media found for this filter.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
