import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-400',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm ${variantStyles[variant] || ''} ${sizeStyles[size] || ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
