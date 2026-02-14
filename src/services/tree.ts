// src/services/tree.ts
import { api, handleApiError } from '@/lib/api';
import { KnowledgeNode, CreateNodePayload, UpdateNodePayload } from '@/types/tree';

export const getKnowledgeTree = async (): Promise<KnowledgeNode[]> => {
  try {
    const response = await api.get('/nodes/');
    
    // SMART UNWRAP: Check if the data is paginated (Django default) or flat
    if (response.data.results && Array.isArray(response.data.results)) {
      // Backend sent: { count: 5, results: [...] }
      return response.data.results;
    } else if (Array.isArray(response.data)) {
      // Backend sent: [...] (Raw list)
      return response.data;
    }
    
    // If we get here, the backend sent something weird
    console.error("Unexpected API response format:", response.data);
    return []; 
    
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createKnowledgeNode = async (payload: CreateNodePayload): Promise<KnowledgeNode> => {
  try {
    const response = await api.post('/nodes/', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateKnowledgeNode = async (id: number, payload: UpdateNodePayload): Promise<KnowledgeNode> => {
  try {
    const response = await api.patch(`/nodes/${id}/`, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteKnowledgeNode = async (id: number): Promise<void> => {
  try {
    await api.delete(`/nodes/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getKnowledgeNode = async (id: number): Promise < KnowledgeNode > => {
  try {
    const response = await api.get(`/nodes/${id}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};