'use client';

import React from 'react';
import { Card, Button } from '@/shared/ui';
import { Icon, icons } from '@/shared/ui/icon';

interface FeedbackItem {
  id: string;
  clientId: string;
  clientName: string;
  uploadTime: string;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnail: string;
  category: 'workout' | 'meal' | 'progress';
  status: 'pending' | 'reviewed';
  note?: string;
}

interface FeedbackModalProps {
  item: FeedbackItem;
  onClose: () => void;
}

export default function FeedbackModal({ item, onClose }: FeedbackModalProps) {
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');

  const handleSubmit = () => {
    // API call to submit feedback
    console.log('Feedback submitted:', { rating, comment });
    alert('Đánh giá đã được gửi thành công!');
    onClose();
  };

  const quickComments = [
    '✅ Tuyệt vời! Giữ vững phong độ',
    '👍 Tốt, nhưng cần chú ý tư thế',
    '💪 Hãy tăng cường độ tập luyện',
    '🍽️ Cần điều chỉnh khẩu phần ăn',
    '⚠️ Form chưa chuẩn, cẩn thận chấn thương',
    '📈 Tiến độ rất tốt, tiếp tục phát huy',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Đánh giá từ {item.clientName}</h2>
              <p className="text-sm text-gray-500">{item.uploadTime}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name="mdi:close" size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Media Display */}
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                {item.type === 'image' ? (
                  <img
                    src={item.mediaUrl}
                    alt={item.note}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="aspect-video bg-gray-900 flex items-center justify-center">
                    <Icon name="mdi:play-circle-outline" size={64} className="text-white" />
                  </div>
                )}
              </div>
              {item.note && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Ghi chú từ khách hàng:</p>
                  <p className="text-gray-600 mt-1">{item.note}</p>
                </div>
              )}
            </div>

            {/* Feedback Form */}
            <div>
              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Đánh giá</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-4xl transition-transform hover:scale-110"
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Comments */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Nhận xét nhanh</label>
                <div className="flex flex-wrap gap-2">
                  {quickComments.map((qc, index) => (
                    <button
                      key={index}
                      onClick={() => setComment(qc)}
                      className="px-3 py-2 bg-gray-100 hover:bg-primary hover:text-white rounded-lg text-sm transition-colors"
                    >
                      {qc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Nhận xét chi tiết</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập nhận xét của bạn..."
                  className="w-full h-32 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!rating || !comment}
                  className="flex-1"
                >
                  <Icon name="mdi:check" className="mr-2" />
                  Gửi đánh giá
                </Button>
                <Button variant="secondary" onClick={onClose}>
                  Hủy
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-semibold mb-2">Hành động nhanh</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Icon name={icons.message} className="mr-1" />
                    Nhắn tin
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Icon name={icons.phone} className="mr-1" />
                    Gọi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
