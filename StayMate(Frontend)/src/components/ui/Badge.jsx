import React from 'react';

const Badge = ({
  children,
  variant = 'primary',
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors';
  
  const variants = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
    success: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
    warning: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800',
    danger: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
    gray: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800'
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

export default Badge;
