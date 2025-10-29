const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const { bookId, status = 'published', sort = '-createdAt', page = 1, limit = 10 } = req.query;

    const query = { status };

    if (bookId) {
      query.book = bookId;
    }

    const reviews = await Review.find(query)
      .populate('user', 'username avatar')
      .populate('book', 'title author coverImage')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'username avatar bio')
      .populate('book', 'title author coverImage');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { book, title, content, rating, isSpoiler } = req.body;

    // Check if book exists
    const bookExists = await Book.findById(book);
    if (!bookExists) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ book, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this book' });
    }

    // Create review
    const review = await Review.create({
      book,
      user: req.user._id,
      title,
      content,
      rating,
      isSpoiler
    });

    // Update book rating
    const reviews = await Review.find({ book, status: 'published' });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Book.findByIdAndUpdate(book, {
      averageRating: avgRating,
      totalReviews: reviews.length
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username avatar')
      .populate('book', 'title author coverImage');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'username avatar')
     .populate('book', 'title author coverImage');

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/Unlike review
// @route   POST /api/reviews/:id/like
// @access  Private
const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const isLiked = review.likes.includes(req.user._id);

    if (isLiked) {
      // Unlike
      review.likes = review.likes.filter(id => id.toString() !== req.user._id.toString());
      review.totalLikes -= 1;
    } else {
      // Like
      review.likes.push(req.user._id);
      review.totalLikes += 1;
    }

    await review.save();

    res.json({ 
      isLiked: !isLiked,
      totalLikes: review.totalLikes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured reviews
// @route   GET /api/reviews/featured
// @access  Public
const getFeaturedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isFeatured: true, status: 'published' })
      .populate('user', 'username avatar')
      .populate('book', 'title author coverImage')
      .limit(1);

    res.json(reviews[0] || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  getFeaturedReviews
};
