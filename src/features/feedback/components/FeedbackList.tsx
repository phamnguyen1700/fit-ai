'use client';

import React from 'react';
import { Feedback } from '../api/service';
import { formatDate } from '@/shared/lib';
import { useFeedbackUiStore } from '../store/feedbackUi.store';

interface FeedbackListProps {
  feedbacks: Feedback[];
  onView: (feedback: Feedback) => void;
  onDelete: (feedback: Feedback) => void;
}

export const FeedbackList: React.FC<FeedbackListProps> = ({
  feedbacks,
  onView,
  onDelete,
}) => {
  const { searchTerm, sortBy, sortOrder, filterCategory, filterStatus } = useFeedbackUiStore();

  // Filter and sort feedbacks
  const filteredFeedbacks = feedbacks
    .filter(feedback => {
      const matchesSearch = feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           feedback.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || feedback.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || feedback.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general':
        return 'bg-gray-100 text-gray-800';
      case 'feature':
        return 'bg-blue-100 text-blue-800';
      case 'bug':
        return 'bg-red-100 text-red-800';
      case 'complaint':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  if (filteredFeedbacks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-lg font-medium text-gray-900 mb-2">Không có phản hồi nào</p>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm để xem kết quả khác.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredFeedbacks.map((feedback) => (
        <div key={feedback.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feedback.subject}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{feedback.name}</span>
                <span>•</span>
                <span>{formatDate(feedback.createdAt)}</span>
                <span>•</span>
                <div className="flex items-center">
                  {renderStars(feedback.rating)}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(feedback.category)}`}>
                {getCategoryLabel(feedback.category)}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                {getStatusLabel(feedback.status)}
              </span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4 line-clamp-3">
            {feedback.message}
          </p>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onView(feedback)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            >
              Xem chi tiết
            </button>
            <button
              onClick={() => onDelete(feedback)}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            >
              Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
