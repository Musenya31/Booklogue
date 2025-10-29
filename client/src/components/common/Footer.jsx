import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-cream-100 border-t border-brown-600/20 mt-20'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* About */}
          <div>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>
              📚 BookLogue
            </h3>
            <p className='text-slate-500 text-sm'>
              Your community for discovering, reading, and reviewing books.
              Join thousands of readers sharing their love for literature.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-sm font-semibold text-slate-900 mb-4'>
              Quick Links
            </h4>
            <ul className='space-y-2'>
              <li>
                <Link to='/' className='text-slate-500 hover:text-teal-500 text-sm transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/discover' className='text-slate-500 hover:text-teal-500 text-sm transition-colors'>
                  Discover
                </Link>
              </li>
              <li>
                <Link to='/library' className='text-slate-500 hover:text-teal-500 text-sm transition-colors'>
                  My Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className='text-sm font-semibold text-slate-900 mb-4'>
              Community
            </h4>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='text-slate-500 hover:text-teal-500 text-sm transition-colors'>
                  Guidelines
                </a>
              </li>
              <li>
                <a href='#' className='text-slate-500 hover:text-teal-500 text-sm transition-colors'>
                  Authors
                </a>
              </li>
              <li>
                <a href='#' className='text-slate-500 hover:text-teal-500 text-sm transition-colors'>
                  Book Clubs
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className='text-sm font-semibold text-slate-900 mb-4'>
              Support
            </h4>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='text-slate-500 hover:text-teal-500 text-sm transition-colors'>
                  Help Center
                </a>
              </li>
              <li>
                <a href='#' className='text-slate-500 hover:text-teal-500 text-sm transition-colors'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='#' className='text-slate-500 hover:text-teal-500 text-sm transition-colors'>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-brown-600/20 mt-8 pt-8 text-center'>
          <p className='text-slate-500 text-sm'>
            &copy; 2025 BookLogue. Made with ❤️ for book lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
