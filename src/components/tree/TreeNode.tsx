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
    DOMAIN: 'text-indigo-600 bg-indigo-50',
    SUBJECT: 'text-blue-600 bg-blue-50',
    SECTION: 'text-emerald-600 bg-emerald-50',
    TOPIC: 'text-amber-600 bg-amber-50'
  };

  // Base padding plus level indentation. Using padding instead of margin prevents touch target shrinkage on mobile.
  const paddingLeftStyle = { paddingLeft: `calc(1rem + ${level * 16}px)` };

  return (
    <div className="select-none w-full animate-in fade-in slide-in-from-left-2">
      <div 
        className={`group flex items-center py-2.5 sm:py-3 pr-3 sm:pr-4 hover:bg-slate-50 transition-colors border-y border-transparent cursor-pointer relative min-w-0 ${isExpanded ? 'bg-slate-50/50' : ''}`}
        style={paddingLeftStyle}
        onClick={() => onToggle(node.id)}
      >
        {/* Toggle Icon or Spacer */}
        <div className="w-7 sm:w-8 h-7 sm:h-8 flex shrink-0 items-center justify-center mr-1.5 sm:mr-2 text-slate-400 hover:bg-slate-200 rounded-md transition-colors">
          {hasChildren ? (
            isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          )}
        </div>

        {/* Node Type Icon */}
        <div className={`p-1.5 sm:p-2 shrink-0 rounded-lg mr-2.5 sm:mr-3 ${colors[node.node_type]}`}>
          <Icon size={16} className="sm:w-5 sm:h-5" />
        </div>

        {/* Node Name */}
        <span 
          className="text-sm sm:text-base font-semibold text-slate-700 flex-1 truncate hover:text-indigo-600 transition-colors" 
          onClick={(e) => { e.stopPropagation(); onNavigate(node.id); }}
        >
          {node.name}
        </span>
        
        {/* Actions - Always visible on mobile, hover-only on larger screens */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity ml-2">
          {node.node_type !== 'TOPIC' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAddChild(node.id); }} 
              className="p-1.5 sm:p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Add Child Node"
            >
              <Plus size={16} className="sm:w-4 sm:h-4" />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate(node.id); }} 
            className="p-1.5 sm:p-2 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            title="Node Settings"
          >
            <Settings size={16} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Recursive Children */}
      {isExpanded && hasChildren && (
        <div className="relative">
          {/* Subtle vertical line to visually connect children */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-px bg-slate-200" 
            style={{ marginLeft: `calc(1rem + ${level * 16 + 14}px)` }} 
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