'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Trash2, Edit3 } from 'lucide-react';
import { KnowledgeNode, UpdateNodePayload } from '@/types/tree';
import SupabaseMediaPicker from '@/components/media/SupabaseMediaPicker';

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: UpdateNodePayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  node: KnowledgeNode | null;
  isLoading: boolean;
}

export default function EditNodeModal({ isOpen, onClose, onSubmit, onDelete, node, isLoading }: EditNodeModalProps) {
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (node) {
      setName(node.name);
      setThumbnail(node.thumbnail_url || '');
      setOrder(node.order);
      setIsActive(node.is_active);
    }
  }, [node, isOpen]);

  if (!isOpen || !node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-600" />
            <h2 className="font-black text-slate-800">Modify {node.node_type}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(node.id, { name, thumbnail_url: thumbnail || undefined, order, is_active: isActive }); }} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white font-semibold outline-none transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Sort Order</label>
              <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value || '0'))} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Visibility</label>
              <button type="button" onClick={() => setIsActive(!isActive)} className={`w-full p-3.5 border rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${isActive ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                {isActive ? 'Published' : 'Hidden'}
              </button>
            </div>
          </div>

          <SupabaseMediaPicker value={thumbnail} onChange={setThumbnail} label="Node Thumbnail" />

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => onDelete(node.id)} className="p-4 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-2xl transition-colors"><Trash2 className="w-6 h-6" /></button>
            <button type="submit" disabled={isLoading || !name} className="flex-1 py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}