'use client';

import React from 'react';
import { Select } from '@/shared/ui/core/Select';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Icon } from '@/shared/ui/icon';

export interface FeedbackFilterProps {
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedMedia: string;
  onMediaChange: (value: string) => void;
  onBulkAction?: (action: string) => void;
  layout?: 'stacked' | 'inline';
}

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ đánh giá' },
  { value: 'reviewed', label: 'Đã đánh giá' },
  { value: 'rework', label: 'Cần làm lại' },
];

const mediaOptions = [
  { value: 'all', label: 'Tất cả loại' },
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Hình ảnh' },
];

const moreActions: MenuProps['items'] = [
  { key: 'export', label: 'Xuất danh sách' },
  { key: 'download-media', label: 'Tải toàn bộ media' },
];

export const FeedbackFilter: React.FC<FeedbackFilterProps> = ({
  selectedStatus,
  onStatusChange,
  selectedMedia,
  onMediaChange,
  onBulkAction,
  layout = 'stacked',
}) => {
  const containerClass =
    layout === 'inline'
      ? 'flex flex-wrap items-center gap-2'
      : 'flex flex-col gap-3 md:flex-row md:items-center md:justify-between';

  const selectWrapperClass =
    layout === 'inline'
      ? 'flex flex-wrap items-center gap-2'
      : 'flex flex-1 flex-col gap-3 md:flex-row md:items-center';

  return (
    <div className={containerClass}>
      <div className={selectWrapperClass}>
        <Select
          value={selectedStatus}
          options={statusOptions}
          onChange={onStatusChange}
          className="min-w-[180px]"
          popupClassName="themed-select-dropdown"
        />
        <Select
          value={selectedMedia}
          options={mediaOptions}
          onChange={onMediaChange}
          className="min-w-[180px]"
          popupClassName="themed-select-dropdown"
        />
      </div>

      <div className="flex items-center gap-2">
        <Dropdown
          trigger={[ 'click' ]}
          menu={{ items: moreActions, onClick: ({ key }) => onBulkAction?.(key) }}
        >
          <button className="h-9 w-9 grid place-items-center rounded-md border border-[var(--border)] hover:bg-[var(--bg-tertiary)]">
            <Icon name="mdi:dots-vertical" />
          </button>
        </Dropdown>
      </div>
    </div>
  );
};

export default FeedbackFilter;
