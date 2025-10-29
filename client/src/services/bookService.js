import API from './api';

export const bookService = {
  // Get all books
  getAllBooks: (params) => API.get('/books', { params }),
  
  // Get single book
  getBookById: (id) => API.get(`/books/${id}`),
  
  // Search books
  searchBooks: (query) => API.get(`/books?search=${query}`),
  
  // Get featured books
  getFeaturedBooks: () => API.get('/books/featured'),
  
  // Get books by genre
  getBooksByGenre: (genre) => API.get(`/books?genre=${genre}`),
  
  // Create book
  createBook: (bookData) => API.post('/books', bookData),
  
  // Update book
  updateBook: (id, bookData) => API.put(`/books/${id}`, bookData),
  
  // Delete book
  deleteBook: (id) => API.delete(`/books/${id}`),
};
