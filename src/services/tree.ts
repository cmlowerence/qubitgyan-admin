import { api, handleApiError } from '@/lib/api';
import { KnowledgeNode, CreateNodePayload, UpdateNodePayload } from '@/types/tree';

// 1. Fetch the entire tree
export const getKnowledgeTree = async (): Promise<KnowledgeNode[]> => {
  try {
    // ?all=false returns only root nodes (domains), which is good for initial load
    // If you want the WHOLE tree at once, change to ?all=true
    const response = await api.get('/nodes/'); 
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 2. Create a new Node
export const createKnowledgeNode = async (payload: CreateNodePayload): Promise<KnowledgeNode> => {
  try {
    const response = await api.post('/nodes/', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 3. Update a Node (Rename, Reorder, add Thumbnail)
export const updateKnowledgeNode = async (id: number, payload: UpdateNodePayload): Promise<KnowledgeNode> => {
  try {
    const response = await api.patch(`/nodes/${id}/`, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 4. Delete a Node
export const deleteKnowledgeNode = async (id: number): Promise<void> => {
  try {
    await api.delete(`/nodes/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};
