const Book = require('../models/Book');
exports.getBooks = async (req, res) => {
  try {
    const { genre, search, sort = '-createdAt', page = 1, limit = 12 } = req.query;

    const query = {};
    if (genre && genre !== '') query.genres = genre;
    if (search && search !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await Book.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    const count = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (error) {
    console.error('Error in getBooks:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new book document
exports.createBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const book = await newBook.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error in createBook:', error);
    res.status(400).json({ message: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const { genre, search, sort = '-createdAt', page = 1, limit = 12 } = req.query;
    const query = {};
    if (genre && genre !== '') query.genres = genre;
    if (search && search !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const books = await Book.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Error in getBooks:', error);
    res.status(500).json({ message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    console.error('Error in createBook:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.json(updatedBook);
  } catch (error) {
    console.error('Error in updateBook:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (error) {
    console.error('Error in deleteBook:', error);
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    console.error('Error in getBookById:', error);
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedBooks = async (req, res) => {
  try {
    const featuredBooks = await Book.find().sort('-createdAt').limit(5);
    res.json(featuredBooks);
  } catch (error) {
    console.error('Error in getFeaturedBooks:', error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getBookById,
  getFeaturedBooks,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
};