import { api, handleApiError } from '@/lib/api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;      // True = Admin, False = Student
  is_superuser?: boolean; // True = Super Admin
  
  // New Profile Fields
  created_by?: string;    // Username of the creator
  avatar_url?: string;
  is_suspended?: boolean;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  
  profile?: {
    avatar_url?: string;
  };
}

// NEW: Payload for editing (all fields optional)
export interface UpdateUserPayload {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string; // Include this to reset password
  profile?: {
    avatar_url?: string;
  };
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
 * Update an existing user (Edit Profile / Reset Password)
 */
export const updateUser = async (id: number, payload: UpdateUserPayload): Promise<User> => {
  try {
    const response = await api.patch(`/users/${id}/`, payload);
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

/**
 * Toggle Suspension Status (Suspend / Unsuspend)
 */
export const toggleSuspendUser = async (id: number, isSuspended: boolean): Promise<User> => {
  try {
    // We update the profile via the nested serializer structure
    const response = await api.patch(`/users/${id}/`, {
      profile: { is_suspended: isSuspended }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
