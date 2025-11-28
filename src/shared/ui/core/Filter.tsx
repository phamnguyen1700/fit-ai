import React, { useState, useEffect } from 'react';
import { Select } from './Select';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  placeholder: string;
  options: FilterOption[];
  className?: string;
  disabled?: boolean;
}

interface FilterProps {
  className?: string;
  filters: FilterConfig[];
  onFilterChange?: (filters: Record<string, string>) => void;
  showResetButton?: boolean;
  resetButtonTitle?: string;
  initialValues?: Record<string, string>;
}

const Filter: React.FC<FilterProps> = ({ 
  className = '', 
  filters = [],
  onFilterChange,
  showResetButton = true,
  resetButtonTitle = "Reset filters",
  initialValues = {}
}) => {
  // Khởi tạo state với initial values hoặc empty strings
  const getInitialState = React.useCallback(() => {
    const state: Record<string, string> = {};
    filters.forEach(filter => {
      state[filter.key] = initialValues[filter.key] || '';
    });
    return state;
  }, [filters, initialValues]);

  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => getInitialState());

  // Cập nhật state khi initialValues thay đổi
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setFilterValues(getInitialState());
    }
  }, [initialValues, getInitialState]);

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = {
      ...filterValues,
      [filterKey]: value
    };
    setFilterValues(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters: Record<string, string> = {};
    filters.forEach(filter => {
      resetFilters[filter.key] = '';
    });
    setFilterValues(resetFilters);
    onFilterChange?.(resetFilters);
  };

  return (
    <div className={`filter-container ${className}`}>
      {filters.map((filter) => (
        <div key={filter.key} className="filter-select">
          <Select
            value={filterValues[filter.key] || ''}
            onChange={(value) => handleFilterChange(filter.key, value)}
            options={filter.options}
            placeholder={filter.placeholder}
            className={filter.className || "min-w-[150px]"}
            disabled={filter.disabled}
          />
        </div>
      ))}
      
      {/* Reset button */}
      {showResetButton && (
        <button
          onClick={handleReset}
          className="filter-reset-button"
          title={resetButtonTitle}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Filter;