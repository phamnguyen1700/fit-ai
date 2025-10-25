"use client";
import React, { useState } from "react";
import Tabs3, { Tab3Item } from "../../../shared/ui/core/Tabs3";
import Tabs4, { Tab4Item } from "../../../shared/ui/core/Tabs4";
import { Segmented } from "../../../shared/ui/core/Segmented";
import { SearchInput } from "../../../shared/ui/layout/admin/components/SearchInput";
import { Select } from "../../../shared/ui/core/Select";

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
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [dateFilter, setDateFilter] = useState<string | undefined>(undefined);
  const [ratingFilter, setRatingFilter] = useState<string | undefined>(
    undefined
  );

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

  const handleResetFilters = () => {
    setStatusFilter(undefined);
    setDateFilter(undefined);
    setRatingFilter(undefined);
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
            <div className="flex items-center gap-3">
              <Select
                placeholder="Trạng thái phản hồi"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 160, height: 44 }}
                size="large"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "pending", label: "Chưa duyệt" },
                  { value: "approved", label: "Đã duyệt" },
                  { value: "rejected", label: "Từ chối" },
                  { value: "published", label: "Công khai" },
                ]}
                allowClear
              />

              <Select
                placeholder="Lọc theo ngày"
                value={dateFilter}
                onChange={setDateFilter}
                style={{ width: 140, height: 44 }}
                size="large"
                options={[
                  { value: "today", label: "Hôm nay" },
                  { value: "yesterday", label: "Hôm qua" },
                  { value: "last7days", label: "7 ngày qua" },
                  { value: "last30days", label: "30 ngày qua" },
                  { value: "thismonth", label: "Tháng này" },
                  { value: "lastmonth", label: "Tháng trước" },
                ]}
                allowClear
              />

              <Select
                placeholder="Lọc theo rating"
                value={ratingFilter}
                onChange={setRatingFilter}
                style={{ width: 140, height: 44 }}
                size="large"
                options={[
                  { value: "5", label: "5 sao" },
                  { value: "4", label: "4 sao trở lên" },
                  { value: "3", label: "3 sao trở lên" },
                  { value: "2", label: "2 sao trở lên" },
                  { value: "1", label: "1 sao trở lên" },
                ]}
                allowClear
              />

              {/* Refresh/Reset button */}
              <button
                onClick={handleResetFilters}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Xóa tất cả bộ lọc"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
