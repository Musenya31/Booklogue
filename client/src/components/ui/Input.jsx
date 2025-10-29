const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className='mb-4'>
      {label && (
        <label className='block text-sm font-medium text-slate-900 mb-2'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-cream-50 border ${
          error ? 'border-red-500' : 'border-brown-600/20'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      {error && (
        <p className='mt-1 text-sm text-red-600'>{error}</p>
      )}
    </div>
  );
};

export default Input;
