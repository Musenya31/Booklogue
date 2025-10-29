const User = require('../models/User');
const ReadingProgress = require('../models/ReadingProgress');

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;
      user.avatar = req.body.avatar || user.avatar;
      user.favoriteGenres = req.body.favoriteGenres || user.favoriteGenres;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        favoriteGenres: updatedUser.favoriteGenres
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's reading progress
// @route   GET /api/users/library
// @access  Private
const getUserLibrary = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const library = await ReadingProgress.find(query)
      .populate('book', 'title author coverImage pages')
      .sort('-lastReadAt');

    res.json(library);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reading progress
// @route   POST /api/users/library/:bookId
// @access  Private
const updateReadingProgress = async (req, res) => {
  try {
    const { status, currentPage, notes, highlights } = req.body;

    let progress = await ReadingProgress.findOne({
      user: req.user._id,
      book: req.params.bookId
    });

    if (progress) {
      // Update existing
      progress.status = status || progress.status;
      progress.currentPage = currentPage !== undefined ? currentPage : progress.currentPage;
      progress.lastReadAt = Date.now();

      if (notes) progress.notes.push(notes);
      if (highlights) progress.highlights.push(highlights);

      if (status === 'finished' && !progress.finishedAt) {
        progress.finishedAt = Date.now();
      }

      await progress.save();
    } else {
      // Create new
      progress = await ReadingProgress.create({
        user: req.user._id,
        book: req.params.bookId,
        status: status || 'want-to-read',
        currentPage: currentPage || 0,
        startedAt: status === 'currently-reading' ? Date.now() : undefined
      });
    }

    const populatedProgress = await ReadingProgress.findById(progress._id)
      .populate('book', 'title author coverImage pages');

    res.json(populatedProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserLibrary,
  updateReadingProgress
};
