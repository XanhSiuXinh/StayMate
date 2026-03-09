import React from 'react';

const Card = ({
  children,
  className = '',
  glass = false,
  hover = false,
  ...props
}) => {
  const baseClasses = 'rounded-2xl border';
  const glassClasses = glass 
    ? 'glass-card border-white/40 dark:border-white/10' 
    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-300' : '';

  return (
    <div 
      className={`${baseClasses} ${glassClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
