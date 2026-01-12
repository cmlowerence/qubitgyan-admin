'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { TreeNode } from '@/components/tree/TreeNode';
import { CreateNodeModal } from '@/components/tree/CreateNodeModal'; // Import Modal
import { KnowledgeNode, NodeType, CreateNodePayload } from '@/types/tree';

// Helper to determine next type
const getChildType = (parentType: NodeType): NodeType => {
  if (parentType === 'DOMAIN') return 'SUBJECT';
  if (parentType === 'SUBJECT') return 'SECTION';
  return 'TOPIC';
};

const INITIAL_DATA: KnowledgeNode[] = [
  {
    id: 1, name: 'Physics', node_type: 'DOMAIN', parent: null,
    children: [
      {
        id: 2, name: 'Mechanics', node_type: 'SUBJECT', parent: 1,
        children: []
      }
    ]
  }
];

export default function TreeEditorPage() {
  const [data, setData] = useState<KnowledgeNode[]>(INITIAL_DATA);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([1]));
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeParent, setActiveParent] = useState<{id: number, name: string, type: NodeType} | null>(null);

  const toggleNode = (id: number) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  // 1. Open Modal for Root Level (Domain)
  const handleAddDomain = () => {
    setActiveParent(null); // No parent = Root
    setIsModalOpen(true);
  };

  // 2. Open Modal for Child
  const handleAddChild = (parentId: number) => {
    // Find the parent node in our data (simple search for mock data)
    // In real app, you might have a map or search recursively
    const findNode = (nodes: KnowledgeNode[]): KnowledgeNode | null => {
      for (const node of nodes) {
        if (node.id === parentId) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const parent = findNode(data);
    if (parent) {
      setActiveParent({ 
        id: parent.id, 
        name: parent.name, 
        type: parent.node_type 
      });
      setIsModalOpen(true);
    }
  };

  // 3. Handle Form Submit (Mock Logic)
  const handleCreateNode = async (payload: CreateNodePayload) => {
    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newNode: KnowledgeNode = {
      id: Date.now(), // Fake ID
      name: payload.name,
      node_type: payload.node_type,
      parent: payload.parent || null,
      children: []
    };

    // Update State (Complex recursive update for nested nodes)
    if (!payload.parent) {
      // Adding a new Root Domain
      setData([...data, newNode]);
    } else {
      // Adding a child deep in the tree
      const addNodeRecursive = (nodes: KnowledgeNode[]): KnowledgeNode[] => {
        return nodes.map(node => {
          if (node.id === payload.parent) {
            return {
              ...node,
              children: [...(node.children || []), newNode]
            };
          }
          if (node.children) {
            return {
              ...node,
              children: addNodeRecursive(node.children)
            };
          }
          return node;
        });
      };
      setData(addNodeRecursive(data));
      
      // Auto-expand the parent so we see the new child
      setExpanded(prev => new Set(prev).add(payload.parent!));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Knowledge Tree</h1>
          <p className="text-muted-foreground">Manage the hierarchy of domains, subjects, and topics.</p>
        </div>
        <button 
          onClick={handleAddDomain}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
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

      {/* Tree Visualizer */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Hierarchy</span>
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider hidden sm:block">Type</span>
        </div>
        
        <div className="p-2 min-h-[300px]">
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
          {data.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No nodes found. Start by creating a Domain.
            </div>
          )}
        </div>
      </div>

      {/* Modal Injection */}
      <CreateNodeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateNode}
        parentId={activeParent?.id || null}
        parentName={activeParent?.name}
        suggestedType={activeParent ? getChildType(activeParent.type) : 'DOMAIN'}
      />
    </div>
  );
}
