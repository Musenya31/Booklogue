const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseStyles = 'font-medium rounded-lg transition-colors inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-transparent border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white',
    outline: 'bg-transparent border border-brown-600/20 text-slate-900 hover:bg-cream-50',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
