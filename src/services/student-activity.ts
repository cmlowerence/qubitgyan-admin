import { api, handleApiError } from '@/lib/api';

export interface AdminProgressRecord {
  id: number;
  user_details: {
    username: string;
    email: string;
  };
  resource_details: {
    title: string;
    resource_type: string;
  };
  is_completed: boolean;
  last_accessed: string;
}

/**
 * Fetch all student progress records (Admin Only View)
 */
export const getAllStudentActivity = async (): Promise<AdminProgressRecord[]> => {
  try {
    const response = await api.get('/progress/all_admin_view/');
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  } catch (error) {
    throw handleApiError(error);
  }
};