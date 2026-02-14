// src/services/auth.ts
import axios from 'axios';
import { handleApiError } from '@/lib/api';

interface LoginResponse {
  access: string;
  refresh: string;
}

// Extract base domain from API URL
const BASE_DOMAIN = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://qubitgyan-api.onrender.com';

export const loginAdmin = async (email: string, password: string) => {
  try {
    // Backend Map specifies inputting the email into the 'username' field
    const response = await axios.post<LoginResponse>(`${BASE_DOMAIN}/api/token/`, {
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