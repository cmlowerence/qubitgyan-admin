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
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 px-6 text-center shadow-sm">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 shadow-inner rounded-3xl flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800">
          <Folder className="w-10 h-10 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-slate-800 dark:text-slate-100 font-black text-xl mb-2 tracking-tight">Empty Section</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-sm max-w-sm leading-relaxed">
          There are no items inside this node yet. Start building your knowledge tree by adding the first sub-item.
        </p>
        <button 
          onClick={onAddFirstItem}
          className="flex items-center gap-2.5 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-black text-white transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-600/30"
        >
          <Plus className="w-5 h-5" /> Create First Sub-Item
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
      {childrenNodes.map((child) => (
        <div 
          key={child.id}
          onClick={() => onNavigate(child.id)}
          className="group flex items-center gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-600/5 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
          tabIndex={0}
        >
          {child.thumbnail_url ? (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-100 dark:border-slate-800 relative bg-slate-50 dark:bg-slate-950">
              <img src={child.thumbnail_url} alt={child.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          ) : (
            <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl shrink-0 transition-colors border border-slate-100 dark:border-slate-800 ${
              child.node_type === 'TOPIC' 
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40' 
                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 border-transparent'
            }`}>
              {child.node_type === 'TOPIC' ? <FileText className="w-6 h-6 sm:w-7 sm:h-7" /> : <Folder className="w-6 h-6 sm:w-7 sm:h-7" />}
            </div>
          )}

          <div className="flex-1 min-w-0 py-1">
            <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm sm:text-base truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {child.name}
            </h4>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                child.node_type === 'TOPIC' 
                  ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}>
                {child.node_type}
              </span>
              {child.node_type !== 'TOPIC' && (
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 truncate bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
                  {child.children?.length || 0} items
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(e, child);
              }}
              className="p-2.5 sm:p-3 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Edit Node"
            >
              <Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 hidden sm:block group-hover:text-indigo-400 dark:group-hover:text-indigo-500 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
}