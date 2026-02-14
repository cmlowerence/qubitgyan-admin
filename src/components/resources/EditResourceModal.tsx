// src/components/resources/EditResourceModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Resource } from '@/types/resource';
import { api } from '@/lib/api';

interface EditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: any) => Promise<void>;
  resource: Resource | null;
  isLoading: boolean;
}

export function EditResourceModal({ isOpen, onClose, onSave, resource, isLoading }: EditResourceModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedContext, setSelectedContext] = useState<string>('');
  const [contexts, setContexts] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      api.get('/contexts/').then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setContexts(data);
      });
    }
  }, [isOpen]);

  // FIX: Reconstruct the Google Drive link from the ID
  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      
      // LOGIC FIX: Check for ID, reconstruct link.
      let currentUrl = '';
      if (resource.resource_type === 'PDF' && resource.google_drive_id) {
        currentUrl = `https://drive.google.com/file/d/${resource.google_drive_id}/view`;
      } else if (resource.external_url) {
        currentUrl = resource.external_url;
      }
      setUrl(currentUrl);

      if (resource.contexts && resource.contexts.length > 0) {
        setSelectedContext(resource.contexts[0].id.toString());
      }
    }
  }, [resource]);

  if (!isOpen || !resource) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(resource.id, {
      title,
      // We send 'google_drive_link' back to backend so it can extract the new ID if changed
      google_drive_link: resource.resource_type === 'PDF' ? url : undefined,
      external_url: resource.resource_type !== 'PDF' ? url : undefined,
      context_ids: selectedContext ? [parseInt(selectedContext)] : []
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">Edit Resource</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Context (Tag)</label>
            <select 
              value={selectedContext}
              onChange={e => setSelectedContext(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-white"
            >
              <option value="">Select Context</option>
              {contexts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              {resource.resource_type === 'PDF' ? "Google Drive Link" : "External URL"}
            </label>
            <input 
              value={url} 
              onChange={e => setUrl(e.target.value)} 
              className="w-full p-2.5 border rounded-lg text-sm font-mono text-slate-600 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required 
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg">Cancel</button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-2 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
