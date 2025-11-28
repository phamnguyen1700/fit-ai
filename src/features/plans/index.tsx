'use client';

import React, { useState } from 'react';
import Header from './components/header';
import PackageList from './components/tabs/PackageList';
import PriceMana from './components/tabs/PriceMana';
import Transaction from './components/tabs/Transaction';
import AddPackageModal from './components/AddPackageModal';
import { CreateSubscriptionRequest } from '@/types/subscription';
import { useCreateSubscriptionProduct } from '@/tanstack/hooks/subscription';

export const PlanPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("subscription-list");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const createMutation = useCreateSubscriptionProduct();

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const handleAddPackage = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitPackage = (data: CreateSubscriptionRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
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
      
      {/* Add Package Modal */}
      <AddPackageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPackage}
        isLoading={createMutation.isPending}
      />
    </div>
  );
};