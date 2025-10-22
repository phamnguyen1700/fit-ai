"use client";
import React from "react";
import Tabs2, { TabItem } from "@/shared/ui/core/Tabs2";
import { Button } from "@/shared/ui/core/Button";
import { Icon, icons } from "@/shared/ui/icon";

const tabItems: TabItem[] = [
  { key: "exercise", label: "Quản lý bài tập" },
  { key: "nutrition", label: "Quản lý nội dung dinh dưỡng" },
  { key: "history", label: "Kho lưu trữ" },
];

interface HeaderProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  onImportExport?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onImportExport,
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
        <Button
          variant="ghost"
          className="ml-8 px-4 py-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 font-medium text-sm flex items-center gap-2 transition-all duration-200 rounded-lg border border-orange-200 hover:border-orange-300 "
          onClick={onImportExport}
        >
          <Icon name={icons.upload} size={16} color="currentColor" />
          Nhập/ Xuất dữ liệu
        </Button>
      </div>
    </div>
  );
};

export default Header;
