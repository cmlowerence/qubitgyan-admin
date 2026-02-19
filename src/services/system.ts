import { api, handleApiError } from '@/lib/api';

export interface HealthStatus {
  status: string;
  database: string;
  cache: string;
}

export const getSystemHealth = async (): Promise<HealthStatus> => {
  try {
    const response = await api.get('/system/health/');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
