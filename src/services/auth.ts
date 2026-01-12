import { api, handleApiError } from '@/lib/api';

interface LoginResponse {
  access: string;
  refresh: string;
}

export const loginAdmin = async (username: string, password: string) => {
  try {
    // Note: This endpoint must match your backend URL structure
    // Based on your memory prompt, it is likely '/auth/token/' or '/token/' 
    // Let's try the standard SimpleJWT path usually set in urls.py
    const response = await api.post<LoginResponse>('/auth/token/', {
      username,
      password,
    });
    
    // Save tokens to LocalStorage
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    
    return true;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};
