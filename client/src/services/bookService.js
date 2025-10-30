import API from './api';

export const bookService = {
  getAllBooks: (params) => API.get('/books', { params }),  // ✅ Removed /api
  getBookById: (id) => API.get(`/books/${id}`),  // ✅
  searchBooks: (query) => API.get(`/books?search=${query}`),  // ✅
  getFeaturedBooks: () => API.get('/books/featured'),  // ✅
  getBooksByGenre: (genre) => API.get(`/books?genre=${genre}`),  // ✅
  createBook: (bookData) => API.post('/books', bookData),  // ✅
  updateBook: (id, bookData) => API.put(`/books/${id}`, bookData),  // ✅
  deleteBook: (id) => API.delete(`/books/${id}`),  // ✅
};
