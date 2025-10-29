import { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({ onSearch, placeholder = 'Search books, reviews, authors...' }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  // Trigger search when debounced value changes
  useState(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <div className='flex items-center bg-cream-50 border border-brown-600/20 rounded-lg px-4 py-2 w-full'>
      <span className='text-slate-500 mr-2'>🔍</span>
      <input
        type='text'
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className='bg-transparent border-none outline-none w-full text-slate-900 placeholder-slate-400'
      />
    </div>
  );
};

export default SearchBar;
