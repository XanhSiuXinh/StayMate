import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  containerClassName = '',
  id,
  ...props
}, ref) => {
  const generatedId = id || Math.random().toString(36).substr(2, 9);
  
  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={generatedId} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        
        <input
          ref={ref}
          id={generatedId}
          className={`
            w-full bg-gray-50 dark:bg-gray-800/50 border rounded-xl px-4 py-2.5 text-sm
            text-gray-900 dark:text-white placeholder:text-gray-400 
            transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-xs text-red-500 font-medium mt-0.5 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
