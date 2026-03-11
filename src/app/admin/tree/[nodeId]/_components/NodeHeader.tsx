// src/app/admin/tree/[nodeId]/_components/NodeHeader.tsx
'use client';

import { FolderTree, ArrowLeft, Settings2, Plus, FileText } from 'lucide-react';
import { KnowledgeNode } from '@/types/tree';

interface NodeHeaderProps {
  node: KnowledgeNode | null;
  isTopic: boolean;
  onBack: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onAddSubItem: () => void;
}

export default function NodeHeader({ 
  node, 
  isTopic, 
  onBack, 
  onEdit, 
  onAddSubItem 
}: NodeHeaderProps) {
  const hasImage = !!node?.thumbnail_url;
  const MainIcon = isTopic ? FileText : FolderTree;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1 -ml-2 uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
        Back to Parent
      </button>

      <div className={`relative w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-all ${
        hasImage ? 'min-h-[260px] sm:min-h-[320px] flex items-end' : 'bg-white dark:bg-slate-900 p-5 sm:p-8 lg:p-10'
      }`}>
        
        {hasImage && (
          <>
            <img 
              src={node.thumbnail_url} 
              alt={node.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/10 z-0" />
          </>
        )}

        <div className={`relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-5 md:gap-6 ${hasImage ? 'p-6 sm:p-8 lg:p-10' : ''}`}>
          
          <div className="flex items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
            <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl shrink-0 shadow-sm border transition-colors ${
              hasImage 
                ? 'bg-white/20 text-white backdrop-blur-md border-white/20' 
                : isTopic 
                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800' 
                  : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800'
            }`}>
              <MainIcon className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            
            <div className="min-w-0 flex-1 pt-1 sm:pt-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                  hasImage
                    ? 'bg-white/20 text-white border-white/20 backdrop-blur-md'
                    : isTopic 
                      ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400' 
                      : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400'
                }`}>
                  {node?.node_type}
                </span>
                <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md bg-black/10 dark:bg-white/10 ${hasImage ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                  ID: #{node?.id}
                </span>
                {node?.is_active === false && (
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-md border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    Hidden
                  </span>
                )}
              </div>
              
              <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black break-words leading-tight tracking-tight ${
                hasImage ? 'text-white drop-shadow-lg' : 'text-slate-900 dark:text-white'
              }`}>
                {node?.name}
              </h1>
            </div>
          </div>
          
          <div className="flex flex-row gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
            <button 
              onClick={onEdit}
              className={`p-4 rounded-xl transition-all active:scale-95 focus:outline-none focus:ring-4 shrink-0 flex items-center justify-center ${
                hasImage 
                  ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 focus:ring-white/50' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 focus:ring-indigo-500/30'
              }`}
              title="Node Settings"
            >
              <Settings2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            {!isTopic && (
              <button 
                onClick={onAddSubItem}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-6 py-4 text-sm sm:text-base font-black rounded-xl active:scale-[0.98] transition-all focus:outline-none focus:ring-4 shadow-sm ${
                  hasImage
                    ? 'bg-indigo-500 hover:bg-indigo-400 text-white border border-indigo-400 focus:ring-indigo-400/50 shadow-indigo-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 focus:ring-indigo-600/30'
                }`}
              >
                <Plus className="w-5 h-5" /> 
                <span>Add Sub-Item</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}