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

  return (
    <div className="select-none animate-in fade-in slide-in-from-left-2">
      <div 
        className={`group flex items-center py-3 px-4 hover:bg-white hover:shadow-sm rounded-2xl cursor-pointer transition-all border border-transparent ${isExpanded ? 'bg-white shadow-sm' : ''}`}
        style={{ marginLeft: `${level * 12}px` }}
        onClick={() => onToggle(node.id)}
      >
        <div className="w-6 h-6 flex items-center justify-center mr-2 text-slate-400">
          {hasChildren ? (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <div className="w-4 h-4 rounded-full bg-slate-100" />}
        </div>

        <div className={`p-1.5 rounded-lg mr-3 ${colors[node.node_type]}`}>
          <Icon size={16} />
        </div>

        <span className="text-sm font-bold text-slate-700 flex-1 truncate" onClick={(e) => { e.stopPropagation(); onNavigate(node.id); }}>
          {node.name}
        </span>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {node.node_type !== 'TOPIC' && (
            <button onClick={(e) => { e.stopPropagation(); onAddChild(node.id); }} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors">
              <Plus size={16} />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); onNavigate(node.id); }} className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="mt-1 border-l-2 border-slate-100 ml-6">
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
      )}
    </div>
  );
}