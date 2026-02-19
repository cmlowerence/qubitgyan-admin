import axios from 'axios';

const normalize = (url: string) => url.replace(/\/+$/, '');

const resolveApiUrl = () => {
  const configured = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').trim();

  if (/^https?:\/\//i.test(configured)) {
    return normalize(configured);
  }

  if (configured.startsWith('/')) {
    const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN?.trim();
    if (backendOrigin) return `${normalize(backendOrigin)}${configured}`;

    if (typeof window !== 'undefined') return `${window.location.origin}${configured}`;
  }

  return normalize(configured);
};

export const api = axios.create({
  baseURL: resolveApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (config.url && !/^https?:\/\//i.test(config.url)) {
    config.url = config.url.replace(/^\/+/, '');
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  const payload = error?.response?.data;

  if (typeof payload === 'string' && payload.toLowerCase().includes('<!doctype html')) {
    throw new Error('Backend endpoint not found. Check NEXT_PUBLIC_API_URL / NEXT_PUBLIC_BACKEND_ORIGIN configuration.');
  }

  if (error.response) {
    const msg = payload?.detail || payload?.message || JSON.stringify(payload);
    throw new Error(msg || `Server Error (${error.response.status})`);
  }

  throw new Error(error.message || 'Network Error');
};
