import { useState } from 'react';
import { reviewService } from '../services/reviewService';

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = async (params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.getAllReviews(params);
      setReviews(response.data.reviews);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reviews');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getReview = async (id) => {
    try {
      setLoading(true);
      const response = await reviewService.getReviewById(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch review');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData) => {
    try {
      setLoading(true);
      const response = await reviewService.createReview(reviewData);
      setReviews(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create review');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (id, reviewData) => {
    try {
      setLoading(true);
      const response = await reviewService.updateReview(id, reviewData);
      setReviews(prev => prev.map(review => 
        review._id === id ? response.data : review
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update review');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    try {
      setLoading(true);
      await reviewService.deleteReview(id);
      setReviews(prev => prev.filter(review => review._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likeReview = async (id) => {
    try {
      const response = await reviewService.likeReview(id);
      setReviews(prev => prev.map(review => 
        review._id === id 
          ? { ...review, totalLikes: response.data.totalLikes }
          : review
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    likeReview,
  };
};