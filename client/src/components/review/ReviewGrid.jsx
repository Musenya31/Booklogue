import ReviewCard from './ReviewCard';
import Loader from '../ui/Loader';

const ReviewGrid = ({ reviews, loading, error, emptyMessage = 'No reviews found' }) => {
  if (loading) {
    return <Loader text='Loading reviews...' />;
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='text-6xl mb-4'>⚠️</div>
        <p className='text-red-600 text-lg'>{error}</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className='text-center py-20'>
        <div className='text-6xl mb-4'>📝</div>
        <h3 className='text-xl font-semibold text-slate-900 mb-2'>
          {emptyMessage}
        </h3>
        <p className='text-slate-500'>
          Be the first to share your thoughts on this book
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewGrid;
