import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { bookService } from '../services/bookService';
import API from '../services/api';
import { userService } from '../services/userService';
import Header from '../components/common/Header';
import { GENRES } from '../utils/constants';
import { generateBookCover } from '../utils/generateCover';
import { extractPDFMetadata, extractBasicPDFInfo } from '../utils/pdfMetadataExtractor';

const UploadBook = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ebookFile, setEbookFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genres: [],
    pages: 0,
    publishedYear: '',
    language: 'English',
    coverImage: '',
  });




  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Generate cover when title/author changes manually
  useEffect(() => {
    if (formData.title && !coverPreview && !extracting) {
      const generatedCover = generateBookCover(formData.title, formData.author);
      setCoverPreview(generatedCover);
      setFormData(prev => ({ ...prev, coverImage: generatedCover }));
    }
  }, [formData.title, formData.author, coverPreview, extracting]);

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreChange = (genre) => {
    if (formData.genres.includes(genre)) {
      setFormData({
        ...formData,
        genres: formData.genres.filter(g => g !== genre)
      });
    } else {
      setFormData({
        ...formData,
        genres: [...formData.genres, genre]
      });
    }
  };

  const handleEbookUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 50 * 1024 * 1024) {
      setError('eBook file size must be less than 50MB');
      return;
    }

    setEbookFile(file);
    setError('');

    // Extract metadata from PDF
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setExtracting(true);
      
      try {
        const metadata = await extractPDFMetadata(file);
        
        if (metadata) {
          // Auto-fill form with extracted data
          setFormData(prev => ({
            ...prev,
            title: metadata.title,
            author: metadata.author,
            pages: metadata.pages,
            publishedYear: metadata.publishedYear,
            coverImage: metadata.coverImage
          }));
          
          setCoverPreview(metadata.coverImage);
          
          setSuccess(`✓ Extracted: "${metadata.title}" by ${metadata.author} (${metadata.pages} pages)`);
          setTimeout(() => setSuccess(''), 5000);
        } else {
          // Fallback to basic info
          const basicInfo = extractBasicPDFInfo(file);
          setFormData(prev => ({
            ...prev,
            title: basicInfo.title
          }));
          
          setError('Could not extract full metadata. Please fill in the details manually.');
          setTimeout(() => setError(''), 5000);
        }
      } catch (error) {
        console.error('Extraction error:', error);
        const basicInfo = extractBasicPDFInfo(file);
        setFormData(prev => ({
          ...prev,
          title: basicInfo.title
        }));
        setError('Could not extract metadata. Please fill in manually.');
        setTimeout(() => setError(''), 5000);
      } finally {
        setExtracting(false);
      }
    } else {
      // For non-PDF files, just set basic info from filename
      const basicInfo = extractBasicPDFInfo(file);
      setFormData(prev => ({
        ...prev,
        title: basicInfo.title
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.genres.length === 0) {
      setError('Please select at least one genre');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.description.length < 50) {
      setError('Description must be at least 50 characters');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!ebookFile) {
      setError('Please upload an eBook file');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Ensure cover exists
    if (!formData.coverImage) {
      const generatedCover = generateBookCover(formData.title, formData.author);
      setFormData(prev => ({ ...prev, coverImage: generatedCover }));
    }

    setLoading(true);

    try {
      const bookData = {
        ...formData,
        coverImage: formData.coverImage || generateBookCover(formData.title, formData.author)
      };

      // Upload ebook file and attach URL to book data
      try {
        const fileForm = new FormData();
        fileForm.append('file', ebookFile);
       const uploadRes = await API.post('/upload', fileForm, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
 const ebookUrl = uploadRes.data.url;
        if (ebookUrl) bookData.ebookUrl = ebookUrl;
      } catch (uploadErr) {
        console.error('File upload error:', uploadErr);
        setError('Failed to upload eBook file. Please try again.');
        setLoading(false);
        return;
      }

      const response = await bookService.createBook(bookData);
      const createdBook = response.data;

      // Add to library
      try {
        await userService.updateReadingProgress(createdBook._id, {
          status: 'want-to-read',
          currentPage: 0
        });
      } catch (libraryError) {
        console.error('Library error:', libraryError);
      }

      setSuccess('Book uploaded successfully! Redirecting...');
      setTimeout(() => navigate('/library'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload book');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-cream-50'>
      <Header />
      
      <main className='container mx-auto px-4 py-10'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-semibold text-slate-900 mb-3'>
            Upload an eBook
          </h1>
          <p className='text-slate-500 text-lg mb-8'>
            Upload a PDF and we'll automatically extract the details
          </p>

          {success && (
            <div className='bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6'>
              {success}
            </div>
          )}

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8'>
              
              {/* Cover Preview */}
              <div className='bg-cream-100 rounded-lg border border-brown-600/12 p-6'>
                <h3 className='text-lg font-semibold text-slate-900 mb-4'>
                  Book Cover
                </h3>
{extracting ? (
  <div className='w-full aspect-[2/3] bg-cream-50 rounded-lg flex items-center justify-center'>
    <div className='text-center'>
      <div className='w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3'></div>
      <p className='text-sm text-slate-500'>
        Extracting from PDF...
      </p>
    </div>
  </div>
) : (
  <div className="w-full aspect-[2/3] bg-cream-50 rounded-lg overflow-hidden flex items-center justify-center">
    {coverPreview ? (
      <img
        src={coverPreview}
        alt="Book cover"
        className="w-full h-full object-cover block"
        style={{ aspectRatio: '2 / 3' }}
        draggable={false}
      />
    ) : (
      <span className='text-6xl text-slate-400'>📚</span>
    )}
  </div>
)}
                <p className='text-xs text-slate-500 mt-3 text-center'>
                  {extracting ? 'Processing...' : ebookFile ? 'Extracted from PDF' : 'Upload a PDF to extract cover'}
                </p>
              </div>

              {/* Form */}
              <div className='bg-cream-100 rounded-lg border border-brown-600/12 p-8'>
                
                {/* PDF Upload */}
                <div className='mb-6 p-6 bg-teal-50 border-2 border-teal-200 border-dashed rounded-lg'>
                  <div className='text-center'>
                    <div className='text-5xl mb-3'>📄</div>
                    <h3 className='text-base font-semibold text-slate-900 mb-2'>
                      Upload PDF eBook
                    </h3>
                    <p className='text-sm text-slate-500 mb-4'>
                      We'll extract title, author, pages & cover automatically
                    </p>
                    
                    <input
                      type='file'
                      accept='.pdf,application/pdf'
                      onChange={handleEbookUpload}
                      className='hidden'
                      id='ebookInput'
                      disabled={extracting}
                    />
                    <label
                      htmlFor='ebookInput'
                      className={`inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-lg font-medium cursor-pointer transition-colors ${extracting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {extracting ? 'Processing...' : 'Choose PDF File'}
                    </label>
                    
                    {ebookFile && (
                      <div className='mt-4 p-3 bg-white rounded-lg'>
                        <p className='text-sm text-slate-900 font-medium'>
                          ✓ {ebookFile.name}
                        </p>
                        <p className='text-xs text-slate-500'>
                          {(ebookFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Auto-filled indicator */}
                {formData.title && formData.author && (
                  <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
                    <p className='text-sm text-green-700'>
                      ✓ Auto-filled from PDF: <strong>{formData.title}</strong> by {formData.author} ({formData.pages} pages)
                    </p>
                  </div>
                )}

                {/* Title & Author */}
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block text-sm font-medium text-slate-900 mb-2'>
                      Title * {formData.title && '✓'}
                    </label>
                    <input
                      type='text'
                      name='title'
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-2.5 bg-cream-50 border border-brown-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      placeholder='Book title'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-slate-900 mb-2'>
                      Author * {formData.author && '✓'}
                    </label>
                    <input
                      type='text'
                      name='author'
                      value={formData.author}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-2.5 bg-cream-50 border border-brown-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      placeholder='Author name'
                    />
                  </div>
                </div>

                {/* Pages (auto-filled, read-only) */}
                {formData.pages > 0 && (
                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-slate-900 mb-2'>
                      Pages ✓
                    </label>
                    <input
                      type='number'
                      value={formData.pages}
                      readOnly
                      className='w-full px-4 py-2.5 bg-gray-100 border border-brown-600/20 rounded-lg text-slate-500'
                    />
                  </div>
                )}

                {/* Description */}
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-slate-900 mb-2'>
                    Description *
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows='5'
                    className='w-full px-4 py-2.5 bg-cream-50 border border-brown-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Write a description (minimum 50 characters)'
                  />
                  <p className={`text-xs mt-1 ${formData.description.length < 50 ? 'text-red-500' : 'text-teal-500'}`}>
                    {formData.description.length}/50 minimum
                  </p>
                </div>

                {/* Genres */}
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-slate-900 mb-2'>
                    Genres *
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {GENRES.map(genre => (
                      <button
                        key={genre}
                        type='button'
                        onClick={() => handleGenreChange(genre)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          formData.genres.includes(genre)
                            ? 'bg-teal-500 text-white'
                            : 'bg-cream-50 border border-brown-600/20'
                        }`}
                      >
                        {formData.genres.includes(genre) && '✓ '}
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className='mb-6'>
                  <label className='block text-sm font-medium text-slate-900 mb-2'>
                    Language
                  </label>
                  <select
                    name='language'
                    value={formData.language}
                    onChange={handleChange}
                    className='w-full px-4 py-2.5 bg-cream-50 border border-brown-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  >
                    <option value='English'>English</option>
                    <option value='Spanish'>Spanish</option>
                    <option value='French'>French</option>
                    <option value='Other'>Other</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className='flex gap-3'>
                  <button
                    type='submit'
                    disabled={loading || extracting}
                    className='bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2'
                  >
                    {loading ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <span>📤</span>
                        <span>Upload Book</span>
                      </>
                    )}
                  </button>
                  <button
                    type='button'
                    onClick={() => navigate(-1)}
                    disabled={loading}
                    className='border border-brown-600/20 px-8 py-3 rounded-lg font-medium'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadBook;
