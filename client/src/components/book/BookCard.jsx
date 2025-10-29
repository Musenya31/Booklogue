import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { bookService } from '../../services/bookService'; // Correct import

const BookCard = ({ book, onLibraryUpdate }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  if (!book) return null;

  const handleEdit = () => {
    navigate(`/edit-book/${book._id}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete "${book.title}"?`)) {
      setDeleting(true);
      try {
        await bookService.deleteBook(book._id);
        onLibraryUpdate();
      } catch {
        alert('Failed to delete book.');
      }
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        width: '160px',
        padding: '1rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.07)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        userSelect: 'none',
      }}
    >
      <Link
        to={`/book/${book._id}`}
        style={{
          display: 'block',
          width: '140px',
          height: '210px',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
          background: '#f3f4f6',
          cursor: 'pointer',
          transition: 'transform 0.2s, boxShadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        aria-label={`View details for ${book.title}`}
      >
        <img
          src={book.coverImage}
          alt={book.title}
          width={140}
          height={210}
          style={{
            width: '140px',
            height: '210px',
            objectFit: 'cover',
            borderRadius: '10px',
            display: 'block',
            userSelect: 'none',
          }}
          draggable={false}
        />
      </Link>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', width: '100%' }}>
        <button
          onClick={handleEdit}
          style={{
            flex: 1,
            backgroundColor: '#fde68a',
            color: '#b45309',
            border: '1px solid #fbbf24',
            borderRadius: '6px',
            padding: '0.4rem 0',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fcd34d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fde68a';
          }}
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            flex: 1,
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '6px',
            padding: '0.4rem 0',
            fontSize: '0.9rem',
            cursor: deleting ? 'not-allowed' : 'pointer',
            opacity: deleting ? 0.5 : 1,
            transition: 'background-color 0.2s',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            if (!deleting) e.currentTarget.style.backgroundColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            if (!deleting) e.currentTarget.style.backgroundColor = '#ef4444';
          }}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
