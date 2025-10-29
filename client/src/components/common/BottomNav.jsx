import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/discover', icon: '🔍', label: 'Discover' },
    { path: '/upload-book', icon: '📤', label: 'Upload' },
    { path: '/library', icon: '📚', label: 'Library' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className='md:hidden fixed bottom-0 left-0 right-0 bg-cream-100 border-t border-brown-600/20 z-50'>
      <div className='flex justify-around items-center py-2'>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
              location.pathname === item.path
                ? 'text-teal-500'
                : 'text-slate-500'
            }`}
          >
            <span className='text-2xl'>{item.icon}</span>
            <span className='text-xs font-medium'>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
