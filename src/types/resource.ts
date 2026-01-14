export type ResourceType = 'VIDEO' | 'PDF' | 'LINK' | 'DOCUMENT';

// 1. Define a shape for Context to avoid 'any'
export interface ProgramContext {
  id: number;
  name: string;
  description?: string;
}

export interface Resource {
  id: number;
  title: string;
  resource_type: ResourceType;
  node: number;
  
  // Backend sends ID, not the full link
  google_drive_id?: string; 
  
  external_url?: string;
  preview_link?: string;
  created_at: string;
  order: number;
  
  // Updated from any[] to strict type
  contexts: ProgramContext[]; 
}

export interface CreateResourcePayload {
  title: string;
  resource_type: ResourceType;
  node: number;
  context_ids: number[]; 
  google_drive_link?: string; // Only used when sending TO backend
  external_url?: string;
}
