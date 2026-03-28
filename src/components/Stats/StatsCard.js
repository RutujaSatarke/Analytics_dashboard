import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
  };

  const iconBgClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 border ${colorClasses[color] || colorClasses.blue}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBgClasses[color] || iconBgClasses.blue}`}>
          <Icon className={iconColorClasses[color] || iconColorClasses.blue} size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};