'use client';

import React from 'react';
import { Select } from '@/shared/ui/core/Select';

export interface FeedbackFilterProps {
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedMedia: string;
  onMediaChange: (value: string) => void;
  layout?: 'stacked' | 'inline';
}

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ đánh giá' },
  { value: 'reviewed', label: 'Đã đánh giá' },
];

const mediaOptions = [
  { value: 'all', label: 'Tất cả loại' },
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Hình ảnh' },
];

export const FeedbackFilter: React.FC<FeedbackFilterProps> = ({
  selectedStatus,
  onStatusChange,
  selectedMedia,
  onMediaChange,
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
          classNames={{ popup: { root: "themed-select-dropdown" } }}
        />
        <Select
          value={selectedMedia}
          options={mediaOptions}
          onChange={onMediaChange}
          className="min-w-[180px]"
          classNames={{ popup: { root: "themed-select-dropdown" } }}
        />
      </div>
    </div>
  );
};

export default FeedbackFilter;
