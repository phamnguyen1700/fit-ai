"use client";
import React from "react";
import Tabs2, { TabItem } from "@/shared/ui/core/Tabs2";

const tabItems: TabItem[] = [
  { key: "exercise", label: "Quản lý bài tập" },
  { key: "history", label: "Quản lý danh mục" },
];

interface HeaderProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  onImportExport?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <Tabs2
          items={tabItems}
          value={activeTab}
          onChange={onTabChange}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default Header;
