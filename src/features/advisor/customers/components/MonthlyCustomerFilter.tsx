'use client';

import React from 'react';
import { Select } from '@/shared/ui/core/Select';

export interface MonthlyCustomerFilterProps {
  months: { label: string; value: string }[];
  selectedMonth: string;
  onMonthChange: (value: string) => void;
}

export const MonthlyCustomerFilter: React.FC<MonthlyCustomerFilterProps> = ({
  months,
  selectedMonth,
  onMonthChange,
}) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <Select
        value={selectedMonth}
        options={months}
        onChange={onMonthChange}
        className="min-w-[180px]"
        classNames={{ popup: { root: "themed-select-dropdown" } }}
      />
    </div>
  );
};

export default MonthlyCustomerFilter;
