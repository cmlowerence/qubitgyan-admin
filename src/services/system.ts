import { api, handleApiError } from '@/lib/api';

export interface HealthStatus {
  status: string;
  database: string;
  cache: string;
}

export const getSystemHealth = async (): Promise<HealthStatus> => {
  try {
    const endpoints = ['/system/health/', '/manager/system/health/', '/health/'];
    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint);
        return response.data;
      } catch (error: any) {
        if (error?.response?.status !== 404) throw error;
      }
    }
    throw new Error('Health endpoint not found.');
  } catch (error) {
    throw handleApiError(error);
  }
};
