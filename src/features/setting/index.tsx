"use client";
import React, { useState } from 'react';
import Header from './components/header';

interface SettingProps {
  className?: string;
}

export const SettingPage: React.FC<SettingProps> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState<string>("general-info");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className={`setting-container w-full ${className}`}>
      <Header 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      {/* Content based on active tab */}
      <div className="mt-6">
        {activeTab === "general-info" && (
          <div className="general-info-content">
            <h2 className="text-lg font-medium mb-4">Thông tin chung</h2>
            {/* Add your general info content here */}
            <p className="text-gray-600 dark:text-gray-400">Nội dung thông tin chung sẽ được hiển thị ở đây.</p>
          </div>
        )}
        
        {activeTab === "account-management" && (
          <div className="account-management-content">
            <h2 className="text-lg font-medium mb-4">Quản lý tài khoản</h2>
            {/* Add your account management content here */}
            <p className="text-gray-600 dark:text-gray-400">Nội dung quản lý tài khoản sẽ được hiển thị ở đây.</p>
          </div>
        )}
      </div>
    </div>
  );
};

