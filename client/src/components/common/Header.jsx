import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/formatters';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className='sticky top-0 z-50 bg-cream-100 border-b border-brown-600/20'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center py-4'>
          {/* Logo */}
          <Link to='/' className='text-2xl font-semibold text-teal-500 hover:text-teal-600 transition-colors'>
            📚 BookLogue
          </Link>

          {/* Search Bar - Desktop */}
          <div className='hidden md:flex items-center bg-cream-50 border border-brown-600/20 rounded-lg px-4 py-2 w-full max-w-md mx-8'>
            <span className='text-slate-500 mr-2'>🔍</span>
            <input
              type='text'
              placeholder='Search books, reviews, authors...'
              className='bg-transparent border-none outline-none w-full text-slate-900 placeholder-slate-400'
            />
          </div>

          {/* Navigation */}
          <nav className='flex items-center gap-6'>
            <Link
              to='/'
              className='hidden md:block text-slate-900 hover:text-teal-500 font-medium transition-colors'
            >
              Home
            </Link>
            <Link
              to='/library'
              className='hidden md:block text-slate-900 hover:text-teal-500 font-medium transition-colors'
            >
              Library
            </Link>
            <Link
              to='/discover'
              className='hidden md:block text-slate-900 hover:text-teal-500 font-medium transition-colors'
            >
              Discover
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className='text-xl hover:scale-110 transition-transform'
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

<Link
  to='/upload-book'
  className='hidden md:flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'
>
  <span>📤</span>
  <span>Upload</span>
</Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className='relative group'>
                <button className='w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold hover:bg-teal-600 transition-colors'>
                  {user?.username ? getInitials(user.username) : '?'}
                </button>
                
                {/* Dropdown */}
                <div className='absolute right-0 mt-2 w-48 bg-cream-100 rounded-lg shadow-lg border border-brown-600/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all'>
                  <Link
                    to='/profile'
                    className='block px-4 py-3 text-slate-900 hover:bg-cream-50 rounded-t-lg transition-colors'
                  >
                    Profile
                  </Link>
                  <Link
                    to='/library'
                    className='block px-4 py-3 text-slate-900 hover:bg-cream-50 transition-colors'
                  >
                    My Library
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-3 text-red-600 hover:bg-cream-50 rounded-b-lg transition-colors'
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex gap-3'>
                <Link
                  to='/login'
                  className='px-4 py-2 text-slate-900 hover:text-teal-500 font-medium transition-colors'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors'
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
