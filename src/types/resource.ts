export type ResourceType = 'VIDEO' | 'PDF' | 'LINK' | 'DOCUMENT';

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
  node_name?: string;
  google_drive_id?: string;
  external_url?: string;
  preview_link?: string;
  created_at: string;
  order: number;
  contexts: ProgramContext[];
}

export interface CreateResourcePayload {
  title: string;
  resource_type: ResourceType;
  node: number;
  context_ids: number[];
  google_drive_link?: string;
  external_url?: string;
}
