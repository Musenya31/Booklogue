import { useState, useEffect } from 'react';
import { generateBookCover } from '../../utils/generateCover';

const BookCover = ({ book, className = '' }) => {
  const [coverUrl, setCoverUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCover = () => {
      if (!book) {
        setCoverUrl(generateBookCover('No Title', ''));
        setLoading(false);
        return;
      }
      if (book.coverImage) {
        setCoverUrl(book.coverImage);
        setLoading(false);
      } else {
        setCoverUrl(generateBookCover(book.title, book.author));
        setLoading(false);
      }
    };
    loadCover();
  }, [book]);

  const handleImageError = () => {
    if (book) {
      setCoverUrl(generateBookCover(book.title, book.author));
    }
  };

  if (loading || !coverUrl) {
    return (
      <div className="book-cover-wrapper flex items-center justify-center bg-gray-50 rounded-lg shadow-lg">
        <span className="text-5xl text-slate-400 select-none">📘</span>
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt={book?.title || 'Book cover'}
      onError={handleImageError}
      className={`w-full h-full object-cover block rounded-lg shadow-lg ${className}`}
      draggable={false}
    />
  );
};

export default BookCover;
