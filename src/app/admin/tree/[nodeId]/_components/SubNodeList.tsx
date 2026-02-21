'use client';

import { KnowledgeNode } from '@/types/tree';
import { ChevronRight, Folder, FileText, Settings2, Plus } from 'lucide-react';

interface SubNodeListProps {
  childrenNodes: KnowledgeNode[];
  onNavigate: (id: number) => void;
  onEdit: (e: React.MouseEvent, node: KnowledgeNode) => void;
  onAddFirstItem: () => void;
}

export default function SubNodeList({ childrenNodes, onNavigate, onEdit, onAddFirstItem }: SubNodeListProps) {
  if (childrenNodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
        <Folder className="w-12 h-12 text-slate-200 mb-4" />
        <p className="text-slate-400 font-bold mb-4 uppercase tracking-widest text-xs">No children yet</p>
        <button 
          onClick={onAddFirstItem}
          className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add First Sub-Item
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {childrenNodes.map((child) => (
        <div 
          key={child.id}
          onClick={() => onNavigate(child.id)}
          className="group flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer"
        >
          <div className={`p-3 rounded-xl shrink-0 ${child.node_type === 'TOPIC' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors'}`}>
            {child.node_type === 'TOPIC' ? <FileText className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{child.name}</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{child.node_type} • {child.resource_count || 0} items</p>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
                onClick={(e) => onEdit(e, child)}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Settings2 className="w-4 h-4" />
              </button>
              <ChevronRight className="w-5 h-5 text-slate-300" />
          </div>
        </div>
      ))}
    </div>
  );
}