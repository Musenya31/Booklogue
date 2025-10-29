const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserLibrary,
  updateReadingProgress
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile/:id', getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/library', protect, getUserLibrary);
router.post('/library/:bookId', protect, updateReadingProgress);

module.exports = router;
