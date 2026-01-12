'use client';

import React from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, MoreHorizontal, Plus } from 'lucide-react';
import { KnowledgeNode } from '@/types/tree';
import { cn } from '@/lib/utils';

interface TreeNodeProps {
  node: KnowledgeNode;
  level: number;
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
  onAddChild: (parentId: number) => void;
}

export function TreeNode({ node, level, expandedIds, onToggle, onAddChild }: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  
  // Visual: Choose icon and color based on type
  const Icon = node.node_type === 'TOPIC' ? FileText : Folder;
  const iconColor = node.node_type === 'DOMAIN' ? 'text-amber-500' : 
                    node.node_type === 'SUBJECT' ? 'text-blue-500' : 'text-slate-400';

  return (
    <div className="select-none">
      {/* 1. The Row Itself */}
      <div 
        className={cn(
          "group flex items-center py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer transition-colors border border-transparent",
          isExpanded ? "bg-slate-50 dark:bg-slate-900/50" : ""
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onToggle(node.id)}
      >
        {/* Expand Arrow */}
        <div className="w-5 h-5 flex items-center justify-center mr-1 text-slate-400">
          {hasChildren ? (
            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : <div className="w-4" />}
        </div>

        {/* Node Icon */}
        <Icon className={cn("w-4 h-4 mr-2", iconColor)} />

        {/* Node Name */}
        <span className="text-sm font-medium text-foreground flex-1 truncate">
          {node.name}
        </span>
        
        {/* Node Type Badge (Hidden on small screens) */}
        <span className="text-[10px] font-mono text-muted-foreground mr-3 uppercase tracking-wider hidden sm:block">
          {node.node_type}
        </span>

        {/* Action Buttons (Visible on Hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {node.node_type !== 'TOPIC' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAddChild(node.id); }}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-foreground"
              title="Add Child"
            >
              <Plus size={14} />
            </button>
          )}
          <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-foreground">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* 2. The Children (Recursive Render) */}
      {isExpanded && hasChildren && (
        <div className="border-l border-border ml-4">
          {node.children!.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              level={level + 1} 
              expandedIds={expandedIds}
              onToggle={onToggle}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
