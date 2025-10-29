
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { parseErrorMessage } from '../utils/formatters';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-cream-50 flex items-center justify-center px-4'>
      <div className='max-w-md w-full'>
        <div className='text-center mb-8'>
          <Link to='/' className='text-4xl font-semibold text-teal-500'>
            📚 BookLogue
          </Link>
          <h1 className='text-3xl font-semibold text-slate-900 mt-6 mb-2'>
            Welcome Back
          </h1>
          <p className='text-slate-500'>Sign in to continue reading and reviewing</p>
        </div>

        <div className='bg-cream-100 rounded-lg shadow-sm border border-brown-600/12 p-8'>
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-slate-900 mb-2'>
                Email Address
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 bg-cream-50 border border-brown-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                placeholder='you@example.com'
              />
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-slate-900 mb-2'>
                Password
              </label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 bg-cream-50 border border-brown-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                placeholder='••••••••'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className='text-center text-slate-500 mt-6'>
            Don't have an account?{' '}
            <Link to='/register' className='text-teal-500 hover:text-teal-600 font-medium'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
