import axios from 'axios';
import { api, handleApiError } from '@/lib/api';

interface LoginResponse {
  access: string;
  refresh: string;
}

// Helper to get the base URL without the '/v1' part if needed
const BASE_DOMAIN = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://qubitgyan-api.onrender.com';

export const loginAdmin = async (username: string, password: string) => {
  try {
    // FIX: Using a direct axios call to avoid the '/v1' prefix issue
    // We try the standard SimpleJWT path: /api/token/
    const response = await axios.post<LoginResponse>(`${BASE_DOMAIN}/api/token/`, {
      username,
      password,
    });
    
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      return true;
    }
    
    return false;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logoutAdmin = () => {
  // 1. Remove Tokens
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  // 2. Force Redirect
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
};
