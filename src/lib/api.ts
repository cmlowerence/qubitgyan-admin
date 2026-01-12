import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qubitgyan-backend.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- NEW: Request Interceptor ---
// Before sending ANY request, check if we have a token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- NEW: Response Interceptor ---
// If the backend says "401 Unauthorized" (Token expired/invalid), kick user to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Only redirect if we are not already on the login page
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  if (error.response) {
    throw new Error(error.response.data.detail || JSON.stringify(error.response.data) || 'Server error');
  } else {
    throw new Error(error.message || 'Network Error');
  }
};
