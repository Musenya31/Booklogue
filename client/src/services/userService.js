import API from './api';

export const userService = {
  getUserProfile: (id) => API.get(`users/profile/${id}`),  // ✅ Removed /api
  updateProfile: (data) => API.put('users/profile', data),  // ✅
  getLibrary: (status) => API.get('users/library', { params: { status } }),  // ✅
  updateReadingProgress: (bookId, progressData) =>
    API.post(`users/library/${bookId}`, progressData),  // ✅
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    return API.post('upload', formData, {  // ✅ Removed /api
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
