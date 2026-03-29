import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiChevronDown, FiChevronUp, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { useFilters } from '../../hooks/useFilters';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const formatDate = (date) => date?.slice(0, 10) || '';

export const FiltersPanel = ({ loading, onApply, onClear }) => {
  const { filters, setFiltersState, resetFilters } = useFilters();
  const [isOpen, setIsOpen] = useState(true);
  const [localFilters, setLocalFilters] = useState(filters);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const hasChanged = useMemo(() => JSON.stringify(filters) !== JSON.stringify(localFilters), [filters, localFilters]);

  const apply = () => {
    setFiltersState(localFilters);
    setApplied(true);
    onApply?.();
  };

  const clearAll = () => {
    resetFilters();
    setLocalFilters({
      ...filters,
      start_date: filters.start_date,
      end_date: filters.end_date,
      age_group: null,
      gender: null,
    });
    setApplied(false);
    onClear?.();
  };

  const setField = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2">
          <FiFilter className="text-indigo-500" size={18} />
          <h2 className="text-lg font-semibold text-slate-800">Filter panel</h2>
          {applied && <Badge label="Filters Applied" variant="primary" />}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearAll} disabled={loading}>
            <FiRefreshCw className="mr-1" /> Clear All
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen((v) => !v)}>
            {isOpen ? 'Collapse' : 'Expand'} {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="mt-4 overflow-hidden"
          >
            <motion.div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formatDate(localFilters.start_date)}
                    onChange={(e) => setField('start_date', e.target.value)}
                    max={localFilters.end_date}
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formatDate(localFilters.end_date)}
                    onChange={(e) => setField('end_date', e.target.value)}
                    min={localFilters.start_date}
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Age Group</label>
                  <select
                    value={localFilters.age_group || ''}
                    onChange={(e) => setField('age_group', e.target.value || null)}
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">All ages</option>
                    <option value="<18">Under 18</option>
                    <option value="18-40">18-40</option>
                    <option value=">40">40+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
                  <select
                    value={localFilters.gender || ''}
                    onChange={(e) => setField('gender', e.target.value || null)}
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">All genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  onClick={apply}
                  disabled={!hasChanged || loading}
                  title={hasChanged ? 'Apply selected filters' : 'No changes to apply'}
                >
                  <FiCheckCircle className="mr-2" /> Apply Filters
                </Button>
                <Button variant="ghost" onClick={clearAll} disabled={loading}>
                  Reset Filters
                </Button>
                {loading && <span className="text-sm text-slate-500">Updating data…</span>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
