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

interface ApiUserProfile {
  avatar_url?: string;
  is_suspended?: boolean;
  created_by?: string;
}

interface ApiUserResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser?: boolean;
  created_by?: string | { username?: string };
  avatar_url?: string;
  is_suspended?: boolean;
  profile?: ApiUserProfile;
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
  avatar_url?: string;
  is_suspended?: boolean;
  profile?: {
    avatar_url?: string;
    is_suspended?: boolean;
  };
}

const extractCreatedBy = (createdBy: ApiUserResponse['created_by']): string | undefined => {
  if (!createdBy) return undefined;
  if (typeof createdBy === 'string') return createdBy;
  return createdBy.username;
};

export const normalizeUser = (raw: ApiUserResponse): User => {
  const profile = raw.profile ?? {};

  return {
    id: raw.id,
    username: raw.username,
    email: raw.email,
    first_name: raw.first_name,
    last_name: raw.last_name,
    is_staff: raw.is_staff,
    is_superuser: raw.is_superuser,
    created_by: extractCreatedBy(raw.created_by) ?? profile.created_by,
    avatar_url: raw.avatar_url ?? profile.avatar_url,
    is_suspended: raw.is_suspended ?? profile.is_suspended ?? false,
  };
};

const buildUserPayload = (payload: CreateUserPayload | UpdateUserPayload, useNestedProfile: boolean) => {
  const nextPayload: Record<string, unknown> = { ...payload };
  const payloadWithFlat = payload as UpdateUserPayload;
  const profile = payload.profile as { avatar_url?: string; is_suspended?: boolean } | undefined;
  const avatarUrl = payloadWithFlat.avatar_url ?? profile?.avatar_url;
  const isSuspended = payloadWithFlat.is_suspended ?? profile?.is_suspended;

  if (useNestedProfile) {
    const currentProfile = (payload.profile ?? {}) as Record<string, unknown>;
    nextPayload.profile = {
      ...currentProfile,
      ...(avatarUrl !== undefined ? { avatar_url: avatarUrl } : {}),
      ...(isSuspended !== undefined ? { is_suspended: isSuspended } : {}),
    };
    delete nextPayload.avatar_url;
    delete nextPayload.is_suspended;
  } else {
    if (avatarUrl !== undefined) nextPayload.avatar_url = avatarUrl;
    if (isSuspended !== undefined) nextPayload.is_suspended = isSuspended;
    delete nextPayload.profile;
  }

  return nextPayload;
};

const shouldRetryFlatSerializer = (error: any): boolean => {
  const status = error?.response?.status;
  return status === 400 || status === 422;
};

const createOrUpdateUserWithFallback = async (
  method: 'post' | 'patch',
  url: string,
  payload: CreateUserPayload | UpdateUserPayload
) => {
  try {
    return await api[method](url, buildUserPayload(payload, true));
  } catch (error) {
    if (!shouldRetryFlatSerializer(error)) throw error;
    return api[method](url, buildUserPayload(payload, false));
  }
};

/**
 * Fetch all users
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users/');
    const rawUsers = Array.isArray(response.data) ? response.data : (response.data.results || []);
    return rawUsers.map(normalizeUser);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/users/me/');
    return normalizeUser(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new user (Admin or Student)
 */
export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  try {
    const response = await createOrUpdateUserWithFallback('post', '/users/', payload);
    return normalizeUser(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update an existing user (Edit Profile / Reset Password)
 */
export const updateUser = async (id: number, payload: UpdateUserPayload): Promise<User> => {
  try {
    const response = await createOrUpdateUserWithFallback('patch', `/users/${id}/`, payload);
    return normalizeUser(response.data);
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
    const response = await createOrUpdateUserWithFallback('patch', `/users/${id}/`, {
      is_suspended: isSuspended,
    });
    return normalizeUser(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};
