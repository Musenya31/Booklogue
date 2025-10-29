import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/formatters';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className='bg-cream-100 border-b border-brown-600/20 sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link to='/' className='text-2xl font-semibold text-teal-500 hover:text-teal-600 transition-colors'>
            📚 BookLogue
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-8'>
            <Link
              to='/'
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-teal-500' : 'text-slate-900 hover:text-teal-500'
              }`}
            >
              Home
            </Link>
            <Link
              to='/discover'
              className={`font-medium transition-colors ${
                isActive('/discover') ? 'text-teal-500' : 'text-slate-900 hover:text-teal-500'
              }`}
            >
              Discover
            </Link>
            <Link
              to='/library'
              className={`font-medium transition-colors ${
                isActive('/library') ? 'text-teal-500' : 'text-slate-900 hover:text-teal-500'
              }`}
            >
              Library
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className='flex items-center gap-4'>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className='text-xl hover:scale-110 transition-transform'
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className='md:hidden text-slate-900'
            >
              {showMobileMenu ? '✕' : '☰'}
            </button>

            {/* User Menu - Desktop */}
            {isAuthenticated ? (
              <div className='hidden md:block relative'>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className='w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold hover:bg-teal-600 transition-colors'
                >
                  {user?.username ? getInitials(user.username) : '?'}
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className='absolute right-0 mt-2 w-48 bg-cream-100 rounded-lg shadow-lg border border-brown-600/20'>
                    <Link
                      to='/profile'
                      onClick={() => setShowUserMenu(false)}
                      className='block px-4 py-3 text-slate-900 hover:bg-cream-50 rounded-t-lg transition-colors'
                    >
                      👤 Profile
                    </Link>
                    <Link
                      to='/library'
                      onClick={() => setShowUserMenu(false)}
                      className='block px-4 py-3 text-slate-900 hover:bg-cream-50 transition-colors'
                    >
                      📚 My Library
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='w-full text-left px-4 py-3 text-red-600 hover:bg-cream-50 rounded-b-lg transition-colors'
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='hidden md:flex gap-3'>
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
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className='md:hidden py-4 border-t border-brown-600/20'>
            <Link
              to='/'
              onClick={() => setShowMobileMenu(false)}
              className='block py-3 text-slate-900 hover:text-teal-500 font-medium transition-colors'
            >
              Home
            </Link>
            <Link
              to='/discover'
              onClick={() => setShowMobileMenu(false)}
              className='block py-3 text-slate-900 hover:text-teal-500 font-medium transition-colors'
            >
              Discover
            </Link>
            <Link
              to='/library'
              onClick={() => setShowMobileMenu(false)}
              className='block py-3 text-slate-900 hover:text-teal-500 font-medium transition-colors'
            >
              Library
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to='/profile'
                  onClick={() => setShowMobileMenu(false)}
                  className='block py-3 text-slate-900 hover:text-teal-500 font-medium transition-colors'
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLogout();
                  }}
                  className='block w-full text-left py-3 text-red-600 font-medium'
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  onClick={() => setShowMobileMenu(false)}
                  className='block py-3 text-slate-900 hover:text-teal-500 font-medium transition-colors'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  onClick={() => setShowMobileMenu(false)}
                  className='block py-3 text-teal-500 font-medium'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
