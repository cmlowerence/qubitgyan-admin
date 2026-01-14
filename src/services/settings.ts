import { api, handleApiError } from '@/lib/api';

export interface ProgramContext {
  id: number;
  name: string;
  description?: string;
}

/**
 * Fetch all available contexts (Tags)
 */
export const getContexts = async (): Promise<ProgramContext[]> => {
  try {
    const response = await api.get('/contexts/');
    if (Array.isArray(response.data)) return response.data;
    return response.data.results || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new Context Tag
 */
export const createContext = async (name: string, description?: string): Promise<ProgramContext> => {
  try {
    const response = await api.post('/contexts/', { name, description });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a Context Tag
 */
export const deleteContext = async (id: number): Promise<void> => {
  try {
    await api.delete(`/contexts/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};
