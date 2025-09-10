'use client';

import React, { useState } from 'react';
// Define types locally since we're using fake data
export interface Feedback {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
  category: 'general' | 'feature' | 'bug' | 'complaint';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
  category: 'general' | 'feature' | 'bug' | 'complaint';
}
import { useFeedbackStore } from '@/stores/feedback';
import { useModalStore } from '@/stores/modal.store';
import { useFilterStore } from '@/stores/filter.store';
import { FeedbackToolbar } from '../components/FeedbackToolbar';
import { FeedbackList } from '../components/FeedbackList';
import { FeedbackForm } from '../components/FeedbackForm';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

// Fake data
const fakeFeedbacks: Feedback[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    subject: 'Ứng dụng rất tốt',
    message: 'Tôi đã sử dụng Fit AI được 3 tháng và thấy rất hiệu quả. Giao diện đẹp, tính năng đầy đủ.',
    rating: 5,
    category: 'general',
    status: 'resolved',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    subject: 'Yêu cầu tính năng mới',
    message: 'Tôi muốn có thêm tính năng theo dõi giấc ngủ và nhắc nhở uống nước.',
    rating: 4,
    category: 'feature',
    status: 'in_progress',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    subject: 'Báo lỗi đồng bộ',
    message: 'Dữ liệu không đồng bộ giữa điện thoại và web app. Cần khắc phục sớm.',
    rating: 3,
    category: 'bug',
    status: 'pending',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    email: 'phamthid@email.com',
    subject: 'Khiếu nại về giá',
    message: 'Giá gói Premium hơi cao so với các ứng dụng khác. Mong được giảm giá.',
    rating: 2,
    category: 'complaint',
    status: 'closed',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
  },
];

export const FeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(fakeFeedbacks);

  // Feedback data
  const feedbackStore = useFeedbackStore();
  const selectedFeedback = feedbackStore.selectedFeedback;
  
  // Modal states
  const modalStore = useModalStore();
  const isCreateModalOpen = modalStore.type === 'create-feedback';
  const isViewModalOpen = modalStore.type === 'view-feedback';
  const isDeleteModalOpen = modalStore.type === 'delete-feedback';
  
  // Actions
  const openCreateModal = () => modalStore.openModal('create-feedback');
  const openViewModal = (feedback: any) => modalStore.openModal('view-feedback', feedback);
  const openDeleteModal = (feedback: any) => modalStore.openModal('delete-feedback', feedback);
  const closeModal = () => modalStore.closeModal();

  const [submitting, setSubmitting] = useState(false);

  const handleCreateFeedback = async (data: CreateFeedbackRequest) => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFeedback: Feedback = {
        id: Date.now().toString(),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setFeedbacks(prev => [newFeedback, ...prev]);
      closeModal();
      alert('Cảm ơn bạn đã gửi phản hồi! Chúng tôi sẽ xem xét và phản hồi sớm nhất.');
    } catch (error) {
      console.error('Failed to create feedback:', error);
      alert('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFeedback = async () => {
    if (!selectedFeedback) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setFeedbacks(prev => prev.filter(feedback => feedback.id !== selectedFeedback.id));
      closeModal();
    } catch (error) {
      console.error('Failed to delete feedback:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'general':
        return 'Tổng quát';
      case 'feature':
        return 'Tính năng';
      case 'bug':
        return 'Báo lỗi';
      case 'complaint':
        return 'Khiếu nại';
      default:
        return category;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'in_progress':
        return 'Đang xử lý';
      case 'resolved':
        return 'Đã giải quyết';
      case 'closed':
        return 'Đã đóng';
      default:
        return status;
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Phản hồi từ người dùng</h1>
              <p className="text-gray-600 mt-1">Quản lý và xem xét phản hồi từ cộng đồng</p>
            </div>
          </div>

          <FeedbackToolbar />

          <FeedbackList
            feedbacks={feedbacks}
            onView={openViewModal}
            onDelete={openDeleteModal}
          />

          {/* Create Feedback Modal */}
          <Modal
            isOpen={isCreateModalOpen}
            onClose={closeCreateModal}
            title="Gửi phản hồi"
          >
            <FeedbackForm
              onSubmit={handleCreateFeedback}
              onCancel={closeCreateModal}
              loading={submitting}
            />
          </Modal>

          {/* View Feedback Modal */}
          <Modal
            isOpen={isViewModalOpen}
            onClose={closeViewModal}
            title="Chi tiết phản hồi"
          >
            {selectedFeedback && (
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedFeedback.subject}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{selectedFeedback.name}</span>
                    <span>•</span>
                    <span>{selectedFeedback.email}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      {renderStars(selectedFeedback.rating)}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mb-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {getCategoryLabel(selectedFeedback.category)}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {getStatusLabel(selectedFeedback.status)}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Nội dung:</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedFeedback.message}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="secondary" onClick={closeViewModal}>
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            title="Xác nhận xóa phản hồi"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa phản hồi <strong>{selectedFeedback?.subject}</strong>? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={closeDeleteModal}>
                  Hủy
                </Button>
                <Button variant="danger" onClick={handleDeleteFeedback}>
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
