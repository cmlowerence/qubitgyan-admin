// src/components/tree/TreeNode.tsx
'use client';

import React from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Settings, Plus } from 'lucide-react';
import { KnowledgeNode } from '@/types/tree';

interface TreeNodeProps {
  node: KnowledgeNode;
  level: number;
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
  onAddChild: (parentId: number) => void;
  onNavigate: (id: number) => void;
}

export function TreeNode({ node, level, expandedIds, onToggle, onAddChild, onNavigate }: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  
  const Icon = node.node_type === 'TOPIC' ? FileText : Folder;
  const colors = {
    DOMAIN: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400',
    SUBJECT: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
    SECTION: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
    TOPIC: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400'
  };

  const paddingLeftStyle = { paddingLeft: `calc(1rem + ${level * 16}px)` };

  return (
    <div className="select-none w-full animate-in fade-in slide-in-from-left-2">
      <div 
        className={`group flex items-center py-3 pr-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-y border-transparent cursor-pointer relative min-w-0 min-h-[48px] sm:min-h-[52px] ${isExpanded ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}
        style={paddingLeftStyle}
        onClick={() => onToggle(node.id)}
      >
        <div className="w-8 sm:w-9 h-8 sm:h-9 flex shrink-0 items-center justify-center mr-2 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg transition-colors focus:outline-none">
          {hasChildren ? (
            isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          )}
        </div>

        <div className={`p-2 shrink-0 rounded-xl mr-3 ${colors[node.node_type]}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <span 
          className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200 flex-1 truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1" 
          onClick={(e) => { e.stopPropagation(); onNavigate(node.id); }}
        >
          {node.name}
        </span>
        
        <div className="flex items-center gap-1.5 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity ml-2">
          {node.node_type !== 'TOPIC' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAddChild(node.id); }} 
              className="p-2 sm:p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Add Child Node"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate(node.id); }} 
            className="p-2 sm:p-2.5 text-slate-500 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            title="Node Settings"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="relative">
          <div 
            className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-100 dark:bg-slate-800 rounded-full" 
            style={{ marginLeft: `calc(1rem + ${level * 16 + 15}px)` }} 
          />
          <div className="flex flex-col">
            {node.children!.map((child) => (
              <TreeNode 
                key={child.id} 
                node={child} 
                level={level + 1} 
                expandedIds={expandedIds}
                onToggle={onToggle}
                onAddChild={onAddChild}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}