import API from './api';

export const reviewService = {
  getAllReviews: (params) => API.get('/reviews', { params }),  // ✅ Removed /api
  getBookReviews: (bookId) => API.get('/reviews', { params: { bookId } }),  // ✅
  getReviewById: (id) => API.get(`/reviews/${id}`),  // ✅
  getFeaturedReview: () => API.get('/reviews/featured'),  // ✅
  createReview: (reviewData) => API.post('/reviews', reviewData),  // ✅
  updateReview: (id, reviewData) => API.put(`/reviews/${id}`, reviewData),  // ✅
  deleteReview: (id) => API.delete(`/reviews/${id}`),  // ✅
  likeReview: (id) => API.post(`/reviews/${id}/like`),  // ✅
};
