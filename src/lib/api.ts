import axios from 'axios';

// 1. Sanitize the Base URL (Remove trailing slash if present)
// const RAW_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qubitgyan-api.onrender.com/api/v1';
const RAW_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const API_URL = RAW_URL.replace(/\/+$/, ''); // Removes '/' at the end

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Attach Token & Log URL
api.interceptors.request.use((config) => {
  // Debug: Log the full URL to the console so we can catch 404s
  console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 3. Response Interceptor: Handle 401s
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
