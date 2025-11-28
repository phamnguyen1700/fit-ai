import React from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Icon } from '@/shared/ui/icon';

export interface AdvisorFilterProps {
  onAdd?: () => void;
  onSpecialtyChange?: (key: string) => void;
  onStatusChange?: (key: string) => void;
  onMoreClick?: (key: string) => void;
}

export const AdvisorFilter: React.FC<AdvisorFilterProps> = ({
  onAdd,
  onSpecialtyChange,
  onStatusChange,
  onMoreClick,
}) => {
  const specialtyItems: MenuProps['items'] = [
    { key: 'all', label: 'Tất cả chuyên môn' },
    { key: 'fitness', label: 'Thể hình' },
    { key: 'yoga', label: 'Yoga' },
    { key: 'nutrition', label: 'Dinh dưỡng' },
    { key: 'cardio', label: 'Tim mạch' },
    { key: 'weight-loss', label: 'Giảm cân' },
  ];

  const statusItems: MenuProps['items'] = [
    { key: 'all', label: 'Tất cả trạng thái' },
    { key: 'active', label: 'Hoạt động' },
    { key: 'break', label: 'Tạm nghỉ' },
    { key: 'inactive', label: 'Ngưng hoạt động' },
  ];

  const moreItems: MenuProps['items'] = [
    { key: 'import', label: 'Nhập danh sách' },
    { key: 'export', label: 'Xuất danh sách' },
    { key: 'statistics', label: 'Thống kê' },
  ];

  return (
    <div className="w-full flex items-center gap-3">
      <button
        type="button"
        onClick={onAdd}
        className="btn-add-advisor"
      >
        <Icon name="mdi:plus-circle-outline" />
        <span>Thêm advisor</span>
      </button>

      <Dropdown trigger={['click']} menu={{ items: specialtyItems, onClick: (i) => onSpecialtyChange?.(i.key) }}>
        <button className="advisor-filter-dropdown flex-1 h-9 rounded-md border border-[var(--border)] px-3 text-left hover:bg-[var(--bg-secondary)]">
          Chuyên môn <Icon name="mdi:chevron-down" className="inline ml-1" />
        </button>
      </Dropdown>

      <Dropdown trigger={['click']} menu={{ items: statusItems, onClick: (i) => onStatusChange?.(i.key) }}>
        <button className="advisor-filter-dropdown flex-1 h-9 rounded-md border border-[var(--border)] px-3 text-left hover:bg-[var(--bg-secondary)]">
          Trạng thái <Icon name="mdi:chevron-down" className="inline ml-1" />
        </button>
      </Dropdown>

      <Dropdown trigger={['click']} menu={{ items: moreItems, onClick: (i) => onMoreClick?.(i.key) }}>
        <button className="advisor-filter-more h-9 w-9 grid place-items-center rounded-md border border-[var(--border)] hover:bg-[var(--bg-secondary)]">
          <Icon name="mdi:dots-vertical" />
        </button>
      </Dropdown>
    </div>
  );
};

export default AdvisorFilter;
