import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 24, className = '', message }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 
        size={size} 
        className="animate-spin text-primary dark:text-blue-400" 
      />
      {message && (
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;
