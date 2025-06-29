// src/components/ui/Input.jsx
import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ 
  className, 
  type = 'text', 
  error,
  label,
  ...props 
}, ref) => {
  const baseStyles = `
    w-full px-4 py-3 rounded-md border-2 transition-all duration-200
    bg-stone-50 border-stone-300 text-stone-900
    focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400
    placeholder:text-stone-500
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : '';

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-semibold text-stone-700">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(baseStyles, errorStyles, className)}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };