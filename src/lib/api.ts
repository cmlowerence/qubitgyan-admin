import axios from 'axios';

// 1. Point to your Render Backend
// Ideally, put this in .env.local as NEXT_PUBLIC_API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://YOUR-RENDER-URL.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add a helper to handle errors cleanly
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  if (error.response) {
    // Server responded with an error (4xx, 5xx)
    throw new Error(error.response.data.detail || 'Server error occurred');
  } else if (error.request) {
    // Request made but no response (Network error)
    throw new Error('Cannot reach the server. Check your connection.');
  } else {
    throw new Error(error.message);
  }
};
