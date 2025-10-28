'use client';

import React, { useState } from 'react';
import Header from './components/header';
import PackageList from './components/tabs/PackageList';
import PriceMana from './components/tabs/PriceMana';
import Transaction from './components/tabs/Transaction';

export const PlanPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("subscription-list");

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const handleAddPackage = () => {
    console.log("Add new package");
    // TODO: Implement add package functionality
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "subscription-list":
        return <PackageList />;
      case "price-management":
        return <PriceMana />;
      case "payment-history":
        return <Transaction />;
      default:
        return <PackageList />;
    }
  };

  return (
    <div className="plan-page">
      <Header 
        activeTab={activeTab} 
        onCategoryChange={handleTabChange}
        onAddPackage={handleAddPackage}
      />
      <div className="plan-page-content p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};