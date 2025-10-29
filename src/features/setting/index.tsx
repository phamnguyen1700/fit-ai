"use client";
import React, { useState } from 'react';
import Header from './components/header';
import AdminCard from './components/AdminCard';
import AdminMana from './components/AdminMana';

interface SettingProps {
  className?: string;
}

export const SettingPage: React.FC<SettingProps> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState<string>("general-info");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleEditClick = () => {
    console.log("Edit button clicked");
    // Add your edit functionality here
  };

  const handleAddAdminClick = () => {
    console.log("Add admin button clicked");
    // Add your add admin functionality here
  };

  const handleSearchChange = (value: string) => {
    console.log("Search value:", value);
    // Add your search functionality here
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="setting-container">
        <Header 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onEditClick={handleEditClick}
          onAddAdminClick={handleAddAdminClick}
          onSearchChange={handleSearchChange}
        />
        
        {/* Content based on active tab */}
        <div className="mt-6">
          {activeTab === "general-info" && (
            <div className="general-info-content">
              <AdminCard 
                systemName="whitehacker"
                email="bill.sanders@example.com"
                contact="0987654321"
                address="12 Nguyen Sieu, Ben Nghe, District 1"
              />
            </div>
          )}
          
          {activeTab === "account-management" && (
            <div className="account-management-content">
              <AdminMana />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

