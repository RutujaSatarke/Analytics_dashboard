import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { FiBarChart2 } from 'react-icons/fi';
import { Card } from '../ui/Card';
import { trackingAPI } from '../../services/api';

const formatTooltip = (value, name) => [`${value}`, name];

export const BarChartCard = ({ data, selectedFeature, onSelectFeature, loading }) => {
  const chartData = useMemo(
    () =>
      (data || []).map((item) => ({
        ...item,
        fill: selectedFeature === item.feature_name ? '#4f46e5' : '#60a5fa',
      })),
    [data, selectedFeature]
  );

  const trackFeature = async (featureName) => {
    try {
      await trackingAPI.trackFeature('bar_chart_click', { feature: featureName });
    } catch (err) {
      console.error('Failed tracking feature click', err);
    }
  };

  const handleBarClick = (barData) => {
    if (!barData) return;
    const featureName = barData.feature_name;
    onSelectFeature?.(featureName);
    trackFeature(featureName);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiBarChart2 className="text-indigo-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">Feature Usage</h3>
        </div>
        <span className="text-xs text-slate-500">Click to view trend</span>
      </div>

      {loading ? (
        <div className="h-72 flex items-center justify-center text-slate-400">Loading chart…</div>
      ) : data?.length ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={chartData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="feature_name" tick={{ fontSize: 12, fill: '#64748b' }} angle={-38} textAnchor="end" height={90} />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }} formatter={formatTooltip} cursor={{ fill: 'rgba(59,130,246,.15)' }} />
              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                onClick={(point) => handleBarClick(point)}
                isAnimationActive={true}
                animationDuration={400}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      ) : (
        <div className="h-72 grid place-items-center text-slate-500">No data available for selected filters</div>
      )}

      {selectedFeature && (
        <p className="mt-4 text-sm text-slate-600">
          Active bar: <strong>{selectedFeature}</strong>
        </p>
      )}
    </Card>
  );
};
