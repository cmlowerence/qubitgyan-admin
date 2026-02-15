// src/services/media.ts
import { api, handleApiError } from '@/lib/api';

export interface StorageStatus {
  used_bytes: number;
  limit_bytes: number;
  usage_percentage: number;
  formatted_used: string;
  formatted_limit: string;
}

export interface UploadedMedia {
  id: number;
  file: string;
  filename?: string;
  category?: string;
  size?: number;
  created_at: string;
}

export const getStorageStatus = async (): Promise<StorageStatus> => {
  try {
    const response = await api.get('/manager/media/storage_status/');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getMediaList = async (): Promise<UploadedMedia[]> => {
  try {
    const response = await api.get('/manager/media/');
    const raw = Array.isArray(response.data) ? response.data : (response.data.results || []);

    // Normalize backend fields to the frontend shape the UI expects.
    return raw.map((r: any) => ({
      id: r.id,
      file: r.public_url || r.file || '',
      filename: r.name || r.filename || (r.public_url ? r.public_url.split('/').pop() : ''),
      category: r.category || r.meta?.category || undefined,
      size: r.file_size_bytes ?? (r.size_kb ? Math.round((r.size_kb || 0) * 1024) : undefined),
      created_at: r.uploaded_at || r.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadMedia = async (file: File, filename?: string, category?: string): Promise<UploadedMedia> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    // backend expects the field name `name` (not `filename`)
    formData.append('name', (filename || file.name));
    if (category) formData.append('category', category);

    // Let axios set the multipart boundary for us (do not set Content-Type manually)
    const response = await api.post('/manager/media/upload/', formData);

    // Prefer full UploadedImage object from backend when available.
    const d = response.data || {};

    return {
      id: d.id ?? (d.pk ?? -1),
      file: d.public_url || d.file || '',
      filename: d.name || filename || file.name,
      category: d.category || category || undefined,
      size: d.file_size_bytes ?? (d.size_kb ? Math.round((d.size_kb || 0) * 1024) : file.size),
      created_at: d.uploaded_at || d.created_at || new Date().toISOString(),
    } as UploadedMedia;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteMedia = async (id: number): Promise<void> => {
  try {
    await api.delete(`/manager/media/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};