'use client';

import React, { useState } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Button } from '@/shared/ui/core/Button';
import { Icon } from '@/shared/ui/icon';
import { PolicyTable } from './components/PolicyTable';
import { CreatePolicyModal } from './components/CreatePolicyModal';
import { EditPolicyModal } from './components/EditPolicyModal';
import { App } from 'antd';
import type { Policy } from '@/types/policy';
import { useCreatePolicy, useUpdatePolicy, useDeletePolicy } from '@/tanstack/hooks/policy';
import type { CreatePolicyRequest, UpdatePolicyRequest } from '@/types/policy';

export const PolicyManagementPage: React.FC = () => {
  const { modal } = App.useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const createPolicy = useCreatePolicy();
  const updatePolicy = useUpdatePolicy();
  const deletePolicy = useDeletePolicy();

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSubmitCreate = (data: CreatePolicyRequest) => {
    createPolicy.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
  };

  const handleEdit = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPolicy(null);
  };

  const handleSubmitEdit = (data: UpdatePolicyRequest) => {
    if (selectedPolicy) {
      updatePolicy.mutate(
        { id: selectedPolicy.id, data },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            setSelectedPolicy(null);
          },
        }
      );
    }
  };

  const handleDelete = (policy: Policy) => {
    modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa policy "${policy.title}"? Hành động này không thể hoàn tác.`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: {
        danger: true,
        style: {
          backgroundColor: 'var(--error)',
          borderColor: 'var(--error)',
          color: 'white',
        },
      },
      onOk: () => {
        return new Promise<void>((resolve, reject) => {
          deletePolicy.mutate(policy.id, {
            onSuccess: () => {
              resolve();
            },
            onError: () => {
              reject();
            },
          });
        });
      },
      centered: true,
    });
  };

  return (
    <div className="policy-management-page w-full">
      <Card
        className="policy-card"
        title={
          <div className="flex items-center justify-between w-full py-2">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] m-0">
                Quản lý Policy
              </h1>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleCreate}
              className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <Icon name="mdi:plus-circle-outline" size={18} />
              <span>Tạo Policy</span>
            </Button>
          </div>
        }
      >
        <div className="mt-8">
          <PolicyTable
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Card>

      {/* Create Policy Modal */}
      <CreatePolicyModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleSubmitCreate}
        isLoading={createPolicy.isPending}
      />

      {/* Edit Policy Modal */}
      <EditPolicyModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleSubmitEdit}
        policy={selectedPolicy}
        isLoading={updatePolicy.isPending}
      />
    </div>
  );
};

