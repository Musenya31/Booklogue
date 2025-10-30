import API from './api';

export const authService = {
  // Register
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);  // ✅ Removed /api
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);  // ✅ Removed /api
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get me
  getMe: () => API.get('/auth/me'),  // ✅ Removed /api
};
