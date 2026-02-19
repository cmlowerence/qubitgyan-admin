import axios from 'axios';
import { handleApiError } from '@/lib/api';

interface LoginResponse {
  access: string;
  refresh: string;
}

const resolveTokenUrl = () => {
  const configured = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').trim();

  if (/^https?:\/\//i.test(configured)) return configured.replace(/\/api\/v1\/?$/, '');

  if (configured.startsWith('/')) {
    const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN?.trim();
    if (backendOrigin) return backendOrigin.replace(/\/+$/, '');
    if (typeof window !== 'undefined') return window.location.origin;
  }

  return 'http://localhost:8000';
};

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await axios.post<LoginResponse>(`${resolveTokenUrl()}/api/token/`, {
      username: email,
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
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
};
