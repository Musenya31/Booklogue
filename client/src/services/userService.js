import API from './api';

export const userService = {
  getUserProfile: (id) => API.get(`/api/users/profile/${id}`),
  updateProfile: (data) => API.put('/api/users/profile', data),
  getLibrary: (status) => API.get('/api/users/library', { params: { status } }),
  updateReadingProgress: (bookId, progressData) =>
    API.post(`/api/users/library/${bookId}`, progressData),
  uploadFile: (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('token');
  return API.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
},
};
