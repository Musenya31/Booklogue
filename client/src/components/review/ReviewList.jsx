import { Link } from 'react-router-dom';
import { formatDate, formatReadingTime, getInitials, getStarRating } from '../../utils/formatters';

const ReviewList = ({ reviews, loading, error }) => {
  if (loading) {
    return (
      <div className='text-center py-12'>
        <div className='inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin'></div>
        <p className='mt-4 text-slate-500'>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-600 text-lg'>{error}</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className='text-center py-20'>
        <div className='text-6xl mb-4'>📝</div>
        <h3 className='text-xl font-semibold text-slate-900 mb-2'>
          No reviews yet
        </h3>
        <p className='text-slate-500'>
          Be the first to share your thoughts
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {reviews.map((review) => {
        const stars = getStarRating(review.rating);
        
        return (
          <div
            key={review._id}
            className='bg-cream-100 rounded-lg border border-brown-600/12 p-6 hover:shadow-md transition-all'
          >
            {/* Header */}
            <div className='flex justify-between items-start mb-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold'>
                  {getInitials(review.user.username)}
                </div>
                <div>
                  <div className='font-medium text-slate-900'>
                    {review.user.username}
                  </div>
                  <div className='text-sm text-slate-500'>
                    {formatDate(review.createdAt)} • {formatReadingTime(review.readingTime)}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className='flex gap-1'>
                {[...Array(stars.full)].map((_, i) => (
                  <span key={`full-${i}`} className='text-orange-400 text-lg'>★</span>
                ))}
                {stars.half === 1 && <span className='text-orange-400 text-lg'>⯨</span>}
                {[...Array(stars.empty)].map((_, i) => (
                  <span key={`empty-${i}`} className='text-gray-300 text-lg'>★</span>
                ))}
              </div>
            </div>

            {/* Book Info */}
            <Link
              to={`/book/${review.book._id}`}
              className='flex items-center gap-3 mb-4 group'
            >
              <img
                src={review.book.coverImage}
                alt={review.book.title}
                className='w-16 h-24 object-cover rounded'
              />
              <div>
                <h4 className='font-semibold text-slate-900 group-hover:text-teal-500 transition-colors'>
                  {review.book.title}
                </h4>
                <p className='text-sm text-slate-500'>by {review.book.author}</p>
              </div>
            </Link>

            {/* Review Title */}
            <h3 className='text-xl font-semibold text-slate-900 mb-3'>
              {review.title}
            </h3>

            {/* Review Content */}
            <p className='font-serif text-slate-500 text-[15px] leading-relaxed mb-4 line-clamp-4'>
              {review.content}
            </p>

            {/* Spoiler Warning */}
            {review.isSpoiler && (
              <div className='inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold mb-4'>
                ⚠️ Contains Spoilers
              </div>
            )}

            {/* Footer */}
            <div className='flex justify-between items-center pt-4 border-t border-brown-600/20'>
              <Link
                to={`/book/${review.book._id}`}
                className='text-teal-500 hover:text-teal-600 font-medium text-sm transition-colors'
              >
                Read Full Review →
              </Link>
              
              <div className='flex gap-4 text-slate-500 text-sm'>
                <button className='flex items-center gap-1 hover:text-teal-500 transition-colors'>
                  ❤️ {review.totalLikes || 0}
                </button>
                <span className='flex items-center gap-1'>
                  💬 {review.totalComments || 0}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
