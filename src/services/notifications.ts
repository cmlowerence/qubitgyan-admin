import { api, handleApiError } from '@/lib/api';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  target_user?: number | null;
  created_at: string;
}

export interface CreateNotificationPayload {
  title: string;
  message: string;
  target_user?: number | null;
}

export const getManagerNotifications = async (): Promise<AppNotification[]> => {
  try {
    const response = await api.get('/manager/notifications/');
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createNotification = async (payload: CreateNotificationPayload): Promise<AppNotification> => {
  try {
    const response = await api.post('/manager/notifications/', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
export const deleteNotification = async (id: number): Promise<void> => {
  try {
    await api.delete(`/manager/notifications/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};