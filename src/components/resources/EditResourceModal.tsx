// src/components/resources/EditResourceModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, FileEdit } from 'lucide-react';
import { Resource } from '@/types/resource';
import { api } from '@/lib/api';
import { UploadedMedia } from '@/services/media';
import { MediaUrlPicker } from '@/components/media/MediaUrlPicker';

interface EditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: any) => Promise<void>;
  resource: Resource | null;
  isLoading: boolean;
  media: UploadedMedia[];
}

export function EditResourceModal({ isOpen, onClose, onSave, resource, isLoading, media }: EditResourceModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedContext, setSelectedContext] = useState<string>('');
  const [contexts, setContexts] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      api.get('/contexts/').then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setContexts(data);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      let currentUrl = '';
      if (resource.resource_type === 'PDF' && resource.google_drive_id) currentUrl = `https://drive.google.com/file/d/${resource.google_drive_id}/view`;
      else if (resource.external_url) currentUrl = resource.external_url;
      setUrl(currentUrl);
      if (resource.contexts?.length) setSelectedContext(resource.contexts[0].id.toString());
    }
  }, [resource]);

  if (!isOpen || !resource) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(resource.id, {
      title,
      google_drive_link: resource.resource_type === 'PDF' ? url : undefined,
      external_url: resource.resource_type !== 'PDF' ? url : undefined,
      context_ids: selectedContext ? [parseInt(selectedContext)] : [],
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border-0 sm:border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 shrink-0">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileEdit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            Edit Resource
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all text-slate-800 dark:text-slate-100 font-medium" 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">Context (Tag)</label>
            <select 
              value={selectedContext} 
              onChange={(e) => setSelectedContext(e.target.value)} 
              className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all text-slate-800 dark:text-slate-100 font-medium appearance-none cursor-pointer"
            >
              <option value="">Select Context</option>
              {contexts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <MediaUrlPicker
            value={url}
            onChange={setUrl}
            media={media}
            label={resource.resource_type === 'PDF' ? 'Google Drive Link / Pick image URL' : 'External URL / Pick image URL'}
            placeholder={resource.resource_type === 'PDF' ? 'Paste Drive link' : 'Paste URL'}
          />

          <div className="pt-2 pb-4 sm:pb-0 sm:pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-5 py-3.5 sm:py-2.5 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="w-full sm:w-auto px-6 py-3.5 sm:py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-xl hover:opacity-90 flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-slate-900/20 dark:shadow-white/10 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:focus:ring-white">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}