// src/services/search.ts
import { api, handleApiError } from '@/lib/api';

export interface SearchResult {
  type: 'NODE' | 'RESOURCE' | 'USER';
  id: number;
  title: string;
  subtitle: string;
  url: string;
}

export const globalSearch = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await api.get(`/global-search/?q=${query}`);
    return response.data.results || response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
