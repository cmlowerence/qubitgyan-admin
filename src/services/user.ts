import { api, handleApiError } from '@/lib/api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean; // True = Admin, False = Student
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

/**
 * Fetch all users
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users/');
    if (Array.isArray(response.data)) return response.data;
    return response.data.results || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new user (Admin or Student)
 */
export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  try {
    const response = await api.post('/users/', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};
