import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAuth } from '../hooks/useAuth';
import { useBooks } from '../hooks/useBooks';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const backendOrigin = 'http://localhost:5000';

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
          return;
        }

        bookData.ebookUrl = bookData.ebookUrl.startsWith('http')
          ? bookData.ebookUrl
          : `${backendOrigin}${bookData.ebookUrl}`;

        setBook(bookData);
        setCurrentPage(1);
      } catch {
        setError('Failed to load book data.');
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [id, isAuthenticated, navigate, getBook]);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  const onItemClick = useCallback(
    ({ pageNumber }) => {
      if (pageNumber) setCurrentPage(pageNumber);
    },
    [setCurrentPage]
  );

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

  const zoomIn = () => {
    setScale((s) => Math.min(3, s + 0.2));
  };

  const zoomOut = () => {
    setScale((s) => Math.max(0.5, s - 0.2));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') changePage(-1);
      if (e.key === 'ArrowRight') changePage(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [changePage]);

  if (loading) return <div className="text-center py-20">Loading book...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!book) return <div className="text-center py-20">Book not found</div>;

  return (
    <main className="max-w-screen-md mx-auto p-4 bg-white shadow rounded-lg my-8">
      <button
        onClick={() => navigate(`/book/${id}`)}
        className="mb-6 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
      >
        ← Back to Book Details
      </button>

      <div className="flex items-center justify-between mb-4 space-x-4">
        <div>
          <button onClick={zoomOut} className="btn-secondary mr-2">
            -
          </button>
          <span className="text-lg font-semibold">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} className="btn-secondary ml-2">
            +
          </button>
        </div>

        <div>
          <input
            type="number"
            min={1}
            max={numPages}
            value={currentPage}
            onChange={handlePageChange}
            className="input-field w-16 text-center"
            aria-label="Page number"
          />
          <span className="ml-2">/ {numPages}</span>
        </div>

        <button
          onClick={toggleFullscreen}
          className="btn-primary"
          aria-pressed={fullscreen}
          aria-label="Toggle fullscreen"
        >
          {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <Document
        file={book.ebookUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onItemClick={onItemClick}
        loading={<div className="text-center py-10 text-gray-400">Loading PDF...</div>}
        error={<div className="text-red-600 text-center py-10">Failed to load PDF.</div>}
        noData={<div className="text-gray-600 text-center py-10">No PDF file specified.</div>}
      >
        <Page pageNumber={currentPage} scale={scale} />
      </Document>

      <nav className="flex justify-center items-center mt-6 space-x-4 select-none">
        <button
          disabled={currentPage <= 1}
          onClick={() => changePage(-1)}
          className={`px-4 py-2 rounded border border-teal-500 font-semibold ${
            currentPage <= 1 ? 'text-gray-300 border-gray-300 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-100'
          }`}
          aria-label="Previous page"
        >
          Previous
        </button>

        <span className="text-lg font-semibold">
          Page {currentPage} of {numPages || '?'}
        </span>

        <button
          disabled={currentPage >= numPages}
          onClick={() => changePage(1)}
          className={`px-4 py-2 rounded border border-teal-500 font-semibold ${
            currentPage >= numPages ? 'text-gray-300 border-gray-300 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-100'
          }`}
          aria-label="Next page"
        >
          Next
        </button>
      </nav>
    </main>
  );
};

export default Reader;
