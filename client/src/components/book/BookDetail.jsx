import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import Header from '../components/common/Header';
import BookCover from '../components/book/BookCover';
import ReviewList from '../components/review/ReviewList';
import { formatRating, getStarRating } from '../utils/formatters';

const backendOrigin = 'http://localhost:5000'; // Your backend URL

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookById(id);
      const bookData = response.data;

      // Prepend backend origin if ebookUrl is relative
      if (bookData.ebookUrl && !bookData.ebookUrl.startsWith('http')) {
        bookData.ebookUrl = `${backendOrigin}${bookData.ebookUrl}`;
      }

      setBook(bookData);
      // Optionally load reviews here and setReviews()
    } catch (error) {
      console.error('Error loading book:', error);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Book not found</h2>
        </div>
      </div>
    );
  }

  const stars = getStarRating(book.averageRating);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-emerald-50">
      <Header />
      <main className="container mx-auto px-6 py-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
          {/* Book Cover Section */}
          <div className="lg:sticky lg:top-24 flex items-center justify-center">
            <div className="rounded-xl bg-white shadow-lg border border-gray-200 p-3 transition-transform hover:scale-105">
              <BookCover book={book} className="w-[240px] h-[360px]" />
            </div>
          </div>

          {/* Book Details Section */}
          <div>
            <h1 className="text-5xl font-extrabold text-slate-900 mb-3 leading-tight">{book.title}</h1>
            <p className="text-xl text-slate-500 font-medium mb-6">by {book.author}</p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6" aria-label="Book rating">
              <div className="flex gap-1">
                {[...Array(stars.full)].map((_, i) => (
                  <span key={`full-${i}`} className="text-orange-400 text-2xl">★</span>
                ))}
                {stars.half === 1 && <span className="text-orange-400 text-2xl">⯨</span>}
                {[...Array(stars.empty)].map((_, i) => (
                  <span key={`empty-${i}`} className="text-gray-300 text-2xl">★</span>
                ))}
              </div>
              <span className="text-slate-900 font-semibold text-lg">{formatRating(book.averageRating)}</span>
              <span className="text-slate-500">({book.totalReviews} reviews)</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {book.genres.map((genre) => (
                <span
                  key={genre}
                  className="bg-cream-100 px-4 py-2 rounded-full text-sm font-medium border border-teal-200 shadow"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-3xl font-semibold text-slate-900 mb-4">About This Book</h2>
              <p className="font-serif text-slate-600 leading-relaxed text-base whitespace-pre-line">
                {book.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={() => navigate(`/read/${book._id}`)}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-transform hover:scale-105"
              >
                📖 Read Now
              </button>
              <button
                onClick={() => navigate(`/write-review/${book._id}`)}
                className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-4 rounded-lg font-semibold shadow transition-transform hover:scale-105"
              >
                ✍️ Write a Review
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-4xl font-semibold text-slate-900 mb-8">Reader Reviews</h2>
          <ReviewList reviews={reviews} loading={false} />
        </div>
      </main>
    </div>
  );
};

export default BookDetail;
