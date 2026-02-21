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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            <h2 className="font-black text-slate-800">{parentId ? 'New Sub-Node' : 'New Domain'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Node Title</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Thermodynamics" className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all font-semibold outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Type</label>
              <select value={nodeType} onChange={(e) => setNodeType(e.target.value as NodeType)} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none">
                <option value="DOMAIN">Domain</option>
                <option value="SUBJECT">Subject</option>
                <option value="SECTION">Section</option>
                <option value="TOPIC">Topic</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Sort Order</label>
              <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value || '0'))} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" />
            </div>
          </div>

          <SupabaseMediaPicker value={thumbnail} onChange={setThumbnail} label="Node Thumbnail" />

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors">Discard</button>
            <button type="submit" disabled={isLoading || !name} className="flex-1 py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}