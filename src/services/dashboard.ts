// src/services/dashboard.ts
import { api, handleApiError } from '@/lib/api';
import { Resource } from '@/types/resource';

export interface DashboardCounts {
  nodes: number;
  admins: number;
  students: number;
  resources: number;
}

export interface DistributionData {
  resource_type: string;
  count: number;
}

export interface TopSubjectData {
  name: string;
  resource_count: number;
}

export interface DashboardResponse {
  counts: DashboardCounts;
  charts: {
    distribution: DistributionData[];
    top_subjects: TopSubjectData[];
  };
  recent_activity: Resource[];
}

export const getDashboardStats = async (): Promise<DashboardResponse> => {
  try {
    const response = await api.get('/dashboard/stats/');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};