"use client";
import React from 'react';
import { Button } from '../../../shared/ui/core/Button';
import { SearchInput } from '../../../shared/ui/layout/admin/components/SearchInput';
import { Icon, icons } from '../../../shared/ui/icon';
import { Card } from '../../../shared/ui/core/Card';

interface TabsHeaderProps {
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onAddNew?: () => void;
  onImportExport?: () => void;
  onEdit?: () => void;
  addButtonText?: string;
  importExportButtonText?: string;
  addButtonIcon?: string;
  className?: string;
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({
  searchPlaceholder = "Tìm kiếm người dùng, kế hoạch...",
  onSearch,
  onAddNew,
  onImportExport,
  onEdit,
  addButtonText = "Thêm bài tập",
  importExportButtonText = "Nhập/ Xuất dữ liệu",
  addButtonIcon = "mdi:plus",
  className = ""
}) => {
  return (
    <Card className={`${className}`} styles={{ body: { padding: 0 } }}>
      <div className="flex items-center gap-4 w-full p-4">
        {/* Add Button */}
        <Button
          variant="secondary"
          size="md"
          onClick={onAddNew}
          className="tabs-header-button flex items-center gap-2 px-4 rounded-lg font-medium whitespace-nowrap"
        >
          <Icon name={addButtonIcon} size={16} color="currentColor" />
          {addButtonText}
        </Button>

        {/* Search Input - takes most space */}
        <div className="flex-1 max-w-6xl tabs-header-input">
          <SearchInput
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Edit Icon Button */}
        <Button
          variant="ghost"
          size="md"
          onClick={onEdit}
          className="tabs-header-icon-button rounded-lg"
        >
          <Icon name="mdi:pencil" size={18} color="currentColor" />
        </Button>
      </div>
    </Card>
  );
};

export default TabsHeader;
