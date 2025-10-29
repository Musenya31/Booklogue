import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'
      onClick={onClose}
    >
      <div
        className={`bg-cream-100 rounded-lg shadow-lg ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex justify-between items-center p-6 border-b border-brown-600/20'>
          <h2 className='text-2xl font-semibold text-slate-900'>{title}</h2>
          <button
            onClick={onClose}
            className='text-slate-500 hover:text-slate-900 text-3xl leading-none'
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
