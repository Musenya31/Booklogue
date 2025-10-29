
import { useState, useEffect } from 'react';
import { useBooks } from '../hooks/useBooks';
import Header from '../components/common/Header';
import BookCard from '../components/book/BookCard';
import { GENRES } from '../utils/constants';

const Discover = () => {
  const { books, loading, searchBooks, filterByGenre, clearFilters } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      searchBooks(query);
    } else if (query.length === 0) {
      clearFilters();
    }
  };

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);
    if (genre) {
      filterByGenre(genre);
    } else {
      clearFilters();
    }
  };

  return (
    <div className='min-h-screen bg-cream-50'>
      <Header />
      
      <main className='container mx-auto px-4 py-10'>
        <h1 className='text-4xl font-semibold text-slate-900 mb-3'>
          Discover Books
        </h1>
        <p className='text-slate-500 text-lg mb-8'>
          Find your next favorite read
        </p>

        {/* Search Bar */}
        <div className='mb-8'>
          <input
            type='text'
            value={searchQuery}
            onChange={handleSearch}
            placeholder='Search books by title, author...'
            className='w-full max-w-2xl px-4 py-3 bg-cream-100 border border-brown-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
          />
        </div>

        {/* Genre Filters */}
        <div className='flex gap-3 mb-8 overflow-x-auto pb-2'>
          <button
            onClick={() => handleGenreFilter('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedGenre
                ? 'bg-teal-500 text-white'
                : 'bg-cream-100 text-slate-900 hover:bg-cream-50'
            }`}
          >
            All Genres
          </button>
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreFilter(genre)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedGenre === genre
                  ? 'bg-teal-500 text-white'
                  : 'bg-cream-100 text-slate-900 hover:bg-cream-50'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className='text-center py-12'>
            <div className='inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin'></div>
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Discover;
