
import { createContext, useContext, useState, useEffect } from 'react';
import { bookService } from '../services/bookService';

const BookContext = createContext();

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within BookProvider');
  }
  return context;
};

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    genre: '',
    search: '',
    sort: '-createdAt'
  });

  // Fetch books with filters
  const fetchBooks = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        ...filters,
        page,
        limit: 12
      };
      const response = await bookService.getAllBooks(params);
      setBooks(response.data.books);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured books
  const fetchFeaturedBooks = async () => {
    try {
      const response = await bookService.getFeaturedBooks();
      setFeaturedBooks(response.data);
    } catch (err) {
      console.error('Error fetching featured books:', err);
    }
  };

  // Search books
  const searchBooks = async (query) => {
    setFilters(prev => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  // Filter by genre
  const filterByGenre = async (genre) => {
    setFilters(prev => ({ ...prev, genre }));
    setCurrentPage(1);
  };

  // Sort books
  const sortBooks = (sortBy) => {
    setFilters(prev => ({ ...prev, sort: sortBy }));
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      genre: '',
      search: '',
      sort: '-createdAt'
    });
    setCurrentPage(1);
  };

  // Load more (pagination)
  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchBooks(currentPage + 1);
    }
  };

  // Get single book
  const getBook = async (id) => {
    try {
      setLoading(true);
      const response = await bookService.getBookById(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create book
  const createBook = async (bookData) => {
    try {
      setLoading(true);
      const response = await bookService.createBook(bookData);
      setBooks(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update book
  const updateBook = async (id, bookData) => {
    try {
      setLoading(true);
      const response = await bookService.updateBook(id, bookData);
      setBooks(prev => prev.map(book => 
        book._id === id ? response.data : book
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete book
  const deleteBook = async (id) => {
    try {
      setLoading(true);
      await bookService.deleteBook(id);
      setBooks(prev => prev.filter(book => book._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch books when filters change
  useEffect(() => {
    fetchBooks(currentPage);
  }, [filters]);

  // Fetch featured books on mount
  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  const value = {
    books,
    featuredBooks,
    loading,
    error,
    currentPage,
    totalPages,
    filters,
    fetchBooks,
    searchBooks,
    filterByGenre,
    sortBooks,
    clearFilters,
    loadMore,
    getBook,
    createBook,
    updateBook,
    deleteBook,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};
