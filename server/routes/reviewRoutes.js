const express = require('express');
const router = express.Router();
const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  getFeaturedReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getReviews)
  .post(protect, createReview);

router.get('/featured', getFeaturedReviews);

router.route('/:id')
  .get(getReviewById)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.post('/:id/like', protect, likeReview);

module.exports = router;
