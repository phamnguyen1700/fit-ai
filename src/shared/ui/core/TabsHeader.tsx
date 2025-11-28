"use client";
import React from 'react';
import { Button } from './Button';
import { SearchInput } from '../layout/admin/components/SearchInput';
import { Icon, icons } from '../icon';

interface TabsHeaderProps {
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onAddNew?: () => void;
  onImportExport?: () => void;
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
  addButtonText = "Thêm bài tập",
  importExportButtonText = "Nhập/ Xuất dữ liệu",
  addButtonIcon = "mdi:plus",
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-between w-full gap-4 p-4 bg-[var(--bg)] border-b border-[var(--border)] ${className}`}>
      {/* Add Button */}
      <Button
        variant="primary"
        size="md"
        onClick={onAddNew}
        className="flex items-center gap-2 px-6 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white border-[var(--primary)] hover:border-[var(--primary-dark)] rounded-xl font-semibold transition-all duration-300"
      >
        <Icon name={addButtonIcon} size={18} color="currentColor" />
        {addButtonText}
      </Button>

      {/* Search Input */}
      <div className="flex-1 max-w-md mx-4">
        <SearchInput
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full"
        />
      </div>
      
      {/* Import/Export Button */}
      <Button
        variant="secondary"
        size="md"
        onClick={onImportExport}
        className="flex items-center gap-2 px-5 py-2 border-2 border-[var(--primary)] text-[var(--primary)] bg-[var(--primay-extralight)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] font-semibold rounded-xl transition-all duration-300"
      >
        <Icon name={icons.upload} size={18} color="currentColor" />
        {importExportButtonText}
      </Button>
    </div>
  );
};

export default TabsHeader;
