// src/services/progress.ts
import { api, handleApiError } from '@/lib/api';

export interface ProgressRecord {
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
 * Fetch all student progress records for the admin dashboard.
 * Points to: /api/v1/progress/all_admin_view/
 */
export const getAllStudentProgress = async (): Promise<ProgressRecord[]> => {
  try {
    // We use '/progress/' because that is the name in your router: 
    // router.register(r'progress', StudentProgressViewSet...)
    const response = await api.get('/progress/all_admin_view/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw handleApiError(error);
  }
};
