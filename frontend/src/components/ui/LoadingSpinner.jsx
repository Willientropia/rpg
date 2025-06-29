// src/components/ui/LoadingSpinner.jsx
import React from 'react';
import { cn } from '../../utils/cn';

const LoadingSpinner = ({ size = 'md', className, message = 'Carregando...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 flex items-center justify-center">
      <div className="text-center">
        <div className={cn(
          'animate-spin rounded-full border-b-2 border-amber-400 mx-auto mb-4',
          sizeClasses[size],
          className
        )} />
        <p className="text-amber-400 font-semibold text-lg">
          {message}
        </p>
      </div>
    </div>
  );
};

export { LoadingSpinner };