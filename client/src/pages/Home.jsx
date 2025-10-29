
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { useReviews } from '../hooks/useReviews';
import { reviewService } from '../services/reviewService';
import Header from '../components/common/Header';
import FeaturedReview from '../components/review/FeaturedReview';
import ReviewCard from '../components/review/ReviewCard';
import { GENRES } from '../utils/constants';

const Home = () => {
  const { books, featuredBooks, loading: booksLoading } = useBooks();
  const { reviews, fetchReviews, loading: reviewsLoading } = useReviews();
  const [featuredReview, setFeaturedReview] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchReviews({ status: 'published', sort: '-createdAt', limit: 12 });
    loadFeaturedReview();
  }, []);

  const loadFeaturedReview = async () => {
    try {
      const response = await reviewService.getFeaturedReview();
      setFeaturedReview(response.data);
    } catch (error) {
      console.error('Error loading featured review:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'all') {
      fetchReviews({ status: 'published', sort: '-createdAt' });
    } else if (tab === 'following') {
      // Implement following filter
      fetchReviews({ status: 'published', sort: '-createdAt' });
    } else {
      // Genre filter
      fetchReviews({ status: 'published', sort: '-createdAt' });
    }
  };

  return (
    <div className='min-h-screen bg-cream-50'>
      <Header />
      
      <main className='container mx-auto px-4 py-10'>
        <h1 className='text-4xl font-semibold text-slate-900 mb-3'>
          Discover Your Next Great Read
        </h1>
        <p className='text-slate-500 text-lg mb-8'>
          Explore reviews from our community of passionate readers
        </p>

        {/* Filter Tabs */}
        <div className='flex gap-4 mb-8 border-b border-brown-600/20 overflow-x-auto'>
          <button
            onClick={() => handleTabChange('all')}
            className={`px-5 py-3 text-[15px] font-medium transition-all border-b-2 ${
              activeTab === 'all'
                ? 'text-teal-500 border-teal-500'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => handleTabChange('following')}
            className={`px-5 py-3 text-[15px] font-medium transition-all border-b-2 ${
              activeTab === 'following'
                ? 'text-teal-500 border-teal-500'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            Following
          </button>
          {GENRES.slice(0, 4).map((genre) => (
            <button
              key={genre}
              onClick={() => handleTabChange(genre.toLowerCase())}
              className={`px-5 py-3 text-[15px] font-medium transition-all border-b-2 whitespace-nowrap ${
                activeTab === genre.toLowerCase()
                  ? 'text-teal-500 border-teal-500'
                  : 'text-slate-500 border-transparent hover:text-slate-900'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Featured Review */}
        {featuredReview && <FeaturedReview review={featuredReview} />}

        {/* Review Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {reviewsLoading ? (
            <div className='col-span-full text-center py-12'>
              <div className='inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin'></div>
              <p className='mt-4 text-slate-500'>Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          ) : (
            <div className='col-span-full text-center py-12'>
              <p className='text-slate-500 text-lg'>No reviews found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
