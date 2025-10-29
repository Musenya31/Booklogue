const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className='flex flex-col items-center justify-center py-12'>
      <div className={`${sizes[size]} border-4 border-teal-500 border-t-transparent rounded-full animate-spin`} />
      {text && (
        <p className='mt-4 text-slate-500'>{text}</p>
      )}
    </div>
  );
};

export default Loader;
