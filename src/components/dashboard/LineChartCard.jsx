import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';
import { Card } from '../ui/Card';

export const LineChartCard = ({ data, selectedFeature, loading }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiTrendingUp className="text-emerald-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">
            {selectedFeature ? `${selectedFeature} Trend` : 'Trend Over Time'}
          </h3>
        </div>
        <span className="text-xs text-slate-500">Smooth line + dynamic summary</span>
      </div>

      {loading ? (
        <div className="h-72 flex items-center justify-center text-slate-400">Loading chart…</div>
      ) : !data || !data.length ? (
        <div className="h-72 grid place-items-center text-slate-500">
          {selectedFeature ? 'No data available for selected feature' : 'Select a feature to view trend'}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => value} />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }} />
              <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2.5} fill="url(#colorFill)" activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </Card>
  );
};
