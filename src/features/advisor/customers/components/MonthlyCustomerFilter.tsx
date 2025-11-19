'use client';

import React from 'react';
import { Select } from '@/shared/ui/core/Select';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Icon } from '@/shared/ui/icon';

export interface MonthlyCustomerFilterProps {
  months: { label: string; value: string }[];
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onCreatePlan?: () => void;
  onMoreAction?: (action: string) => void;
}

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'on-track', label: 'Đúng tiến độ' },
  { value: 'at-risk', label: 'Cần chú ý' },
  { value: 'behind', label: 'Bị chậm' },
];

const moreActions: MenuProps['items'] = [
  { key: 'export', label: 'Xuất báo cáo tháng' },
  { key: 'schedule', label: 'Lên lịch nhắc nhở' },
];

export const MonthlyCustomerFilter: React.FC<MonthlyCustomerFilterProps> = ({
  months,
  selectedMonth,
  onMonthChange,
  selectedStatus,
  onStatusChange,
  onCreatePlan,
  onMoreAction,
}) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
        <Select
          value={selectedMonth}
          options={months}
          onChange={onMonthChange}
          className="min-w-[180px]"
          popupClassName="themed-select-dropdown"
        />
        <Select
          value={selectedStatus}
          options={statusOptions}
          onChange={onStatusChange}
          className="min-w-[180px]"
          popupClassName="themed-select-dropdown"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCreatePlan}
          className="flex h-9 items-center gap-2 rounded-md bg-[var(--primary)] px-3 font-medium text-white hover:opacity-90"
        >
          <Icon name="mdi:plus-circle-outline" />
          <span>Thêm kế hoạch</span>
        </button>
        <Dropdown
          trigger={[ 'click' ]}
          menu={{ items: moreActions, onClick: ({ key }) => onMoreAction?.(key) }}
        >
          <button className="h-9 w-9 grid place-items-center rounded-md border border-[var(--border)] hover:bg-[var(--bg-tertiary)]">
            <Icon name="mdi:dots-vertical" />
          </button>
        </Dropdown>
      </div>
    </div>
  );
};

export default MonthlyCustomerFilter;
