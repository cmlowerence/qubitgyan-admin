import { api, handleApiError } from '@/lib/api';
import { Resource, CreateResourcePayload } from '@/types/resource';

export const getResourcesByNode = async (nodeId: number): Promise<Resource[]> => {
  try {
    // Uses the filter we saw in your Django views.py: queryset.filter(node_id=node_id)
    const response = await api.get(`/resources/?node=${nodeId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createResource = async (payload: CreateResourcePayload): Promise<Resource> => {
  try {
    const response = await api.post('/resources/', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteResource = async (id: number): Promise<void> => {
  try {
    await api.delete(`/resources/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};
