import { api, handleApiError } from '@/lib/api';

export interface AdminRBACProfile {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  avatar_url: string | null;
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
    const endpoints = ['/manager/rbac/'];
    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint);
        return Array.isArray(response.data) ? response.data : response.data.results || [];
      } catch (error: any) {
        if (error?.response?.status !== 404) throw error;
      }
    }
    throw new Error('RBAC endpoint not found.');
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAdminRBAC = async (id: number, payload: UpdateRBACPayload): Promise<any> => {
  try {
    const endpoints = [`/manager/rbac/${id}/update_permissions/`, `/rbac/${id}/update_permissions/`];
    for (const endpoint of endpoints) {
      try {
        const response = await api.patch(endpoint, { permissions: payload });
        return response.data;
      } catch (error: any) {
        if (error?.response?.status !== 404) throw error;
      }
    }
    throw new Error('RBAC update endpoint not found.');
  } catch (error) {
    throw handleApiError(error);
  }
};
