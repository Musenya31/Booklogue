import { Link } from 'react-router-dom';
import { formatDate, formatReadingTime, getStarRating, truncateText } from '../../utils/formatters';

const FeaturedReview = ({ review }) => {
  const stars = getStarRating(review.rating);

  return (
    <div className='bg-cream-100 rounded-lg border border-brown-600/12 overflow-hidden shadow-md mb-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-8'>
        {/* Image */}
        <img
          src={review.book.coverImage}
          alt={review.book.title}
          className='w-full h-[400px] object-cover rounded-lg'
        />

        {/* Content */}
        <div className='flex flex-col justify-center'>
          <span className='inline-block bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase mb-4 w-fit'>
            Featured Review
          </span>

          <h2 className='text-3xl font-semibold text-slate-900 mb-3 leading-tight'>
            {review.title}
          </h2>

          <div className='flex items-center gap-3 text-slate-500 text-sm mb-4'>
            <div className='flex gap-1'>
              {[...Array(stars.full)].map((_, i) => (
                <span key={`full-${i}`} className='text-orange-400'>★</span>
              ))}
              {stars.half === 1 && <span className='text-orange-400'>⯨</span>}
              {[...Array(stars.empty)].map((_, i) => (
                <span key={`empty-${i}`} className='text-gray-300'>★</span>
              ))}
            </div>
            <span>•</span>
            <span>{review.user.username}</span>
            <span>•</span>
            <span>{formatReadingTime(review.readingTime)}</span>
          </div>

          <p className='font-serif text-slate-500 text-base leading-relaxed mb-6'>
            {truncateText(review.content, 250)}
          </p>

          <Link
            to={`/book/${review.book._id}`}
            className='bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-fit'
          >
            Read Full Review
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedReview;
