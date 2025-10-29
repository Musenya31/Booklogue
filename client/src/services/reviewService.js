
import API from './api';

export const reviewService = {
  // Get all reviews
  getAllReviews: (params) => API.get('/reviews', { params }),
  
  // Get reviews for a book
  getBookReviews: (bookId) => API.get('/reviews', { params: { bookId } }),
  
  // Get single review
  getReviewById: (id) => API.get(`/reviews/${id}`),
  
  // Get featured review
  getFeaturedReview: () => API.get('/reviews/featured'),
  
  // Create review
  createReview: (reviewData) => API.post('/reviews', reviewData),
  
  // Update review
  updateReview: (id, reviewData) => API.put(`/reviews/${id}`, reviewData),
  
  // Delete review
  deleteReview: (id) => API.delete(`/reviews/${id}`),
  
  // Like review
  likeReview: (id) => API.post(`/reviews/${id}/like`),
};
