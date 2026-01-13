import { api, handleApiError } from '@/lib/api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};
