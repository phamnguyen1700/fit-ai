"use client";
import React from "react";
import Tabs2, { TabItem } from "@/shared/ui/core/Tabs2";
import { Button } from "@/shared/ui/core/Button";
import { Icon, icons } from "@/shared/ui/icon";

const tabItems: TabItem[] = [
  { key: "all", label: "Tất cả kế hoạch" },
  { key: "workout", label: "Kế hoạch tập luyện" },
  { key: "meal", label: "Kế hoạch dinh dưỡng" },
];

interface HeaderProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  onExport?: () => void;
  onCreateNew?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onExport,
  onCreateNew,
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
        <div className="flex items-center gap-2">
          <Button
            className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 font-medium text-sm flex items-center gap-2 rounded-lg transition-all"
            onClick={onCreateNew}
          >
            <Icon name="mdi:plus" size={16} color="currentColor" />
            Tạo kế hoạch mới
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 font-medium text-sm flex items-center gap-2 transition-all duration-200 rounded-lg border border-orange-200 hover:border-orange-300"
            onClick={onExport}
          >
            <Icon name={icons.download} size={16} color="currentColor" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
