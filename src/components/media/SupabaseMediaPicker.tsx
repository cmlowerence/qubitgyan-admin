'use client';

import { useState, useEffect } from 'react';
import { getMediaList, UploadedMedia } from '@/services/media';
import { ImageIcon, Link as LinkIcon, Loader2, X, Check } from 'lucide-react';

interface SupabaseMediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function SupabaseMediaPicker({ value, onChange, label = "Thumbnail" }: SupabaseMediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'library' | 'url'>('library');

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
    if (isOpen && tab === 'library') fetchMedia();
  }, [isOpen, tab]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      
      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://supabase-url.com/image.png"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
        >
          <ImageIcon className="w-4 h-4 text-blue-600" />
          Browse
        </button>
      </div>

      {/* Preview */}
      {value && (
        <div className="relative mt-2 w-full h-32 rounded-xl overflow-hidden border border-gray-100 shadow-inner group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button 
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur shadow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      )}

      {/* Modal Selection */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Select Media</h3>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="p-4 grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto min-h-[300px]">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : media.length === 0 ? (
                <p className="col-span-full text-center text-gray-400 py-20">No media found in library.</p>
              ) : (
                media.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.file);
                      setIsOpen(false);
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${value === item.file ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                  >
                    <img src={item.file} alt={item.filename} className="w-full h-full object-cover" />
                    {value === item.file && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
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