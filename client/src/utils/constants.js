
export const GENRES = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Historical Fiction',
  'Biography',
  'Self-Help',
  'Business',
  'Science',
  'Philosophy',
  'Poetry',
];

export const READING_STATUSES = {
  WANT_TO_READ: 'want-to-read',
  CURRENTLY_READING: 'currently-reading',
  FINISHED: 'finished',
};

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
