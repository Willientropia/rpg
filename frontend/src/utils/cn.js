// src/utils/cn.js
// Utility function to combine classes (similar to clsx/classnames)
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

// Alternative implementation with object support
export function clsx(...args) {
  const classes = [];
  
  args.forEach(arg => {
    if (!arg) return;
    
    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      classes.push(clsx(...arg));
    } else if (typeof arg === 'object') {
      Object.keys(arg).forEach(key => {
        if (arg[key]) {
          classes.push(key);
        }
      });
    }
  });
  
  return classes.join(' ').trim();
}