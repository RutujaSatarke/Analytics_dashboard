import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FiTrendingUp } from 'react-icons/fi';

export const AnalyticsLineChart = ({ data, selectedFeature }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp className="text-green-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">
            Trend Over Time
          </h2>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-400">
          {selectedFeature
            ? 'No data available for selected feature'
            : 'Select a feature to view its trend'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiTrendingUp className="text-green-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-800">
          {selectedFeature ? `${selectedFeature} Trend` : 'Trend Over Time'}
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            style={{ fontSize: '12px' }}
            tick={{ angle: -45, textAnchor: 'end' }}
            height={100}
          />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            name="Clicks"
          />
        </LineChart>
      </ResponsiveContainer>

      {selectedFeature && (
        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
          <p className="text-sm text-green-700">
            Showing trend for: <strong>{selectedFeature}</strong>
          </p>
        </div>
      )}
    </div>
  );
};