import axios from 'axios';

// Automatically points to your Render Backend
// If you are running backend locally, change this to http://127.0.0.1:8000/api/v1
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qubitgyan-api.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const handleApiError = (error: any) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    throw new Error(error.response.data.detail || 'An error occurred');
  }
  throw error;
};
