import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Analytics Dashboard</h1>
          <p className="text-sm text-slate-600 mt-0.5">Enterprise metrics with actionable intelligence</p>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2 bg-white/85 border border-slate-200 rounded-full px-3 py-1">
              <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                {user.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-slate-700">{user.username}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            title="Log out"
          >
            <FiLogOut size={16} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};