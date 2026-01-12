'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { TreeNode } from '@/components/tree/TreeNode';
import { KnowledgeNode } from '@/types/tree';

// MOCK DATA: We will replace this with API calls later
const INITIAL_DATA: KnowledgeNode[] = [
  {
    id: 1, name: 'Physics', node_type: 'DOMAIN', parent: null,
    children: [
      {
        id: 2, name: 'Mechanics', node_type: 'SUBJECT', parent: 1,
        children: [
          { id: 3, name: 'Kinematics', node_type: 'SECTION', parent: 2, children: [] },
          { id: 4, name: 'Dynamics', node_type: 'SECTION', parent: 2, children: [] }
        ]
      },
      { id: 5, name: 'Thermodynamics', node_type: 'SUBJECT', parent: 1, children: [] }
    ]
  },
  {
    id: 10, name: 'Mathematics', node_type: 'DOMAIN', parent: null,
    children: [
      { id: 11, name: 'Calculus', node_type: 'SUBJECT', parent: 10, children: [] }
    ]
  }
];

export default function TreeEditorPage() {
  const [data, setData] = useState<KnowledgeNode[]>(INITIAL_DATA);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([1])); // Default expand Physics

  // Toggle Collapse/Expand
  const toggleNode = (id: number) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  // Dummy Add Function
  const handleAddChild = (parentId: number) => {
    alert(`Add child to parent ID: ${parentId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Knowledge Tree</h1>
          <p className="text-muted-foreground">Manage the hierarchy of domains, subjects, and topics.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
          <Plus size={16} />
          <span>New Domain</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search nodes..." 
            className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <button className="p-2 border border-input rounded-md hover:bg-accent text-muted-foreground">
          <Filter size={18} />
        </button>
      </div>

      {/* The Tree Visualizer */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Hierarchy</span>
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider hidden sm:block">Type</span>
        </div>
        
        <div className="p-2">
          {data.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              expandedIds={expanded}
              onToggle={toggleNode}
              onAddChild={handleAddChild}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
