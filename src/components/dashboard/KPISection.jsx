import React from 'react';
import { FiUsers, FiMousePointer, FiTrendingUp } from 'react-icons/fi';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';

const statsConfig = [
  { label: 'Unique Users', key: 'unique_users', icon: FiUsers, trend: '+5%', trendType: 'success', gradient: 'from-indigo-100 to-indigo-50', color: 'text-indigo-700' },
  { label: 'Total Clicks', key: 'total_clicks', icon: FiMousePointer, trend: '+12%', trendType: 'success', gradient: 'from-emerald-100 to-emerald-50', color: 'text-emerald-700' },
  { label: 'Selected Feature', key: 'selected_feature', icon: FiTrendingUp, trend: '-2%', trendType: 'danger', gradient: 'from-violet-100 to-violet-50', color: 'text-violet-700' },
];

export const KPISection = ({ stats, selectedFeature, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-white rounded-2xl shadow-sm p-4 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      {statsConfig.map((item) => {
        const Icon = item.icon;
        const value = item.key === 'selected_feature' ? (selectedFeature || 'None') : stats?.[item.key] ?? '—';

        return (
          <Card key={item.key} className="p-5">
            <motion.div whileTap={{ scale: 0.98 }} className="flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br ${item.gradient} ${item.color}`}>
                  <Icon size={18} />
                </span>
                <Badge label={item.trend} variant={item.trendType === 'success' ? 'success' : 'danger'} />
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
              </div>
            </motion.div>
          </Card>
        );
      })}
    </div>
  );
};
