// src/components/media/SupabaseMediaPicker.tsx
'use client';

import { useState, useEffect } from 'react';
import { getMediaList, UploadedMedia } from '@/services/media';
import { ImageIcon, Link as LinkIcon, Loader2, X, Check, Search } from 'lucide-react';

interface SupabaseMediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function SupabaseMediaPicker({ value, onChange, label = "Thumbnail Image" }: SupabaseMediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await getMediaList();
      setMedia(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && media.length === 0) fetchMedia();
  }, [isOpen]);

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">{label}</label>
      
      <div className="flex gap-2.5">
        <div className="relative flex-1 group min-w-0">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all text-slate-800 dark:text-slate-100"
          />
          <LinkIcon className="absolute left-3.5 top-3.5 sm:top-4 w-4 h-4 text-slate-400" />
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-5 sm:px-6 py-3 sm:py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <ImageIcon className="w-4 h-4 text-indigo-500" />
          <span className="hidden sm:inline">Browse</span>
        </button>
      </div>

      {value && (
        <div className="relative mt-3 w-full h-40 sm:h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner group bg-slate-100 dark:bg-slate-900">
          <img src={value} alt="Selected preview" className="w-full h-full object-cover" />
          <button 
            onClick={() => onChange('')}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Remove image"
          >
            <X className="w-4 h-4 text-slate-700 dark:text-slate-200" />
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 border-0 sm:border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" /> Select Image
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 overflow-y-auto custom-scrollbar flex-1 bg-slate-50 dark:bg-slate-950 min-h-[300px]">
              {loading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <span className="text-sm font-medium text-slate-500">Loading library...</span>
                </div>
              ) : media.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                  <Search className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-bold">No media found in library.</p>
                </div>
              ) : (
                media.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.file);
                      setIsOpen(false);
                    }}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group focus:outline-none focus:ring-4 focus:ring-indigo-500 ${value === item.file ? 'border-indigo-500 ring-4 ring-indigo-500/20 scale-95 shadow-md' : 'border-transparent hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm hover:shadow-md'}`}
                  >
                    <img src={item.file} alt={item.filename} className={`w-full h-full object-cover transition-transform duration-500 ${value !== item.file && 'group-hover:scale-110'}`} />
                    {value === item.file && (
                      <div className="absolute inset-0 bg-indigo-500/30 flex items-center justify-center backdrop-blur-[1px]">
                        <Check className="w-8 h-8 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}