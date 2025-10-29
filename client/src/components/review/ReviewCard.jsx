import { Link } from 'react-router-dom';
import { formatDate, getInitials, getStarRating } from '../../utils/formatters';

const ReviewCard = ({ review }) => {
  if (!review || !review.book) return null;

  const stars = getStarRating(review.rating || 0);

  return (
    <Link to={`/book/${review.book._id}`} className="block group max-w-md mx-auto shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
     {/* Book Cover */}
<div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
  <img
    src={review.book.coverImage || '/default_cover.jpg'}
    alt={review.book.title || 'Book Cover'}
    className="w-auto h-full object-contain"
    loading="lazy"
  />
</div>

      {/* Content */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(stars.full)].map((_, i) => (
            <span key={`full-${i}`} className="text-orange-400 text-xl select-none">★</span>
          ))}
          {stars.half === 1 && <span className="text-orange-400 text-xl select-none">⯨</span>}
          {[...Array(stars.empty)].map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-300 text-xl select-none">★</span>
          ))}
        </div>

        {/* Review Title */}
        <h3 className="text-2xl font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
          {review.title || 'No title'}
        </h3>

        {/* Book Title and Author */}
        <p className="text-gray-600 text-sm italic mb-3 truncate">
          {review.book.title || 'Unknown Book'} by {review.book.author || 'Unknown Author'}
        </p>

        {/* Excerpt */}
        <p className="font-serif text-gray-700 text-base leading-relaxed mb-4 line-clamp-3">
          {review.content || ''}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          {/* Reviewer */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold text-sm select-none">
              {review.user && review.user.username ? getInitials(review.user.username) : 'NA'}
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">
                {review.user && review.user.username ? review.user.username : 'Anonymous'}
              </div>
              <div className="text-xs text-gray-500">
                {review.createdAt ? formatDate(review.createdAt) : ''}
              </div>
            </div>
          </div>

          {/* Placeholder for future engagement (likes, comments) */}
          <div className="flex gap-4 text-gray-500 text-sm select-none"></div>
        </div>
      </div>
    </Link>
  );
};

export default ReviewCard;
