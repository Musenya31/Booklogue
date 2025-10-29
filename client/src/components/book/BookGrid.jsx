import BookCard from './BookCard';
import Loader from '../ui/Loader';

const BookGrid = ({ books, loading, error, emptyMessage = 'No books found' }) => {
  if (loading) {
    return <Loader text='Loading books...' />;
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='text-6xl mb-4'>⚠️</div>
        <p className='text-red-600 text-lg'>{error}</p>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className='text-center py-20'>
        <div className='text-6xl mb-4'>📚</div>
        <h3 className='text-xl font-semibold text-slate-900 mb-2'>
          {emptyMessage}
        </h3>
        <p className='text-slate-500'>
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;
