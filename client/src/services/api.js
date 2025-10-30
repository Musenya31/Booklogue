import axios from 'axios';

// Ensure BASE_URL has NO trailing slash
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const API = axios.create({
  baseURL: `${BASE_URL}/api`, // ✅ /api back in baseURL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ FIXED: Use backticks for template literal
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to get PDF/upload URLs (bypasses /api prefix)
export const getUploadUrl = (filename) => {
  if (!filename) return '';
  
  // If already a full URL, return as-is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // Remove ALL leading slashes (handles both / and //)
  const cleanFilename = filename.replace(/^\/+/, '');
  
  // Return BASE_URL + / + cleanFilename
  return `${BASE_URL}/${cleanFilename}`;
};

// Helper to get base URL
export const getBaseUrl = () => BASE_URL;

export default API;
