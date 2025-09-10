'use client';

import React, { useState } from 'react';
// Define types locally since we're using fake data
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // months
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
}

export interface UpdatePlanRequest extends CreatePlanRequest {
  id: string;
}
import { usePlansStore } from '@/stores/plans';
import { useModalStore } from '@/stores/modal.store';
import { useFilterStore } from '@/stores/filter.store';
import { PlanToolbar } from '../components/PlanToolbar';
import { PlanTable } from '../components/PlanTable';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

export const PlanPage: React.FC = () => {
  // Fake data
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: '1',
      name: 'Gói Basic',
      description: 'Gói cơ bản dành cho người mới bắt đầu',
      price: 99000,
      duration: 1,
      features: ['5 bài tập cơ bản', 'Theo dõi cơ bản', 'Hỗ trợ email'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Gói Pro',
      description: 'Gói chuyên nghiệp với đầy đủ tính năng',
      price: 199000,
      duration: 1,
      features: ['Không giới hạn bài tập', 'AI tư vấn cá nhân', 'Phân tích chi tiết', 'Hỗ trợ 24/7'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'Gói Premium',
      description: 'Gói cao cấp với huấn luyện viên cá nhân',
      price: 399000,
      duration: 1,
      features: ['Tất cả tính năng Pro', 'Huấn luyện viên cá nhân', 'Chế độ dinh dưỡng VIP', 'Ưu tiên hỗ trợ'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Plans data
  const plansStore = usePlansStore();
  const selectedPlan = plansStore.selectedPlan;
  
  // Modal states
  const modalStore = useModalStore();
  const isCreateModalOpen = modalStore.type === 'create-plan';
  const isEditModalOpen = modalStore.type === 'edit-plan';
  const isDeleteModalOpen = modalStore.type === 'delete-plan';
  
  // Actions
  const openCreateModal = () => modalStore.openModal('create-plan');
  const openEditModal = (plan: any) => modalStore.openModal('edit-plan', plan);
  const openDeleteModal = (plan: any) => modalStore.openModal('delete-plan', plan);
  const closeModal = () => modalStore.closeModal();

  const [formData, setFormData] = useState<CreatePlanRequest>({
    name: '',
    description: '',
    price: 0,
    duration: 1,
    features: [],
  });

  const [newFeature, setNewFeature] = useState('');

  const handleCreatePlan = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPlan: Plan = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setPlans(prev => [newPlan, ...prev]);
      closeModal();
      resetForm();
    } catch (error) {
      console.error('Failed to create plan:', error);
    }
  };

  const handleUpdatePlan = async () => {
    if (!selectedPlan) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedPlan: Plan = {
        ...selectedPlan,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      
      setPlans(prev => prev.map(plan => 
        plan.id === selectedPlan.id ? updatedPlan : plan
      ));
      closeModal();
      resetForm();
    } catch (error) {
      console.error('Failed to update plan:', error);
    }
  };

  const handleDeletePlan = async () => {
    if (!selectedPlan) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPlans(prev => prev.filter(plan => plan.id !== selectedPlan.id));
      closeModal();
    } catch (error) {
      console.error('Failed to delete plan:', error);
    }
  };

  const handleToggleStatus = async (plan: Plan) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPlan: Plan = {
        ...plan,
        isActive: !plan.isActive,
        updatedAt: new Date().toISOString(),
      };
      
      setPlans(prev => prev.map(p => 
        p.id === plan.id ? updatedPlan : p
      ));
    } catch (error) {
      console.error('Failed to toggle plan status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 1,
      features: [],
    });
    setNewFeature('');
  };

  const openEditModalWithData = (plan: Plan) => {
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      features: [...plan.features],
    });
    openEditModal(plan);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý gói tập</h1>
              <p className="text-gray-600 mt-1">Quản lý các gói tập luyện và dịch vụ</p>
            </div>
          </div>

          <PlanToolbar />

          <PlanTable
            plans={plans}
            onEdit={openEditModalWithData}
            onDelete={openDeleteModal}
            onToggleStatus={handleToggleStatus}
          />

          {/* Create/Edit Modal */}
          <Modal
            isOpen={isCreateModalOpen || isEditModalOpen}
            onClose={closeModal}
            title={isCreateModalOpen ? 'Thêm gói tập mới' : 'Chỉnh sửa gói tập'}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên gói tập
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên gói tập"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Nhập mô tả gói tập"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời hạn (tháng)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tính năng
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tính năng"
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <Button onClick={addFeature} size="sm">
                    Thêm
                  </Button>
                </div>
                <div className="space-y-1">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span className="text-sm">{feature}</span>
                      <button
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="secondary"
                  onClick={closeModal}
                >
                  Hủy
                </Button>
                <Button
                  onClick={isCreateModalOpen ? handleCreatePlan : handleUpdatePlan}
                >
                  {isCreateModalOpen ? 'Tạo gói tập' : 'Cập nhật'}
                </Button>
              </div>
            </div>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={closeModal}
            title="Xác nhận xóa gói tập"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa gói tập <strong>{selectedPlan?.name}</strong>? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={closeModal}>
                  Hủy
                </Button>
                <Button variant="danger" onClick={handleDeletePlan}>
                  Xóa
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};
