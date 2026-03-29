import React from 'react';

export const Loader = ({ label = 'Loading...' }) => (
  <div className="inline-flex items-center gap-2 text-sm text-slate-600">
    <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
    {label}
  </div>
);
