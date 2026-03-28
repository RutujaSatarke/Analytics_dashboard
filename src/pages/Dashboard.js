import React, { useState, useEffect } from 'react';
import { FiUsers, FiMousePointer, FiAlertCircle } from 'react-icons/fi';
import { Filters } from '../components/Filters/Filters';
import { AnalyticsBarChart } from '../components/Charts/BarChart';
import { AnalyticsLineChart } from '../components/Charts/LineChart';
import { StatsCard } from '../components/Stats/StatsCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Header } from '../components/Header/Header';
import { useFilters } from '../hooks/useFilters';
import { analyticsAPI } from '../services/api';

export const Dashboard = () => {
  const { filters, selectedFeature, setSelectedFeature } = useFilters();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  /**
   * Fetch analytics data
   */
  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyticsAPI.getAnalytics(filters);
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch analytics data'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch analytics on filter change
   */
  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  /**
   * Fetch line chart data when feature is selected
   */
  useEffect(() => {
    if (selectedFeature && analyticsData) {
      const featureFilters = {
        ...filters,
        feature_name: selectedFeature,
      };
      const fetchLineChartData = async () => {
        try {
          const response = await analyticsAPI.getAnalytics(featureFilters);
          setAnalyticsData((prev) => ({
            ...prev,
            line_chart: response.data.line_chart,
          }));
        } catch (err) {
          console.error('Failed to fetch line chart data:', err);
        }
      };
      fetchLineChartData();
    }
  }, [selectedFeature]);

  const handleBarClick = (featureName) => {
    setSelectedFeature(featureName);
  };

  const handleFiltersChange = () => {
    // Filters context handles the tracking and cookie updates
    // This is just a callback hook for any additional UI updates
  };

  if (loading && !analyticsData) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <LoadingSkeleton />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={fetchAnalytics}
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <Filters onFiltersChange={handleFiltersChange} />

          {/* Stats Cards */}
          {analyticsData?.stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Unique Users"
                value={analyticsData.stats.unique_users}
                icon={FiUsers}
                color="blue"
              />
              <StatsCard
                title="Total Clicks"
                value={analyticsData.stats.total_clicks}
                icon={FiMousePointer}
                color="green"
              />
              <StatsCard
                title="Selected Feature"
                value={selectedFeature || 'None'}
                icon={FiAlertCircle}
                color="purple"
              />
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsBarChart
              data={analyticsData?.bar_chart}
              onBarClick={handleBarClick}
              selectedFeature={selectedFeature}
            />
            <AnalyticsLineChart
              data={analyticsData?.line_chart}
              selectedFeature={selectedFeature}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span className="text-sm">Updating data...</span>
            </div>
          )}
        </div>
      </main>
    </>
  );
};