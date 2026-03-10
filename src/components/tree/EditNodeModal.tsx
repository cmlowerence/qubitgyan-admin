// src/components/tree/EditNodeModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Trash2, Edit3, Eye, EyeOff } from 'lucide-react';
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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 border-0 sm:border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Edit3 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Modify {node.node_type}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(node.id, { name, thumbnail_url: thumbnail || undefined, order, is_active: isActive }); }} className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Name</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all font-bold outline-none text-slate-800 dark:text-slate-100" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Sort Order</label>
              <input 
                type="number" 
                value={order} 
                onChange={(e) => setOrder(parseInt(e.target.value || '0'))} 
                className="w-full p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl font-bold text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all" 
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Visibility</label>
              <button 
                type="button" 
                onClick={() => setIsActive(!isActive)} 
                className={`w-full p-3.5 sm:p-4 border rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-900 ${isActive ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400 hover:bg-emerald-100 focus:ring-emerald-500' : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-slate-500'}`}
              >
                {isActive ? <><Eye className="w-5 h-5" /> Published</> : <><EyeOff className="w-5 h-5" /> Hidden</>}
              </button>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <SupabaseMediaPicker value={thumbnail} onChange={setThumbnail} label="Node Thumbnail" />
          </div>

          <div className="pt-2 sm:pt-4 flex flex-col-reverse sm:flex-row gap-3">
            <button 
              type="button" 
              onClick={() => onDelete(node.id)} 
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl sm:rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <Trash2 className="w-5 h-5" />
              <span className="sm:hidden">Delete</span>
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !name.trim()} 
              className="w-full sm:w-auto flex-1 py-3.5 sm:py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}