// src\services\media.ts
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
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadMedia = async (file: File): Promise<UploadedMedia> => {
  try {
    const formData = new FormData();
    formData.append('file', file); 

    const response = await api.post('/manager/media/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
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