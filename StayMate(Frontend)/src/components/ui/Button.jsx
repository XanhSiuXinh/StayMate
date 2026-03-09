import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-secondary text-white hover:bg-purple-600 shadow-md hover:shadow-lg hover:-translate-y-0.5',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-blue-50 dark:hover:bg-primary/10',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
    danger: 'bg-danger text-white hover:bg-red-600 shadow-md hover:shadow-lg hover:-translate-y-0.5',
    white: 'bg-white text-gray-900 shadow-sm hover:shadow-md border border-gray-200 hover:bg-gray-50',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
    xl: 'text-lg px-8 py-4 gap-3',
  };

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'xl' ? 24 : 18} />}
      {!isLoading && Icon && <Icon size={size === 'sm' ? 14 : size === 'xl' ? 24 : 18} />}
      {children}
    </button>
  );
};

export default Button;
