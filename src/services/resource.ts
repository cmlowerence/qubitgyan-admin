import { api, handleApiError } from '@/lib/api';
import { Resource, CreateResourcePayload } from '@/types/resource';

/**
 * Fetch all resources assigned to a specific node.
 * API: GET /api/v1/resources/?node=ID
 */
export const getResourcesByNode = async (nodeId: number): Promise<Resource[]> => {
  try {
    const response = await api.get(`/resources/?node=${nodeId}`);
    
    // FIX: Handle Django Pagination. 
    // If backend sends { count: 1, results: [...] }, we extract 'results'.
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }

    // Fallback: Check if backend sent a plain array [...]
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new resource (PDF, Video, or Link).
 * API: POST /api/v1/resources/
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
 * Delete a resource by its ID.
 * API: DELETE /api/v1/resources/ID/
 */
export const deleteResource = async (id: number): Promise<void> => {
  try {
    await api.delete(`/resources/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update the sort order of resources for a node.
 * API: POST /api/v1/resources/reorder/
 * Body: { ids: [1, 5, 2, ...] }
 */
export const reorderResources = async (ids: number[]): Promise<void> => {
  try {
    await api.post('/resources/reorder/', { ids });
  } catch (error) {
    throw handleApiError(error);
  }
};
