import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAuth } from '../hooks/useAuth';
import { useBooks } from '../hooks/useBooks';
import { getUploadUrl } from '../services/api';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const Reader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getBook } = useBooks();

  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scale, setScale] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadBook = async () => {
      try {
        setLoading(true);
        const bookData = await getBook(id);

        if (!bookData?.ebookUrl) {
          setError('No eBook URL found for this book.');
          setLoading(false);
          return;
        }

        // Handle both absolute URLs and relative paths
        const fullUrl = bookData.ebookUrl.startsWith('http')
          ? bookData.ebookUrl
          : getUploadUrl(bookData.ebookUrl);

        console.log('Loading PDF from:', fullUrl);

        setBook({ ...bookData, ebookUrl: fullUrl });
        setCurrentPage(1);
      } catch (err) {
        console.error('Error loading book:', err);
        setError('Failed to load book data.');
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id, isAuthenticated, navigate, getBook]);

  // PDF load success handler
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log(`PDF loaded successfully: ${numPages} pages`);
  };

  // PDF load error handler
  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. The file may be corrupted or unavailable.');
  };

  // Clicking on bookmarks or links inside PDF
  const onItemClick = useCallback(({ pageNumber }) => {
    if (pageNumber) setCurrentPage(pageNumber);
  }, []);

  // Page navigation with boundary checks
  const changePage = useCallback(
    (offset) => {
      setCurrentPage((prev) => {
        let next = prev + offset;
        if (next < 1) next = 1;
        if (numPages && next > numPages) next = numPages;
        return next;
      });
    },
    [numPages]
  );

  const handlePageChange = (e) => {
    let val = Number(e.target.value);
    if (val > numPages) val = numPages;
    if (val < 1) val = 1;
    setCurrentPage(val);
  };

  // Zoom controls
  const zoomIn = () => setScale((s) => Math.min(3, s + 0.2));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.2));
  const resetZoom = () => setScale(1);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcuts for page navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        changePage(-1);
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        changePage(1);
      }
      if (e.key === 'Home') {
        e.preventDefault();
        setCurrentPage(1);
      }
      if (e.key === 'End' && numPages) {
        e.preventDefault();
        setCurrentPage(numPages);
      }
      if (e.key === 'Escape' && fullscreen) {
        document.exitFullscreen();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [changePage, numPages, fullscreen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/book/${id}`)}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Back to Book Details
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">Book not found</p>
          <button
            onClick={() => navigate('/books')}
            className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-screen-lg mx-auto p-4 my-8">
      {/* Header with book info and back button */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={() => navigate(`/book/${id}`)}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Book Details</span>
          </button>

          {book.title && (
            <h1 className="text-xl font-semibold text-gray-800 flex-1 text-center">
              {book.title}
            </h1>
          )}
        </div>
      </div>

      {/* Reader controls */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="text-lg font-semibold min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={scale >= 3}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              onClick={resetZoom}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition ml-2"
              aria-label="Reset zoom"
            >
              Reset
            </button>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Page:</span>
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={currentPage}
              onChange={handlePageChange}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Page number"
            />
            <span className="text-sm text-gray-600">/ {numPages || '?'}</span>
          </div>

          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
            aria-pressed={fullscreen}
            aria-label="Toggle fullscreen"
          >
            {fullscreen ? '🗙 Exit Fullscreen' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {/* PDF viewer */}
      <div className="bg-white shadow rounded-lg p-4 flex justify-center">
        <Document
          file={book.ebookUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          onItemClick={onItemClick}
          loading={
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading PDF...</p>
            </div>
          }
          error={
            <div className="text-red-600 text-center py-20">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="font-semibold">Failed to load PDF</p>
              <p className="text-sm mt-2">The file may be corrupted or unavailable</p>
            </div>
          }
          noData={
            <div className="text-gray-600 text-center py-20">
              <p>No PDF file specified</p>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>

      {/* Navigation controls */}
      <nav className="bg-white shadow rounded-lg p-4 mt-4">
        <div className="flex justify-center items-center gap-4 select-none flex-wrap">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(1)}
            className={`px-4 py-2 rounded-lg border font-semibold transition ${
              currentPage <= 1
                ? 'text-gray-300 border-gray-300 cursor-not-allowed bg-gray-50'
                : 'text-teal-600 border-teal-500 hover:bg-teal-50'
            }`}
            aria-label="First page"
          >
            ⏮ First
          </button>

          <button
            disabled={currentPage <= 1}
            onClick={() => changePage(-1)}
            className={`px-4 py-2 rounded-lg border font-semibold transition ${
              currentPage <= 1
                ? 'text-gray-300 border-gray-300 cursor-not-allowed bg-gray-50'
                : 'text-teal-600 border-teal-500 hover:bg-teal-50'
            }`}
            aria-label="Previous page"
          >
            ← Previous
          </button>

          <span className="text-lg font-semibold text-gray-700 px-4">
            Page {currentPage} of {numPages || '?'}
          </span>

          <button
            disabled={currentPage >= numPages}
            onClick={() => changePage(1)}
            className={`px-4 py-2 rounded-lg border font-semibold transition ${
              currentPage >= numPages
                ? 'text-gray-300 border-gray-300 cursor-not-allowed bg-gray-50'
                : 'text-teal-600 border-teal-500 hover:bg-teal-50'
            }`}
            aria-label="Next page"
          >
            Next →
          </button>

          <button
            disabled={currentPage >= numPages}
            onClick={() => setCurrentPage(numPages)}
            className={`px-4 py-2 rounded-lg border font-semibold transition ${
              currentPage >= numPages
                ? 'text-gray-300 border-gray-300 cursor-not-allowed bg-gray-50'
                : 'text-teal-600 border-teal-500 hover:bg-teal-50'
            }`}
            aria-label="Last page"
          >
            Last ⏭
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>💡 Tip: Use arrow keys or Page Up/Down to navigate</p>
        </div>
      </nav>
    </main>
  );
};

export default Reader;
