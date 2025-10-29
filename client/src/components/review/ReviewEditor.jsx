import { useState } from 'react';
import { calculateReadingTime } from '../../utils/formatters';

const ReviewEditor = ({ bookId, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    rating: initialData?.rating || 5,
    isSpoiler: initialData?.isSpoiler || false,
  });
  const [charCount, setCharCount] = useState(initialData?.content?.length || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (name === 'content') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        book: bookId,
      });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const readingTime = calculateReadingTime(formData.content);

  return (
    <div className='bg-cream-100 rounded-lg border border-brown-600/12 p-8'>
      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className='mb-6'>
          <label className='block text-sm font-medium text-slate-900 mb-3'>
            Your Rating <span className='text-red-500'>*</span>
          </label>
          <div className='flex gap-2'>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type='button'
                onClick={() => setFormData({ ...formData, rating: star })}
                className='text-4xl transition-colors hover:scale-110'
              >
                <span className={star <= formData.rating ? 'text-orange-400' : 'text-gray-300'}>
                  ★
                </span>
              </button>
            ))}
            <span className='ml-3 text-slate-900 font-medium self-center'>
              {formData.rating}/5
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div className='mb-6'>
          <label className='block text-sm font-medium text-slate-900 mb-2'>
            Review Title <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            required
            maxLength='200'
            placeholder='Give your review a compelling title'
            className='w-full px-4 py-3 bg-cream-50 border border-brown-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg'
          />
          <p className='text-xs text-slate-500 mt-1'>
            {formData.title.length}/200 characters
          </p>
        </div>

        {/* Review Content */}
        <div className='mb-6'>
          <label className='block text-sm font-medium text-slate-900 mb-2'>
            Your Review <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='content'
            value={formData.content}
            onChange={handleChange}
            required
            rows='12'
            placeholder='Share your detailed thoughts about the book. What did you like? What could have been better? Would you recommend it?'
            className='w-full px-4 py-3 bg-cream-50 border border-brown-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-serif text-[15px] leading-relaxed'
          />
          <div className='flex justify-between mt-2 text-sm'>
            <span className={`${charCount < 50 ? 'text-red-500' : 'text-slate-500'}`}>
              {charCount} characters (minimum 50)
            </span>
            <span className='text-slate-500'>
              {readingTime} min read
            </span>
          </div>
        </div>

        {/* Spoiler Warning */}
        <div className='mb-8'>
          <label className='flex items-center gap-3 cursor-pointer'>
            <input
              type='checkbox'
              name='isSpoiler'
              checked={formData.isSpoiler}
              onChange={handleChange}
              className='w-5 h-5 text-teal-500 border-brown-600/20 rounded focus:ring-teal-500'
            />
            <span className='text-sm font-medium text-slate-900'>
              ⚠️ This review contains spoilers
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 flex-wrap'>
          <button
            type='submit'
            disabled={isSubmitting || charCount < 50}
            className='bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Publishing...' : 'Publish Review'}
          </button>
          {onCancel && (
            <button
              type='button'
              onClick={onCancel}
              className='bg-transparent border border-brown-600/20 text-slate-900 hover:bg-cream-50 px-8 py-3 rounded-lg font-medium transition-colors'
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewEditor;
