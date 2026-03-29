import React, { useState, useEffect, useCallback } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { Header } from '../components/Header/Header';
import { useFilters } from '../hooks/useFilters';
import { analyticsAPI } from '../services/api';
import { FiltersPanel } from '../components/dashboard/FiltersPanel';
import { KPISection } from '../components/dashboard/KPISection';
import { BarChartCard } from '../components/dashboard/BarChartCard';
import { LineChartCard } from '../components/dashboard/LineChartCard';
import { Loader } from '../components/ui/Loader';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard = () => {
  const { filters, selectedFeature, setSelectedFeature } = useFilters();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchAnalytics = useCallback(async (overrides) => {
    setLoading(true);
    setError(null);

    try {
      const payload = overrides ? { ...filters, ...overrides } : filters;
      const response = await analyticsAPI.getAnalytics(payload);
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (selectedFeature && analyticsData) {
      const featureFilters = { ...filters, feature_name: selectedFeature };
      const fetchLineChartData = async () => {
        try {
          const response = await analyticsAPI.getAnalytics(featureFilters);
          setAnalyticsData((prev) => ({ ...prev, line_chart: response.data.line_chart }));
        } catch (err) {
          console.error('Failed to fetch line chart data:', err);
        }
      };
      fetchLineChartData();
    }
  }, [selectedFeature, analyticsData, filters]);

  const handleBarClick = (featureName) => {
    setSelectedFeature(featureName);
    setToast({ id: Date.now(), message: `Interaction tracked: ${featureName}` });
    setTimeout(() => setToast(null), 2200);
  };

  const handleApplyFilters = () => {
    setToast({ id: Date.now(), message: 'Filters applied' });
    setTimeout(() => setToast(null), 2200);
  };

  const handleClearFilters = () => {
    setSelectedFeature(null);
    setToast({ id: Date.now(), message: 'Filters cleared' });
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3"
            >
              <FiAlertCircle className="text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
                <button onClick={() => fetchAnalytics()} className="text-xs text-red-600 hover:underline">
                  Retry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <FiltersPanel loading={loading} onApply={handleApplyFilters} onClear={handleClearFilters} />

        <KPISection stats={analyticsData?.stats} selectedFeature={selectedFeature} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChartCard data={analyticsData?.bar_chart} selectedFeature={selectedFeature} onSelectFeature={handleBarClick} loading={loading} />
          <LineChartCard data={analyticsData?.line_chart} selectedFeature={selectedFeature} loading={loading} />
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed bottom-4 right-4 flex items-center justify-between gap-3 bg-indigo-600 text-white rounded-xl px-4 py-2 shadow-lg">
              <Loader label="Updating data..." />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
