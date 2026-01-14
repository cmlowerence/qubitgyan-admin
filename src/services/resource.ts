import { api, handleApiError } from '@/lib/api';
import { Resource, CreateResourcePayload } from '@/types/resource';

interface ResourceParams {
  search?: string;
  type?: string;
  context?: string;
}

/**
 * Fetch all resources (Global Library) with optional filters
 * API: GET /api/v1/resources/?type=PDF&search=...
 */
export const getAllResources = async (params?: ResourceParams): Promise<Resource[]> => {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.type && params.type !== 'ALL') query.append('type', params.type);
    if (params?.context && params.context !== 'ALL') query.append('context', params.context);

    const response = await api.get(`/resources/?${query.toString()}`);
    
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fetch resources for a specific node (Folder View)
 */
export const getResourcesByNode = async (nodeId: number): Promise<Resource[]> => {
  try {
    const response = await api.get(`/resources/?node=${nodeId}`);
    
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update a resource (Title, URL, Context)
 */
export const updateResource = async (id: number, payload: Partial<CreateResourcePayload>): Promise<Resource> => {
  try {
    const response = await api.patch(`/resources/${id}/`, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new resource
 */
export const createResource = async (payload: CreateResourcePayload): Promise<Resource> => {
  try {
    const response = await api.post('/resources/', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a resource
 */
export const deleteResource = async (id: number): Promise<void> => {
  try {
    await api.delete(`/resources/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update sort order
 */
export const reorderResources = async (ids: number[]): Promise<void> => {
  try {
    await api.post('/resources/reorder/', { ids });
  } catch (error) {
    throw handleApiError(error);
  }
};
