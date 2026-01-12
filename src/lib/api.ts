import axios from 'axios';

// Automatically choose the right URL based on where we are
// In development (local), we might point to localhost, but for now we point to Render.
// TIP: You can change this to your localhost IP if debugging on phone.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qubitgyan-api.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to handle errors gracefully
export const handleApiError = (error: any) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    throw new Error(error.response.data.detail || 'An error occurred');
  }
  throw error;
};
