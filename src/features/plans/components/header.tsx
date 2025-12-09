"use client";
import React, { useState } from "react";
import Tabs4, { Tab4Item } from "../../../shared/ui/core/Tabs4";
import { Segmented } from "../../../shared/ui/core/Segmented";
import { SearchInput } from "../../../shared/ui/layout/admin/components/SearchInput";
import Filter from "@/shared/ui/core/Filter";
import { FilterConfig } from "@/shared/ui/core/Filter";
import { Button } from "@/shared/ui/core/Button";

interface HeaderProps {
  onDateRangeChange?: (activeKey: string) => void;
  onCategoryChange?: (activeKey: string) => void;
  onSearch?: (value: string) => void;
  onAddPackage?: () => void;
  activeTab?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onDateRangeChange,
  onCategoryChange,
  onSearch,
  onAddPackage,
  activeTab = "subscription-list",
  className = "",
}) => {
  const [activeDateRange, setActiveDateRange] = useState<string>("day");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    packageType: '',
    status: '',
    period: ''
  });

  // Date range options for Segmented (Ngày, Tháng, Năm)
  const dateRangeOptions = [
    { label: "Ngày", value: "day" },
    { label: "Tháng", value: "month" },
    { label: "Năm", value: "year" },
  ];

  // Category tabs (Danh sách gói đăng ký, Quản lý Giá, Lịch sử Thanh toán)
  const categoryTabItems: Tab4Item[] = [
    {
      key: "subscription-list",
      label: "Danh sách gói đăng ký",
    },
    {
      key: "price-management", 
      label: "Quản lý voucher",
    },
  ];

  // Filter configuration for plans page
  const plansFilters: FilterConfig[] = [
    {
      key: "packageType",
      placeholder: "Loại gói",
      options: [
        { value: "", label: "Tất cả loại gói" },
        { value: "basic", label: "Gói Cơ bản" },
        { value: "premium", label: "Gói Premium" },
        { value: "professional", label: "Gói Chuyên nghiệp" },
        { value: "enterprise", label: "Gói Doanh nghiệp" },
      ],
      className: "min-w-[150px]"
    },
    {
      key: "status",
      placeholder: "Trạng thái",
      options: [
        { value: "", label: "Tất cả trạng thái" },
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Không hoạt động" },
        { value: "expired", label: "Hết hạn" },
        { value: "pending", label: "Chờ xử lý" },
        { value: "cancelled", label: "Đã hủy" },
      ],
      className: "min-w-[150px]"
    },
    {
      key: "period",
      placeholder: "Thời hạn",
      options: [
        { value: "", label: "Tất cả thời hạn" },
        { value: "monthly", label: "Hàng tháng" },
        { value: "quarterly", label: "Hàng quý" },
        { value: "yearly", label: "Hàng năm" },
        { value: "lifetime", label: "Trọn đời" },
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
    <div className={`header-container w-full space-y-6 ${className}`}>
      {/* Title and Date Range Tabs */}
      <div className="flex items-center justify-between">
        <h1 className="plans-page-title">
          Quản lý gói đăng ký
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
          className="plans-category-tabs"
        />

        {/* Search and Filter section */}
        <div className="flex items-center gap-4">
          {/* Add Package Button */}
          <Button
            variant="primary"
            onClick={onAddPackage}
            className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600"
          >
            + Thêm gói
          </Button>

          {/* Search Input */}
          <div className="search-container">
            <SearchInput
              placeholder="Tìm kiếm người dùng, kế hoạch..."
              onChange={handleSearch}
              className="w-full"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="filter-wrapper">
            <Filter
              filters={plansFilters}
              onFilterChange={handleFilterChange}
              initialValues={filterValues}
              showResetButton={true}
              resetButtonTitle="Xóa bộ lọc"
              className="flex-shrink-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;