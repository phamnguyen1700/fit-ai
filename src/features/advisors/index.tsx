'use client';

import React, { useState } from 'react';
import { AdvisorTable } from './components/AdvisorTable';
import { Card } from '@/shared/ui/core/Card';
import AddAdvisorModal from './components/AddAdvisorModal';
import { useCreateAdvisor } from '@/tanstack/hooks/advisor';
import { CreateAdvisorRequest } from '@/types/advisor';

export const AdvisorPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const createAdvisor = useCreateAdvisor();

  const handleAddAdvisor = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitAdvisor = (data: CreateAdvisorRequest) => {
    createAdvisor.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  return (
    <>
      <Card 
        title={<span className="text text-base sm:text-lg font-semibold">Danh sách Advisor</span>}
      >
        <AdvisorTable onAdd={handleAddAdvisor} />
      </Card>

      {/* Add Advisor Modal */}
      <AddAdvisorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAdvisor}
        isLoading={createAdvisor.isPending}
      />
    </>
  );
};
