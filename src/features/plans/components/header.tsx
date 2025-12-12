"use client";
import React from "react";
import Tabs4, { Tab4Item } from "../../../shared/ui/core/Tabs4";
import { SearchInput } from "../../../shared/ui/layout/admin/components/SearchInput";
import { Button } from "@/shared/ui/core/Button";

interface HeaderProps {
  onCategoryChange?: (activeKey: string) => void;
  onSearch?: (value: string) => void;
  onAddPackage?: () => void;
  activeTab?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onCategoryChange,
  onSearch,
  onAddPackage,
  activeTab = "subscription-list",
  className = "",
}) => {

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

  const handleCategoryChange = (key: string) => {
    onCategoryChange?.(key);
  };

  return (
    <div className={`header-container w-full space-y-6 ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="plans-page-title">
          Quản lý gói đăng ký
        </h1>
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
          <div className="search-container flex-1">
            <SearchInput
              placeholder={activeTab === "price-management" ? "Tìm kiếm voucher..." : "Tìm kiếm gói đăng ký..."}
              onChange={(e) => {
                const value = typeof e === 'string' ? e : e.target.value;
                onSearch?.(value);
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;