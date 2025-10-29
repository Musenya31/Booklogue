
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a review title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide review content'],
    minlength: [50, 'Review must be at least 50 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalLikes: {
    type: Number,
    default: 0
  },
  totalComments: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isSpoiler: {
    type: Boolean,
    default: false
  },
  readingTime: {
    type: Number
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate reviews
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Calculate reading time before saving
reviewSchema.pre('save', function(next) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  next();
});

module.exports = mongoose.model('Review', reviewSchema);

