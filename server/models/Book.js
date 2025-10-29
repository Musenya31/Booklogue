const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  coverImage: { type: String, default: '' },
  genres: [{ type: String, required: true }],
  pages: { type: Number, default: 0 },
  publishedYear: { type: Number },
  language: { type: String, default: 'English' },
  publisher: { type: String },
  isbn: { type: String },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  content: { type: String },
  ebookUrl: { type: String },  // URL to uploaded ebook file
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
