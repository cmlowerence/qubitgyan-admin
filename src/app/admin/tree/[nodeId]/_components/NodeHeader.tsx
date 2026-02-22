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
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
        Back to Parent
      </button>

      <div className={`relative w-full rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm transition-all ${
        hasImage ? 'min-h-[220px] md:min-h-[280px] flex items-end' : 'bg-white p-5 md:p-8'
      }`}>
        
        {hasImage && (
          <>
            <img 
              src={node.thumbnail_url} 
              alt={node.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent" />
          </>
        )}

        <div className={`relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-5 md:gap-6 ${hasImage ? 'p-6 md:p-8' : ''}`}>
          
          <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
            <div className={`p-3.5 md:p-4 rounded-2xl shrink-0 shadow-sm border transition-colors ${
              hasImage 
                ? 'bg-white/20 text-white backdrop-blur-md border-white/20' 
                : isTopic 
                  ? 'bg-amber-50 text-amber-500 border-amber-100' 
                  : 'bg-indigo-50 text-indigo-600 border-indigo-100'
            }`}>
              <MainIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5 md:mb-2">
                <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest px-2 md:px-2.5 py-0.5 md:py-1 rounded-md border ${
                  hasImage
                    ? 'bg-white/20 text-white border-white/20 backdrop-blur-md'
                    : isTopic 
                      ? 'bg-amber-50 border-amber-100 text-amber-700' 
                      : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                }`}>
                  {node?.node_type}
                </span>
                <span className={`text-xs font-bold ${hasImage ? 'text-white/60' : 'text-slate-400'}`}>
                  ID: #{node?.id}
                </span>
                {node?.is_active === false && (
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest px-2 md:px-2.5 py-0.5 md:py-1 rounded-md border bg-slate-100 border-slate-200 text-slate-500">
                    Hidden
                  </span>
                )}
              </div>
              
              <h1 className={`text-2xl md:text-3xl lg:text-4xl font-black break-words leading-tight tracking-tight ${
                hasImage ? 'text-white drop-shadow-md' : 'text-slate-800'
              }`}>
                {node?.name}
              </h1>
            </div>
          </div>
          
          <div className="flex flex-row gap-2.5 w-full md:w-auto shrink-0 mt-2 md:mt-0">
            <button 
              onClick={onEdit}
              className={`p-3.5 rounded-xl transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 shrink-0 flex items-center justify-center ${
                hasImage 
                  ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 focus:ring-white' 
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 hover:text-indigo-600 focus:ring-indigo-500'
              }`}
              title="Node Settings"
            >
              <Settings2 className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            {!isTopic && (
              <button 
                onClick={onAddSubItem}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 text-sm md:text-base font-bold rounded-xl active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm ${
                  hasImage
                    ? 'bg-indigo-500 hover:bg-indigo-400 text-white border border-indigo-400 focus:ring-indigo-400 shadow-indigo-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 focus:ring-indigo-500'
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