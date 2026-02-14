// src/services/contexts.ts
import { api, handleApiError } from '@/lib/api';

export interface ProgramContext {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  resource_count?: number;
}

/**
 * Fetch all available contexts (Tags)
 * Supports both list and paginated responses from Django
 */
export const getContexts = async (): Promise<ProgramContext[]> => {
  try {
    const response = await api.get('/contexts/');
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
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
 * Update an existing context (Partial Update)
 * Useful for renaming tags without losing their associations
 */
export const updateContext = async (id: number, payload: Partial<Omit<ProgramContext, 'id'>>): Promise<ProgramContext> => {
  try {
    const response = await api.patch(`/contexts/${id}/`, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a Context Tag
 * Note: Only SuperAdmins should typically perform this if it affects many resources
 */
export const deleteContext = async (id: number): Promise<void> => {
  try {
    await api.delete(`/contexts/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Bulk Delete Contexts
 * Useful for cleaning up unused tags in the Admin Panel
 */
export const bulkDeleteContexts = async (ids: number[]): Promise<void> => {
  try {
    await api.post('/contexts/bulk_delete/', { ids });
  } catch (error) {
    throw handleApiError(error);
  }
};