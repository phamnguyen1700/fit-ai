"use client";
import React, { useState } from "react";
import Tabs4, { Tab4Item } from "../../../shared/ui/core/Tabs4";

interface HeaderProps {
  onTabChange?: (activeKey: string) => void;
  activeTab?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onTabChange,
  activeTab = "general-info",
  className = "",
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

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="settings-page-title text-2xl font-semibold text-gray-900 dark:text-white">
          Admin Settings
        </h1>
      </div>

      {/* Category Tabs */}
      <div className="space-y-4">
        <Tabs4
          items={settingTabItems}
          defaultActiveKey={activeTab}
          onChange={handleTabChange}
          className="settings-category-tabs"
        />
      </div>
    </div>
  );
};

export default Header;