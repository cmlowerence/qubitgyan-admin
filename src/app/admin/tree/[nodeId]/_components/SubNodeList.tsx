// src/app/admin/tree/[nodeId]/_components/SubNodeList.tsx
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
      <div className="flex flex-col items-center justify-center py-16 md:py-24 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 px-4 text-center">
        <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
          <Folder className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-slate-700 font-black text-lg mb-1">Empty Section</h3>
        <p className="text-slate-400 font-medium mb-6 text-sm max-w-sm">
          There are no items inside this node yet. Start building your knowledge tree by adding the first sub-item.
        </p>
        <button 
          onClick={onAddFirstItem}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold text-white transition-all shadow-md shadow-indigo-200 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add First Sub-Item
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
      {childrenNodes.map((child) => (
        <div 
          key={child.id}
          onClick={() => onNavigate(child.id)}
          className="group flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer"
        >
          {child.thumbnail_url ? (
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100">
              <img src={child.thumbnail_url} alt={child.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          ) : (
            <div className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl shrink-0 transition-colors ${
              child.node_type === 'TOPIC' 
                ? 'bg-amber-50 text-amber-500 group-hover:bg-amber-100' 
                : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
            }`}>
              {child.node_type === 'TOPIC' ? <FileText className="w-5 h-5 md:w-6 md:h-6" /> : <Folder className="w-5 h-5 md:w-6 md:h-6" />}
            </div>
          )}

          <div className="flex-1 min-w-0 py-1">
            <h4 className="font-bold text-slate-800 text-sm md:text-base truncate group-hover:text-indigo-600 transition-colors">
              {child.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5 md:mt-1">
              <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                child.node_type === 'TOPIC' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {child.node_type}
              </span>
              {child.node_type !== 'TOPIC' && (
                <span className="text-[10px] md:text-xs font-semibold text-slate-400 truncate">
                  • {child.children?.length || 0} items
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(e, child);
              }}
              className="p-2 md:p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg md:rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Edit Node"
            >
              <Settings2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate-300 hidden sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
}