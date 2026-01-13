export type ResourceType = 'VIDEO' | 'PDF' | 'LINK' | 'DOCUMENT';

export interface Resource {
  id: number;
  title: string;
  resource_type: ResourceType;
  file_url?: string;
  external_url?: string;
  node: number; // The ID of the Topic it belongs to
  is_active: boolean;
  created_at: string;
}

export interface CreateResourcePayload {
  title: string;
  resource_type: ResourceType;
  node: number;
  file_url?: string;
  external_url?: string;
}
