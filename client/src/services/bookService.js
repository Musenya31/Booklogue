import API from './api';

export const bookService = {
  getAllBooks: (params) => API.get('/api/books', { params }),
  getBookById: (id) => API.get(`/api/books/${id}`),
  searchBooks: (query) => API.get(`/api/books?search=${query}`),
  getFeaturedBooks: () => API.get('/api/books/featured'),
  getBooksByGenre: (genre) => API.get(`/api/books?genre=${genre}`),
  createBook: (bookData) => API.post('/api/books', bookData),
  updateBook: (id, bookData) => API.put(`/api/books/${id}`, bookData),
  deleteBook: (id) => API.delete(`/api/books/${id}`),
};