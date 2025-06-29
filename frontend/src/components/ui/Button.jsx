// src/components/ui/Button.jsx
import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = `
    relative inline-flex items-center justify-center font-semibold transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400
    disabled:opacity-50 disabled:cursor-not-allowed
    border-2
  `;

  const variants = {
    primary: `
      bg-gradient-to-b from-amber-400 to-amber-600 
      border-amber-700 text-amber-900
      hover:from-amber-300 hover:to-amber-500
      shadow-lg hover:shadow-xl
      active:scale-95
    `,
    secondary: `
      bg-gradient-to-b from-stone-600 to-stone-800 
      border-stone-900 text-stone-100
      hover:from-stone-500 hover:to-stone-700
      shadow-lg hover:shadow-xl
      active:scale-95
    `,
    danger: `
      bg-gradient-to-b from-red-500 to-red-700 
      border-red-800 text-red-100
      hover:from-red-400 hover:to-red-600
      shadow-lg hover:shadow-xl
      active:scale-95
    `,
    outline: `
      bg-transparent border-amber-600 text-amber-600
      hover:bg-amber-50 hover:text-amber-700
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-6 py-2.5 text-base rounded-md',
    lg: 'px-8 py-3 text-lg rounded-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };