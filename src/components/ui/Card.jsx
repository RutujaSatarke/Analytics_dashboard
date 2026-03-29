import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ className = '', children, ...props }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)' }}
      transition={{ duration: 0.25 }}
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </motion.section>
  );
};
