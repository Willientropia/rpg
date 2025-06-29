// src/components/ui/Card.jsx
import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        `bg-gradient-to-br from-stone-50 to-stone-100 
         border-2 border-stone-300 rounded-lg shadow-xl
         backdrop-blur-sm relative overflow-hidden`,
        className
      )}
      {...props}
    >
      {/* Medieval border decoration */}
      <div className="absolute inset-0 border-2 border-amber-200 rounded-lg opacity-30" />
      <div className="relative">{children}</div>
    </div>
  );
};

export { Card };  