'use client';

import React from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, MoreHorizontal, Plus } from 'lucide-react';
import { KnowledgeNode } from '@/types/tree';
import { cn } from '@/lib/utils';

interface TreeNodeProps {
  node: KnowledgeNode;
  level: number;
  expandedIds: Set<number>; // <--- CHANGED: Receive the full list, not just a boolean
  onToggle: (id: number) => void;
  onAddChild: (parentId: number) => void;
}

export function TreeNode({ node, level, expandedIds, onToggle, onAddChild }: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  
  // Check if THIS specific node is in the expanded list
  const isExpanded = expandedIds.has(node.id);
  
  // Choose icon based on type
  const Icon = node.node_type === 'TOPIC' ? FileText : Folder;
  const iconColor = node.node_type === 'DOMAIN' ? 'text-amber-500' : 'text-blue-500';

  return (
    <div className="group">
      {/* The Row */}
      <div 
        className={cn(
          "flex items-center py-2 px-2 hover:bg-slate-100 rounded-md cursor-pointer transition-colors",
          isExpanded ? "bg-slate-50" : ""
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onToggle(node.id)}
      >
        {/* Expand Arrow */}
        <div className="w-5 h-5 flex items-center justify-center mr-1 text-slate-400">
          {hasChildren && (
            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          )}
        </div>

        {/* Icon */}
        <Icon className={cn("w-4 h-4 mr-2", iconColor)} />

        {/* Name */}
        <span className="text-sm font-medium text-slate-700 flex-1">{node.name}</span>

        {/* Action Buttons (Visible on Hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {node.node_type !== 'TOPIC' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAddChild(node.id); }}
              className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900"
              title="Add Child"
            >
              <Plus size={14} />
            </button>
          )}
          <button className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Recursive Children Rendering */}
      {isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              level={level + 1} 
              expandedIds={expandedIds} // <--- FIXED: Pass the set down
              onToggle={onToggle}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
