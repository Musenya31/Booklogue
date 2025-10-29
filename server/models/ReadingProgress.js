
const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  status: {
    type: String,
    enum: ['want-to-read', 'currently-reading', 'finished'],
    default: 'want-to-read'
  },
  currentPage: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startedAt: Date,
  finishedAt: Date,
  lastReadAt: {
    type: Date,
    default: Date.now
  },
  notes: [{
    page: Number,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  highlights: [{
    text: String,
    page: Number,
    color: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Compound index
readingProgressSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);

