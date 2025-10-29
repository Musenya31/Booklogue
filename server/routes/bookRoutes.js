const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getFeaturedBooks
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getBooks);
router.get('/featured', getFeaturedBooks);
router.get('/:id', getBookById);

// Protected routes
router.post('/', protect, createBook);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);

module.exports = router;

