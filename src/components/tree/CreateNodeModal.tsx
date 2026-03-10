// src/components/tree/CreateNodeModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Zap } from 'lucide-react';
import { CreateNodePayload, NodeType } from '@/types/tree';
import SupabaseMediaPicker from '@/components/media/SupabaseMediaPicker';

interface CreateNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNodePayload) => Promise<void>;
  isLoading: boolean;
  parentId?: number | null;
  parentType?: NodeType;
}

export default function CreateNodeModal({ isOpen, onClose, onSubmit, isLoading, parentId = null, parentType }: CreateNodeModalProps) {
  const [name, setName] = useState('');
  const [nodeType, setNodeType] = useState<NodeType>('DOMAIN');
  const [thumbnail, setThumbnail] = useState('');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (parentType === 'DOMAIN') setNodeType('SUBJECT');
      else if (parentType === 'SUBJECT') setNodeType('SECTION');
      else if (parentType === 'SECTION') setNodeType('TOPIC');
      else setNodeType('DOMAIN');
    }
  }, [isOpen, parentType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, node_type: nodeType, parent: parentId, thumbnail_url: thumbnail || undefined, order });
    setName('');
    setThumbnail('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 border-0 sm:border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {parentId ? 'New Sub-Node' : 'New Domain'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Node Title</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Thermodynamics" 
              className="w-full p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all font-bold outline-none text-slate-800 dark:text-slate-100 placeholder:font-medium placeholder:text-slate-400" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Type</label>
              <select 
                value={nodeType} 
                onChange={(e) => setNodeType(e.target.value as NodeType)} 
                className="w-full p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all appearance-none cursor-pointer"
              >
                <option value="DOMAIN">Domain</option>
                <option value="SUBJECT">Subject</option>
                <option value="SECTION">Section</option>
                <option value="TOPIC">Topic</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Sort Order</label>
              <input 
                type="number" 
                value={order} 
                onChange={(e) => setOrder(parseInt(e.target.value || '0'))} 
                className="w-full p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl font-bold text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all" 
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <SupabaseMediaPicker value={thumbnail} onChange={setThumbnail} label="Node Thumbnail" />
          </div>

          <div className="pt-2 sm:pt-4 flex flex-col-reverse sm:flex-row gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full sm:w-auto flex-1 py-3.5 sm:py-4 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl sm:rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
            >
              Discard
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !name.trim()} 
              className="w-full sm:w-auto flex-[2] py-3.5 sm:py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}