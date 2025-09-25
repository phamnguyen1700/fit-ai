"use client";

import React, { useState } from "react";
import { Card } from '@/shared/ui';
import TableImEx from "../TableImEx";
import ArchiveHeader from "../ArchiveHeader";

const ArchiveTab = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleImport = () => {
    console.log('Import data');
    // Add import logic here
  };

  const handleExport = () => {
    console.log('Export data');
    // Add export logic here
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    console.log('Search:', value);
    // Add search filtering logic here
  };
  return (
    <Card className="archive-tab-container">
      <div className="p-6">
        <header className="mb-6">
          <h4 className="text-2xl font-bold text-[var(--text)]">
            Lịch sử Import/Export
          </h4>
        </header>
        <ArchiveHeader
          onImport={handleImport}
          onExport={handleExport}
          onSearch={handleSearch}
          searchValue={searchValue}
          searchPlaceholder="Tìm kiếm gói, tên ứng viên..."
        />
        <TableImEx />
      </div>
    </Card>
  );
};

export default ArchiveTab;
