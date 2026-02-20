import { api, handleApiError } from '@/lib/api';
import { KnowledgeNode, CreateNodePayload, UpdateNodePayload } from '@/types/tree';

export type TreeDepth = 1 | 2 | 3 | 'full';

const unwrapList = (data: any) => {
  if (data?.results && Array.isArray(data.results)) return data.results;
  return Array.isArray(data) ? data : [];
};

export const getKnowledgeTree = async (depth: TreeDepth = 1): Promise<KnowledgeNode[]> => {
  try {
    const response = await api.get('/nodes/', { params: { depth } });
    return unwrapList(response.data);
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

export const getKnowledgeNode = async (id: number, depth: TreeDepth = 2): Promise<KnowledgeNode> => {
  try {
    const response = await api.get(`/nodes/${id}/`, { params: { depth } });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
