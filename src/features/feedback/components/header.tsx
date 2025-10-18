"use client";
import React, { useState } from 'react';
import Tabs3, { Tab3Item } from '../../../shared/ui/core/Tabs3';
import Tabs4, { Tab4Item } from '../../../shared/ui/core/Tabs4';
import { SearchInput } from '../../../shared/ui/layout/admin/components/SearchInput';

interface HeaderProps {
  onDateRangeChange?: (activeKey: string) => void;
  onCategoryChange?: (activeKey: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onDateRangeChange,
  onCategoryChange,
  onSearch,
  className = ""
}) => {
  const [activeDateRange, setActiveDateRange] = useState<string>("day");
  const [activeCategory, setActiveCategory] = useState<string>("feedback-list");

  // Date range tabs (Ngày, Tháng, Năm)
  const dateRangeTabs: Tab3Item[] = [
    { key: "day", label: "Ngày" },
    { key: "month", label: "Tháng" },
    { key: "year", label: "Năm" }
  ];

  // Category tabs (Danh sách phản hồi, Duyệt phản hồi, Phản hồi công khai)
  const categoryTabItems: Tab4Item[] = [
    {
      key: "feedback-list",
      label: "Danh sách phản hồi",
    },
    {
      key: "review-feedback", 
      label: "Duyệt phản hồi",
    },
    {
      key: "public-feedback",
      label: "Phản hồi công khai",
    }
  ];

  const handleDateRangeChange = (key: string) => {
    setActiveDateRange(key);
    onDateRangeChange?.(key);
  };

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    onCategoryChange?.(key);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Title and Date Range Tabs */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý phản hồi</h1>
        
        {/* Date Range Tabs */}
        <Tabs3
          items={dateRangeTabs}
          defaultActiveKey="day"
          onChange={handleDateRangeChange}
          className="ml-auto"
        />
      </div>

      {/* Category Tabs */}
      <div className="space-y-4">
        <Tabs4
          items={categoryTabItems}
          defaultActiveKey="feedback-list"
          onChange={handleCategoryChange}
          className="feedback-category-tabs"
        />

        {/* Search Input */}
        <div className="w-full">
          <SearchInput
            placeholder="Tìm kiếm người dùng, kế hoạch..."
            onChange={handleSearch}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;