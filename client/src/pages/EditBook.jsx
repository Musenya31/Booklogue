import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    genres: []
  });

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await bookService.getBookById(id);
        setForm(res.data);
      } catch {
        alert('Failed to fetch book');
      }
    }
    fetchBook();
  }, [id]);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await bookService.updateBook(id, form);
      navigate('/library');
    } catch {
      alert('Failed to update book');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Book</h2>

      <label className="block mb-2 font-semibold">Title</label>
      <input name="title" value={form.title} onChange={handleChange} required className="w-full p-2 border rounded mb-4" />

      <label className="block mb-2 font-semibold">Author</label>
      <input name="author" value={form.author} onChange={handleChange} required className="w-full p-2 border rounded mb-4" />

      <label className="block mb-2 font-semibold">Description</label>
      <textarea name="description" value={form.description} onChange={handleChange} rows={4} required className="w-full p-2 border rounded mb-4" />

      <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Save Changes</button>
    </form>
  );
};

export default EditBook;
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    console.error('Error in getBookById:', error);
    res.status(500).json({ message: error.message });
  }
};
const getFeaturedBooks = async (req, res) => {
  try {
    const featuredBooks = await Book.find().sort('-createdAt').limit(5);
    res.json(featuredBooks);
    } catch (error) {
    console.error('Error in getFeaturedBooks:', error);
    res.status(500).json({ message: error.message });
    }
};

const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    console.error('Error in createBook:', error);
    res.status(400).json({ message: error.message });
  }
};
const updateBook = async (req, res) => {
    try {
    const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.json(updatedBook);
  } catch (error) {
    console.error('Error in updateBook:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (error) {
    console.error('Error in deleteBook:', error);
    res.status(500).json({ message: error.message });
  }
};