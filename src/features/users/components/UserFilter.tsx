import React, { useState } from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Icon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/core/Input';

export interface UserFilterProps {
  onPlanChange?: (key: string) => void;
  onStatusChange?: (key: string) => void;
  onMoreClick?: (key: string) => void;
  onSearchChange?: (value: string) => void;
}

export const UserFilter: React.FC<UserFilterProps> = ({
  onPlanChange,
  onStatusChange,
  onSearchChange,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const statusItems: MenuProps['items'] = [
    { key: 'all', label: 'Tất cả trạng thái' },
    { key: 'active', label: 'Đang hoạt động' },
    { key: 'inactive', label: 'Ngưng' },
  ];

  return (
    <div className="w-full flex items-center gap-3">
      <div className="flex-1 min-w-[200px]">
        <Input
          prefix={<Icon name="mdi:magnify" />}
          placeholder="Tìm kiếm người dùng..."
          value={searchValue}
          onChange={handleSearchChange}
          className="h-[45px]"
          allowClear
        />
      </div>

      <Dropdown trigger={[ 'click' ]} menu={{ items: statusItems, onClick: (i) => onStatusChange?.(i.key) }}>
        <button className="user-filter-dropdown flex-1 h-[45px] rounded-md border border-[var(--border)] px-3 text-left hover:bg-[var(--bg-secondary)]">
          Trạng thái <Icon name="mdi:chevron-down" className="inline ml-1" />
        </button>
      </Dropdown>
    </div>
  );
};

export default UserFilter;


