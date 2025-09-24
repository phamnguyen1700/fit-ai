"use client";
import React from "react";
import Tabs, { TabItem } from "@/shared/ui/core/Tabs";
import { Button } from "@/shared/ui/core/Button";
import { Icon, icons } from "@/shared/ui/icon";

const tabItems: TabItem[] = [
  { key: "exercise", label: "Quản lý bài tập" },
  { key: "nutrition", label: "Quản lý nội dung dinh dưỡng" },
  { key: "history", label: "Lịch sử Import/Export" },
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
    <div className="flex items-center justify-between w-full mb-4 p-4">
      <Tabs
        items={tabItems}
        value={activeTab}
        onChange={onTabChange}
        className="flex-1"
      />
      <Button
        variant="secondary"
        className="ml-6 px-5 py-2 border-2 border-[var(--primary)] text-[var(--primary)] bg-[var(--primay-extralight)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] font-semibold text-base flex items-center gap-2 transition-all duration-300 rounded-xl"
        onClick={onImportExport}
      >
        <Icon name={icons.upload} size={18} color="currentColor" />
        Nhập/ Xuất dữ liệu
      </Button>
    </div>
  );
};

export default Header;
