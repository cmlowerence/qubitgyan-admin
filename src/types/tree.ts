export type NodeType = 'DOMAIN' | 'SUBJECT' | 'SECTION' | 'TOPIC';

export interface KnowledgeNode {
  id: number;
  name: string;
  node_type: NodeType;
  parent: number | null;
  children?: KnowledgeNode[]; // For recursive structure
  order?: number;
  is_active?: boolean;
}

export interface CreateNodePayload {
  name: string;
  node_type: NodeType;
  parent?: number | null;
}
