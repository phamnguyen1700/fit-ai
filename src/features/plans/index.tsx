'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/header';
import PackageList from './components/tabs/PackageList';
import VoucherManagement from './components/tabs/VoucherManagement';
import AddPackageModal from './components/AddPackageModal';
import { CreateSubscriptionRequest } from '@/types/subscription';
import { useCreateSubscriptionProduct } from '@/tanstack/hooks/subscription';

export const PlanPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("subscription-list");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const createMutation = useCreateSubscriptionProduct();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
        return <PackageList searchQuery={debouncedSearch} />;
      case "price-management":
        return <VoucherManagement />;
      default:
        return <PackageList searchQuery={debouncedSearch} />;
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="plan-page">
      <Header 
        activeTab={activeTab} 
        onCategoryChange={handleTabChange}
        onAddPackage={handleAddPackage}
        onSearch={handleSearch}
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