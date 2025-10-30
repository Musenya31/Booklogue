import axios from 'axios';

// Base URL without trailing slash
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API = axios.create({
  baseURL: `${BASE_URL}api`, // ✅ Fixed: Added slash before 'api'
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  // Remove leading slash if present
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
  return `${BASE_URL}/${cleanFilename}`;
};

// Helper to get base URL without trailing slash
export const getBaseUrl = () => BASE_URL.replace(/\/$/, ''); // Remove trailing slash if exists

export default API;

