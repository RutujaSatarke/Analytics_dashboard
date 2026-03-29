import React from 'react';

export const Badge = ({ label, variant = 'primary' }) => {
  const styles = {
    primary: 'bg-indigo-100 text-indigo-700',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-slate-100 text-slate-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {label}
    </span>
  );
};
