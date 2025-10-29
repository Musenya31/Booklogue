import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import BookCard from '../components/book/BookCard';
import Header from '../components/common/Header';

const Library = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLibrary = async () => {
    setLoading(true);
    try {
      const res = await userService.getLibrary();
      setLibrary(res.data.filter(item => item.book));
    } catch (error) {
      console.error('Failed to load library:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    else loadLibrary();
  }, [isAuthenticated, navigate]);

  return (
    <div className="library-container">
      <Header />

      <main className="container mx-auto max-w-7xl px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-sm select-none">
            My Library
          </h1>

          <Link
            to="/upload-book"
            className="bg-teal-600 hover:bg-teal-700 text-white px-7 py-3 rounded-lg shadow-lg transition focus:outline-none focus:ring-4 focus:ring-teal-400 active:scale-95 select-none"
            aria-label="Upload a new book"
          >
            + Upload Book
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-28 text-teal-600 animate-pulse select-none">
            <div className="w-14 h-14 border-4 border-teal-600 border-t-transparent rounded-full"></div>
            <p className="mt-6 text-2xl font-semibold">Loading your library...</p>
          </div>
        ) : library.length === 0 ? (
          <div className="text-center py-32 text-slate-700 select-none">
            <span className="text-8xl block mb-6 animate-bounce" aria-hidden="true">
              📚
            </span>
            <h2 className="text-4xl font-semibold mb-4">Your Library Is Empty</h2>
            <p className="mb-10 max-w-lg leading-relaxed mx-auto">
              Start adding books to build your reading collection and keep track of your progress.
            </p>
            <Link
              to="/upload-book"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-10 py-3 text-lg shadow-md transition focus:outline-none focus:ring-4 focus:ring-teal-400 active:scale-95"
            >
              Upload Your First Book
            </Link>
          </div>
        ) : (
         // In your Library.jsx or relevant page/component

<section
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '2rem 1.5rem',
    justifyItems: 'center',
    alignItems: 'start',
    padding: '2rem 0',
    background: 'linear-gradient(to bottom, #fefcf7, #ecfdf5)'
  }}
>
  {library.map(({ _id, book }) => (
    <BookCard key={_id} book={book} />
  ))}
</section>

        )}
      </main>
    </div>
  );
};

export default Library;
