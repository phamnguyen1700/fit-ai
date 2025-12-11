"use client";
import React from "react";
import { Button } from "../../../shared/ui/core/Button";
import { Icon } from "@iconify/react";

interface HeaderProps {
  className?: string;
  onEditClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  className = "",
  onEditClick,
}) => {

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Title and Action Button */}
      <div className="flex items-center justify-between">
        <h1 className="settings-page-title">
          Cài đặt
        </h1>
        
        <Button
          variant="solid"
          size="md"
          onClick={onEditClick}
          className="settings-header-button flex items-center gap-2"
        >
          <Icon icon="lucide:edit" width={16} height={16} />
          Edit
        </Button>
      </div>
    </div>
  );
};

export default Header;