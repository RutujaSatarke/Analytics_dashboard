import React, { createContext, useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import { format, subDays } from 'date-fns';

export const FilterContext = createContext();

const COOKIE_OPTIONS = { expires: 30, path: '/' };

const DEFAULT_FILTERS = {
  start_date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
  end_date: format(new Date(), 'yyyy-MM-dd'),
  age_group: null,
  gender: null,
  feature_name: null,
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedFeature, setSelectedFeature] = useState(null);

  /**
   * Load filters from cookies on mount
   */
  useEffect(() => {
    const savedFilters = {
      start_date: Cookies.get('start_date') || DEFAULT_FILTERS.start_date,
      end_date: Cookies.get('end_date') || DEFAULT_FILTERS.end_date,
      age_group: Cookies.get('age_group') || null,
      gender: Cookies.get('gender') || null,
    };
    setFilters(savedFilters);
  }, []);

  /**
   * Update filter and save to cookies
   */
  const updateFilter = useCallback((filterKey, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [filterKey]: value };
      // Save to cookies
      if (value === null) {
        Cookies.remove(filterKey, { path: '/' });
      } else {
        Cookies.set(filterKey, value, COOKIE_OPTIONS);
      }
      return updated;
    });
  }, []);

  /**
   * Update date range
   */
  const updateDateRange = useCallback((startDate, endDate) => {
    setFilters((prev) => {
      const updated = { ...prev, start_date: startDate, end_date: endDate };
      Cookies.set('start_date', startDate, COOKIE_OPTIONS);
      Cookies.set('end_date', endDate, COOKIE_OPTIONS);
      return updated;
    });
  }, []);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSelectedFeature(null);
    ['start_date', 'end_date', 'age_group', 'gender'].forEach((key) => {
      Cookies.remove(key, { path: '/' });
    });
  }, []);

  const setFiltersState = useCallback((newFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === null || value === '') {
          Cookies.remove(key, { path: '/' });
        } else {
          Cookies.set(key, value, COOKIE_OPTIONS);
        }
      });
      return updated;
    });
  }, []);

  const value = {
    filters,
    selectedFeature,
    updateFilter,
    updateDateRange,
    resetFilters,
    setSelectedFeature,
    setFiltersState,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};