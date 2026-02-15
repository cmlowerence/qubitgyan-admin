import { api, handleApiError } from '@/lib/api';

export interface AdminRBACProfile {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  avatar: string | null;
  can_manage_users: boolean;
  can_manage_content: boolean;
  can_approve_admissions: boolean;
}

export interface UpdateRBACPayload {
  can_manage_users?: boolean;
  can_manage_content?: boolean;
  can_approve_admissions?: boolean;
}

export const getAdminsRBAC = async (): Promise<AdminRBACProfile[]> => {
  try {
    const response = await api.get('/manager/rbac/list_admins/');
    return Array.isArray(response.data)
      ? response.data
      : (response.data.results || []);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAdminRBAC = async (
  id: number,
  payload: UpdateRBACPayload
): Promise<any> => {
  try {
    const response = await api.patch(
      `/manager/rbac/${id}/update_permissions/`,
      {
        permissions: payload
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
