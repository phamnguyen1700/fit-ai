'use client';

import React, { useState } from 'react';
import { CreateFeedbackRequest } from '../api/service';
import { Button } from '@/shared/ui/Button';

interface FeedbackFormProps {
  onSubmit: (data: CreateFeedbackRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateFeedbackRequest>({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5,
    category: 'general',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
        className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
      >
        ⭐
      </button>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập họ và tên"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chủ đề *
        </label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nhập chủ đề phản hồi"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loại phản hồi
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="general">Tổng quát</option>
          <option value="feature">Tính năng mới</option>
          <option value="bug">Báo lỗi</option>
          <option value="complaint">Khiếu nại</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Đánh giá
        </label>
        <div className="flex space-x-1">
          {renderStars(formData.rating)}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {formData.rating === 1 ? 'Rất không hài lòng' :
           formData.rating === 2 ? 'Không hài lòng' :
           formData.rating === 3 ? 'Bình thường' :
           formData.rating === 4 ? 'Hài lòng' : 'Rất hài lòng'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nội dung phản hồi *
        </label>
        <textarea
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Mô tả chi tiết phản hồi của bạn..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
        </Button>
      </div>
    </form>
  );
};
