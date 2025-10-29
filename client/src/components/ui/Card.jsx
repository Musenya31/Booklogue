const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  onClick,
  padding = 'p-6'
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-cream-100 
        rounded-lg 
        border 
        border-brown-600/12 
        shadow-sm 
        ${hoverable ? 'hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer' : ''}
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
