import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBooks } from '../hooks/useBooks';
import { reviewService } from '../services/reviewService';
import Header from '../components/common/Header';
import { parseErrorMessage } from '../utils/formatters';

const WriteReview = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getBook } = useBooks();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
    isSpoiler: false,
  });
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadBook();
  }, [bookId, isAuthenticated]);

  const loadBook = async () => {
    try {
      const bookData = await getBook(bookId);
      setBook(bookData);
    } catch (error) {
      console.error('Error loading book:', error);
      setError('Failed to load book details');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    if (name === 'content') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.content.length < 50) {
      setError('Review must be at least 50 characters long');
      return;
    }

    setLoading(true);

    try {
      await reviewService.createReview({
        book: bookId,
        ...formData,
      });
      navigate(`/book/${bookId}`);
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!book) {
    return (
      <div className='min-h-screen bg-cream-50'>
        <Header />
        <div className='container mx-auto px-4 py-20 text-center'>
          <div className='inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-cream-50'>
      <Header />
      
      <main className='container mx-auto px-4 py-10'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-semibold text-slate-900 mb-3'>
            Write a Review
          </h1>
          <p className='text-slate-500 text-lg mb-8'>
            Share your thoughts about this book with the community
          </p>

          {/* Book Info */}
          <div className='bg-cream-100 rounded-lg border border-brown-600/12 p-6 mb-8 flex gap-4'>
            <img
              src={book.coverImage}
              alt={book.title}
              className='w-20 h-28 object-cover rounded-lg'
            />
            <div>
              <h2 className='text-xl font-semibold text-slate-900 mb-1'>
                {book.title}
              </h2>
              <p className='text-slate-500'>by {book.author}</p>
            </div>
          </div>

          {/* Review Form */}
          <div className='bg-cream-100 rounded-lg border border-brown-600/12 p-8'>
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Rating */}
              <div className='mb-6'>
                <label className='block text-sm font-medium text-slate-900 mb-3'>
                  Your Rating
                </label>
                <div className='flex gap-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className='text-4xl transition-colors'
                    >
                      <span className={star <= formData.rating ? 'text-orange-400' : 'text-gray-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className='ml-3 text-slate-900 font-medium self-center'>
                    {formData.rating}/5
                  </span>
                </div>
              </div>

              {/* Review Title */}
              <div className='mb-6'>
                <label className='block text-sm font-medium text-slate-900 mb-2'>
                  Review Title
                </label>
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength='200'
                  className='w-full px-4 py-3 bg-cream-50 border border-brown-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg'
                  placeholder='Give your review a compelling title'
                />
              </div>

              {/* Review Content */}
              <div className='mb-6'>
                <label className='block text-sm font-medium text-slate-900 mb-2'>
                  Your Review
                </label>
                <textarea
                  name='content'
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows='12'
                  className='w-full px-4 py-3 bg-cream-50 border border-brown-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-serif text-[15px] leading-relaxed'
                  placeholder='Share your detailed thoughts about the book. What did you like? What could have been better? Would you recommend it?'
                />
                <div className='flex justify-between mt-2 text-sm'>
                  <span className={`${charCount < 50 ? 'text-red-500' : 'text-slate-500'}`}>
                    {charCount} characters (minimum 50)
                  </span>
                  <span className='text-slate-500'>
                    {Math.ceil(formData.content.split(/\s+/).length / 200)} min read
                  </span>
                </div>
              </div>

              {/* Spoiler Warning */}
              <div className='mb-8'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    name='isSpoiler'
                    checked={formData.isSpoiler}
                    onChange={handleChange}
                    className='w-5 h-5 text-teal-500 border-brown-600/20 rounded focus:ring-teal-500'
                  />
                  <span className='text-sm font-medium text-slate-900'>
                    This review contains spoilers
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 flex-wrap'>
                <button
                  type='submit'
                  disabled={loading || charCount < 50}
                  className='bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Publishing...' : 'Publish Review'}
                </button>
                <button
                  type='button'
                  onClick={() => navigate(`/book/${bookId}`)}
                  className='bg-transparent border border-brown-600/20 text-slate-900 hover:bg-cream-50 px-8 py-3 rounded-lg font-medium transition-colors'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Writing Tips */}
          <div className='mt-8 bg-cream-100 rounded-lg border border-brown-600/12 p-6'>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>
              Writing Tips
            </h3>
            <ul className='space-y-2 text-slate-500'>
              <li className='flex gap-3'>
                <span className='text-teal-500'>•</span>
                <span>Be specific about what you liked or didn't like</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-teal-500'>•</span>
                <span>Support your opinions with examples from the book</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-teal-500'>•</span>
                <span>Consider the writing style, characters, plot, and pacing</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-teal-500'>•</span>
                <span>Be respectful of different opinions and perspectives</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-teal-500'>•</span>
                <span>Mark spoilers to respect other readers' experiences</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WriteReview;
