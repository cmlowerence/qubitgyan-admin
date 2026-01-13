export type ResourceType = 'VIDEO' | 'PDF' | 'LINK' | 'DOCUMENT';

export interface Resource {
  id: number;
  title: string;
  resource_type: ResourceType;
  node: number;
  google_drive_id?: string;
  external_url?: string;
  preview_link?: string;
  created_at: string;
  order: number;
  contexts: any[]; // List of context objects returned by backend
}

export interface CreateResourcePayload {
  title: string;
  resource_type: ResourceType;
  node: number;
  context_ids: number[]; // Critical: Backend needs this as an array of IDs
  google_drive_link?: string;
  external_url?: string;
}
