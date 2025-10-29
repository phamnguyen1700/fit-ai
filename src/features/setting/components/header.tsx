"use client";
import React, { useState } from "react";
import Tabs4, { Tab4Item } from "../../../shared/ui/core/Tabs4";
import { Button } from "../../../shared/ui/core/Button";
import { SearchInput } from "../../../shared/ui/layout/admin/components/SearchInput";
import { Icon } from "@iconify/react";

interface HeaderProps {
  onTabChange?: (activeKey: string) => void;
  activeTab?: string;
  className?: string;
  onEditClick?: () => void;
  onAddAdminClick?: () => void;
  onSearchChange?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  onTabChange,
  activeTab = "general-info",
  className = "",
  onEditClick,
  onAddAdminClick,
  onSearchChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(activeTab);

  // Settings category tabs (Thông tin chung, Quản lý tài khoản)
  const settingTabItems: Tab4Item[] = [
    {
      key: "general-info",
      label: "Thông tin chung",
    },
    {
      key: "account-management",
      label: "Quản lý tài khoản",
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveCategory(key);
    onTabChange?.(key);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Title and Action Button */}
      <div className="flex items-center justify-between">
        <h1 className="settings-page-title">
          Admin Settings
        </h1>
        
        {/* Conditional button based on active tab */}
        {activeCategory === "general-info" && (
          <Button
            variant="solid"
            size="md"
            onClick={onEditClick}
            className="settings-header-button flex items-center gap-2"
          >
            <Icon icon="lucide:edit" width={16} height={16} />
            Edit
          </Button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="space-y-4">
        <Tabs4
          items={settingTabItems}
          defaultActiveKey={activeTab}
          onChange={handleTabChange}
          className="settings-category-tabs"
        />
        
        {/* Conditional controls for account management tab */}
        {activeCategory === "account-management" && (
          <div className="flex items-center gap-4">
            <Button
              variant="solid"
              size="md"
              onClick={onAddAdminClick}
              className="settings-header-button flex items-center gap-2"
            >
              <Icon icon="lucide:plus" width={16} height={20} />
              Thêm admin
            </Button>
            
            <div className="flex-1 ">
              <SearchInput
                placeholder="Tìm kiếm người dùng, kế hoạch..."
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;