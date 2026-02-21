import { api, handleApiError } from '@/lib/api';
import { KnowledgeNode, CreateNodePayload, UpdateNodePayload } from '@/types/tree';

export type TreeDepth = 1 | 2 | 3 | 'full';

const unwrapList = (data: any) => {
  return Array.isArray(data) ? data : (data?.results || []);
};

export const getKnowledgeTree = async (depth: TreeDepth = 1): Promise<KnowledgeNode[]> => {
  try {
    const response = await api.get('/manager/nodes/', { params: { depth } });
    return unwrapList(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getKnowledgeNode = async (id: number, depth: TreeDepth = 2): Promise<KnowledgeNode> => {
  try {
    const response = await api.get(`/manager/nodes/${id}/`, { params: { depth } });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createKnowledgeNode = async (payload: CreateNodePayload): Promise<KnowledgeNode> => {
  try {
    const response = await api.post('/manager/nodes/', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateKnowledgeNode = async (id: number, payload: UpdateNodePayload): Promise<KnowledgeNode> => {
  try {
    const response = await api.patch(`/manager/nodes/${id}/`, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteKnowledgeNode = async (id: number): Promise<void> => {
  try {
    await api.delete(`/manager/nodes/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};