import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field-specific error when user types
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Username validation
    if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          backendErrors[error.path] = error.msg;
        });
        setFieldErrors(backendErrors);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12'>
      <div className='max-w-md w-full'>
        <div className='text-center mb-8'>
          <Link to='/' className='text-4xl font-semibold text-teal-500'>
            📚 BookLogue
          </Link>
          <h1 className='text-3xl font-semibold text-slate-900 mt-6 mb-2'>
            Create Account
          </h1>
          <p className='text-slate-500'>Join our community of book lovers</p>
        </div>

        <div className='bg-cream-100 rounded-lg shadow-sm border border-brown-600/12 p-8'>
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-slate-900 mb-2'>
                Username
              </label>
              <input
                type='text'
                name='username'
                value={formData.username}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-cream-50 border ${
                  fieldErrors.username ? 'border-red-500' : 'border-brown-600/20'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                placeholder='johndoe'
              />
              {fieldErrors.username && (
                <p className='mt-1 text-sm text-red-600'>{fieldErrors.username}</p>
              )}
              <p className='mt-1 text-xs text-slate-500'>
                Only letters, numbers, and underscores allowed
              </p>
            </div>

            {/* Email */}
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
                className={`w-full px-4 py-3 bg-cream-50 border ${
                  fieldErrors.email ? 'border-red-500' : 'border-brown-600/20'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                placeholder='you@example.com'
              />
              {fieldErrors.email && (
                <p className='mt-1 text-sm text-red-600'>{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-slate-900 mb-2'>
                Password
              </label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-cream-50 border ${
                  fieldErrors.password ? 'border-red-500' : 'border-brown-600/20'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                placeholder='••••••••'
              />
              {fieldErrors.password && (
                <p className='mt-1 text-sm text-red-600'>{fieldErrors.password}</p>
              )}
              <p className='mt-1 text-xs text-slate-500'>
                At least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-slate-900 mb-2'>
                Confirm Password
              </label>
              <input
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-cream-50 border ${
                  fieldErrors.confirmPassword ? 'border-red-500' : 'border-brown-600/20'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                placeholder='••••••••'
              />
              {fieldErrors.confirmPassword && (
                <p className='mt-1 text-sm text-red-600'>{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className='text-center text-slate-500 mt-6'>
            Already have an account?{' '}
            <Link to='/login' className='text-teal-500 hover:text-teal-600 font-medium'>
              Sign In
            </Link>
          </p>
        </div>

        {/* Additional Info */}
        <div className='mt-6 text-center text-sm text-slate-500'>
          <p>By creating an account, you agree to our</p>
          <p>
            <a href='#' className='text-teal-500 hover:text-teal-600'>Terms of Service</a>
            {' '}&{' '}
            <a href='#' className='text-teal-500 hover:text-teal-600'>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
