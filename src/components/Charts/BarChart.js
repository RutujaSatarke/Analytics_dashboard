import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FiBarChart2 } from 'react-icons/fi';
import { trackingAPI } from '../../services/api';

export const AnalyticsBarChart = ({ data, onBarClick, selectedFeature }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiBarChart2 className="text-blue-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">Feature Usage</h2>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const handleBarClick = (data) => {
    const featureName = data.feature_name;
    onBarClick?.(featureName);
    trackFeature('bar_chart_click');
  };

  const trackFeature = async (featureName) => {
    try {
      await trackingAPI.trackFeature(featureName);
    } catch (err) {
      console.error('Failed to track feature:', err);
    }
  };

  // Highlight selected feature
  const chartData = data.map((item) => ({
    ...item,
    fill:
      selectedFeature === item.feature_name ? '#3b82f6' : '#60a5fa',
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiBarChart2 className="text-blue-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-800">Feature Usage</h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="feature_name" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#3b82f6"
            onClick={(data) => handleBarClick(data)}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-600">
        {selectedFeature && (
          <p>Selected feature: <strong>{selectedFeature}</strong></p>
        )}
        <p>Click on a bar to view its trend</p>
      </div>
    </div>
  );
};