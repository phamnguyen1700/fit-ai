"use client";
import React, { useState } from "react";
import Tabs4, { Tab4Item } from "../../../shared/ui/core/Tabs4";
import { Segmented } from "../../../shared/ui/core/Segmented";
import { SearchInput } from "../../../shared/ui/layout/admin/components/SearchInput";
import Filter from "@/shared/ui/core/Filter";
import { FilterConfig } from "@/shared/ui/core/Filter";


interface HeaderProps {
  onDateRangeChange?: (activeKey: string) => void;
  onCategoryChange?: (activeKey: string) => void;
  onSearch?: (value: string) => void;
  activeTab?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onDateRangeChange,
  onCategoryChange,
  onSearch,
  activeTab = "feedback-list",
  className = "",
}) => {
  const [activeDateRange, setActiveDateRange] = useState<string>("day");
  const [activeCategory, setActiveCategory] = useState<string>(activeTab);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: '',
    date: '',
    rating: ''
  });

  // Date range options for Segmented (Ngày, Tháng, Năm)
  const dateRangeOptions = [
    { label: "Ngày", value: "day" },
    { label: "Tháng", value: "month" },
    { label: "Năm", value: "year" },
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
    },
  ];

  // Filter configuration for feedback page
  const feedbackFilters: FilterConfig[] = [
    {
      key: "status",
      placeholder: "Trạng thái phản hồi",
      options: [
        { value: "", label: "Tất cả trạng thái" },
        { value: "pending", label: "Chưa duyệt" },
        { value: "approved", label: "Đã duyệt" },
        { value: "rejected", label: "Từ chối" },
        { value: "published", label: "Công khai" },
      ],
      className: "min-w-[180px]"
    },
    {
      key: "date",
      placeholder: "Lọc theo ngày",
      options: [
        { value: "", label: "Tất cả thời gian" },
        { value: "today", label: "Hôm nay" },
        { value: "yesterday", label: "Hôm qua" },
        { value: "last7days", label: "7 ngày qua" },
        { value: "last30days", label: "30 ngày qua" },
        { value: "thismonth", label: "Tháng này" },
        { value: "lastmonth", label: "Tháng trước" },
      ],
      className: "min-w-[150px]"
    },
    {
      key: "rating",
      placeholder: "Lọc theo rating",
      options: [
        { value: "", label: "Tất cả rating" },
        { value: "5", label: "5 sao" },
        { value: "4", label: "4 sao trở lên" },
        { value: "3", label: "3 sao trở lên" },
        { value: "2", label: "2 sao trở lên" },
        { value: "1", label: "1 sao trở lên" },
      ],
      className: "min-w-[150px]"
    }
  ];

  const handleDateRangeChange = (value: string | number) => {
    const key = String(value);
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

  const handleFilterChange = (filters: Record<string, string>) => {
    setFilterValues(filters);
    // You can add additional logic here to handle filter changes
    console.log('Filters changed:', filters);
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Title and Date Range Tabs */}
      <div className="flex items-center justify-between">
        <h1 className="feedback-page-title">
          Quản lý phản hồi
        </h1>
        {/* Date Range Tabs */}
        <Segmented
          options={dateRangeOptions}
          value={activeDateRange}
          onChange={handleDateRangeChange}
          className="ml-auto"
        />
      </div>

      {/* Category Tabs */}
      <div className="space-y-4">
        <Tabs4
          items={categoryTabItems}
          defaultActiveKey={activeTab}
          onChange={handleCategoryChange}
          className="feedback-category-tabs"
        />

        {/* Conditional Layout based on active tab */}
        {activeCategory === "feedback-list" ? (
          /* Layout for "Duyệt phản hồi" - Simple search only */
          <div className="w-full">
            <SearchInput
              placeholder="Tìm kiếm người dùng, kế hoạch..."
              onChange={handleSearch}
              className="w-full"
            />
          </div>
        ) : (
          /* Layout for other tabs - Search + Filter dropdowns */
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Tìm kiếm người dùng, kế hoạch..."
                onChange={handleSearch}
                className="w-full"
              />
            </div>

            {/* Filter Dropdowns */}
            <Filter
              filters={feedbackFilters}
              onFilterChange={handleFilterChange}
              initialValues={filterValues}
              showResetButton={true}
              resetButtonTitle="Xóa bộ lọc"
              className="flex-shrink-0"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
