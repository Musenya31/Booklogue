import { useState } from 'react';

const BookReader = ({ book, currentPage, onPageChange, onClose }) => {
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('serif');
  const [theme, setTheme] = useState('light');
  const [showSettings, setShowSettings] = useState(false);

  const progress = Math.round((currentPage / book.pages) * 100);

  const themeStyles = {
    light: {
      bg: 'bg-cream-50',
      text: 'text-slate-900',
      secondary: 'text-slate-500',
      controlBg: 'bg-cream-100',
      border: 'border-brown-600/20',
    },
    sepia: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      secondary: 'text-amber-700',
      controlBg: 'bg-amber-100',
      border: 'border-amber-600/20',
    },
    dark: {
      bg: 'bg-charcoal-700',
      text: 'text-gray-100',
      secondary: 'text-gray-400',
      controlBg: 'bg-charcoal-800',
      border: 'border-gray-700',
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      {/* Top Control Bar */}
      <div className={`sticky top-0 z-50 ${currentTheme.controlBg} border-b ${currentTheme.border} px-4 py-3`}>
        <div className='max-w-4xl mx-auto flex justify-between items-center'>
          <button
            onClick={onClose}
            className={`${currentTheme.text} hover:text-teal-500 transition-colors`}
          >
            ← Back
          </button>

          <div className='flex items-center gap-4'>
            <span className={`text-sm ${currentTheme.secondary}`}>
              Page {currentPage} of {book.pages}
            </span>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`${currentTheme.text} hover:text-teal-500 transition-colors`}
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='max-w-4xl mx-auto mt-2'>
          <div className={`w-full h-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-brown-600/10'} rounded-full overflow-hidden`}>
            <div
              className='h-full bg-teal-500 transition-all duration-300'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`sticky top-[73px] z-40 ${currentTheme.controlBg} border-b ${currentTheme.border} px-4 py-4`}>
          <div className='max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Font Size */}
            <div>
              <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                Font Size
              </label>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className={`${currentTheme.controlBg} ${currentTheme.text} px-3 py-2 rounded-lg hover:bg-teal-500 hover:text-white transition-colors`}
                >
                  A-
                </button>
                <span className={`${currentTheme.secondary} text-sm`}>{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className={`${currentTheme.controlBg} ${currentTheme.text} px-3 py-2 rounded-lg hover:bg-teal-500 hover:text-white transition-colors`}
                >
                  A+
                </button>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                Font Style
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className={`w-full px-4 py-2 ${currentTheme.controlBg} ${currentTheme.text} border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
              >
                <option value='serif'>Serif</option>
                <option value='sans-serif'>Sans-Serif</option>
                <option value='monospace'>Monospace</option>
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                Theme
              </label>
              <div className='flex gap-2'>
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    theme === 'light' ? 'bg-teal-500 text-white' : `${currentTheme.controlBg} ${currentTheme.text}`
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme('sepia')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    theme === 'sepia' ? 'bg-teal-500 text-white' : `${currentTheme.controlBg} ${currentTheme.text}`
                  }`}
                >
                  Sepia
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'bg-teal-500 text-white' : `${currentTheme.controlBg} ${currentTheme.text}`
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reading Content */}
      <div className='max-w-4xl mx-auto px-4 py-12'>
        <div
          className={currentTheme.text}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily:
              fontFamily === 'serif'
                ? 'Georgia, serif'
                : fontFamily === 'sans-serif'
                ? '-apple-system, sans-serif'
                : 'monospace',
            lineHeight: '1.8',
          }}
        >
          <h1 className='text-3xl font-semibold mb-2'>{book.title}</h1>
          <p className={`${currentTheme.secondary} mb-8`}>by {book.author}</p>

          {/* Book Content */}
          <div className='space-y-6'>
            <p>{book.content || 'Book content would be displayed here...'}</p>
          </div>
        </div>

        {/* Page Navigation */}
        <div className={`flex justify-between items-center py-8 border-t ${currentTheme.border} mt-12`}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-teal-500 hover:bg-teal-600 text-white'
            }`}
          >
            ← Previous
          </button>

          <div className='flex items-center gap-3'>
            <input
              type='number'
              value={currentPage}
              onChange={(e) => onPageChange(parseInt(e.target.value) || 1)}
              min='1'
              max={book.pages}
              className={`w-20 px-3 py-2 text-center ${currentTheme.controlBg} ${currentTheme.text} border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
            <span className={currentTheme.secondary}>/ {book.pages}</span>
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === book.pages}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentPage === book.pages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-teal-500 hover:bg-teal-600 text-white'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
