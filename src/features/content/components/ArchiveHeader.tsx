"use client";
import React from 'react';
import { Button, Input } from '@/shared/ui';
import { Icon } from '@iconify/react';

interface ArchiveHeaderProps {
  onImport?: () => void;
  onExport?: () => void;
  onSearch?: (value: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  className?: string;
}

const ArchiveHeader: React.FC<ArchiveHeaderProps> = ({
  onImport,
  onExport,
  onSearch,
  searchValue,
  searchPlaceholder = "Tìm kiếm gói, tên ứng viên...",
  className = "",
}) => {
  const handleImport = () => {
    console.log('Import clicked');
    onImport?.();
  };

  const handleExport = () => {
    console.log('Export clicked');
    onExport?.();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className={`archive-header ${className}`}>
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left side - Action buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handleImport}
            className="archive-import-button"
          >
            Import dữ liệu
          </Button>
          
          <Button
            variant="primary"
            size="md"
            onClick={handleExport}
            className="archive-export-button"
          >
            Export dữ liệu
          </Button>
        </div>

        {/* Right side - Search */}
        <div className="flex-1 max-w-sm">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            allowClear
            prefix={<Icon icon="ph:magnifying-glass" className="text-gray-400" />}
            className="archive-search-input"
          />
        </div>
      </div>
    </div>
  );
};

export default ArchiveHeader;
