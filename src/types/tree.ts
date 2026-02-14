// src/types/tree.ts
export type NodeType = 'DOMAIN' | 'SUBJECT' | 'SECTION' | 'TOPIC';

export interface KnowledgeNode {
  id: number;
  name: string;
  node_type: NodeType;
  parent: number | null;
  order: number;
  thumbnail_url?: string;
  is_active: boolean;
  children?: KnowledgeNode[];
  resource_count?: number;  // NEW: Backend sends this count
}

export interface CreateNodePayload {
  name: string;
  node_type: NodeType;
  parent?: number | null;
  order?: number;
  thumbnail_url?: string;
}

export interface UpdateNodePayload {
  name?: string;
  order?: number;
  thumbnail_url?: string;
  is_active?: boolean;
}
