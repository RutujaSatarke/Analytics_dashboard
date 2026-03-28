import React, { useState } from 'react';
import { FiFilter, FiX, FiRefreshCw } from 'react-icons/fi';
import { useFilters } from '../../hooks/useFilters';
import { trackingAPI } from '../../services/api';

export const Filters = ({ onFiltersChange }) => {
  const { filters, updateFilter, updateDateRange, resetFilters } = useFilters();
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e, dateType) => {
    const newDate = e.target.value;
    if (dateType === 'start_date') {
      updateDateRange(newDate, filters.end_date);
    } else {
      updateDateRange(filters.start_date, newDate);
    }
    trackFeature('date_filter');
    onFiltersChange?.();
  };

  const handleAgeGroupChange = (e) => {
    const value = e.target.value || null;
    updateFilter('age_group', value);
    trackFeature('age_filter');
    onFiltersChange?.();
  };

  const handleGenderChange = (e) => {
    const value = e.target.value || null;
    updateFilter('gender', value);
    trackFeature('gender_filter');
    onFiltersChange?.();
  };

  const handleReset = () => {
    resetFilters();
    onFiltersChange?.();
  };

  const trackFeature = async (featureName) => {
    try {
      await trackingAPI.trackFeature(featureName);
    } catch (err) {
      console.error('Failed to track feature:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="text-blue-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => handleDateChange(e, 'start_date')}
            max={filters.end_date}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => handleDateChange(e, 'end_date')}
            min={filters.start_date}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Age Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age Group
          </label>
          <select
            value={filters.age_group || ''}
            onChange={handleAgeGroupChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Ages</option>
            <option value="<18">Under 18</option>
            <option value="18-40">18-40</option>
            <option value=">40">Over 40</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={filters.gender || ''}
            onChange={handleGenderChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
        >
          <FiRefreshCw size={16} />
          Reset Filters
        </button>
      </div>
    </div>
  );
};