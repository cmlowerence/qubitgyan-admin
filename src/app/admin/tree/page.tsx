'use client';

import React, { useState } from 'react';
import { TreeNode } from '@/components/tree/TreeNode';
import { KnowledgeNode } from '@/types/tree';
import { Network, Plus } from 'lucide-react';

// --- DUMMY DATA (For Testing Design) ---
const INITIAL_DATA: KnowledgeNode[] = [
  {
    id: 1, name: 'Science', node_type: 'DOMAIN', parent: null,
    children: [
      {
        id: 2, name: 'Physics', node_type: 'SUBJECT', parent: 1,
        children: [
          { id: 4, name: 'Thermodynamics', node_type: 'SECTION', parent: 2, children: [] },
          { id: 5, name: 'Kinematics', node_type: 'SECTION', parent: 2, children: [] }
        ]
      },
      { id: 3, name: 'Chemistry', node_type: 'SUBJECT', parent: 1, children: [] }
    ]
  },
  {
    id: 10, name: 'Mathematics', node_type: 'DOMAIN', parent: null, children: []
  }
];

export default function TreeEditorPage() {
  const [nodes, setNodes] = useState(INITIAL_DATA);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([1])); // Default expand first item

  const toggleNode = (id: number) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const handleAddChild = (parentId: number) => {
    alert(`This will open a modal to add a child to Node ID: ${parentId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Network className="h-6 w-6 text-amber-500" />
            Knowledge Tree
          </h1>
          <p className="text-slate-500">Manage the structure of your syllabus here.</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2 transition-colors">
          <Plus size={16} />
          New Domain
        </button>
      </div>

      {/* Tree Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Structure</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</span>
        </div>
        
        <div className="p-4 min-h-[400px]">
          {nodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              isExpanded={expanded.has(node.id)}
              onToggle={toggleNode}
              onAddChild={handleAddChild}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
