// src/lib/api.ts
import axios from 'axios';

const RAW_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const API_URL = RAW_URL.replace(/\/+$/, ''); // Remove trailing slashes

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to all requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Redirect to login on 401 Unauthorized response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error: any) => {
  console.error('API Error Object:', error);
  if (error.response) {
    // Return detailed server message
    const msg = error.response.data.detail || JSON.stringify(error.response.data);
    throw new Error(msg || `Server Error (${error.response.status})`);
  } else {
    throw new Error(error.message || 'Network Error');
  }
};
