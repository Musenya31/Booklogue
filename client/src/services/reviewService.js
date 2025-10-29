import API from './api';

export const reviewService = {
  getAllReviews: (params) => API.get('/api/reviews', { params }),
  getBookReviews: (bookId) => API.get('/api/reviews', { params: { bookId } }),
  getReviewById: (id) => API.get(`/api/reviews/${id}`),
  getFeaturedReview: () => API.get('/api/reviews/featured'),
  createReview: (reviewData) => API.post('/api/reviews', reviewData),
  updateReview: (id, reviewData) => API.put(`/api/reviews/${id}`, reviewData),
  deleteReview: (id) => API.delete(`/api/reviews/${id}`),
  likeReview: (id) => API.post(`/api/reviews/${id}/like`),
};