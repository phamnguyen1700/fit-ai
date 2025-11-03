'use client';

import React from 'react';
import { Card, Button } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import FeedbackModal from './FeedbackModal';


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

export default function FeedbackGrid() {
  const [filter, setFilter] = React.useState<'all' | 'workout' | 'meal' | 'progress'>('all');
  const [selectedItem, setSelectedItem] = React.useState<FeedbackItem | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  const feedbackItems: FeedbackItem[] = [
    {
      id: '1',
      clientId: '1',
      clientName: 'Nguyễn Văn A',
      uploadTime: '10 phút trước',
      type: 'image',
      mediaUrl: '/img/caonguyen.png',
      thumbnail: '/img/caonguyen.png',
      category: 'workout',
      status: 'pending',
      note: 'Bài tập ngực hôm nay',
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'Trần Thị B',
      uploadTime: '30 phút trước',
      type: 'video',
      mediaUrl: '/videos/workout.mp4',
      thumbnail: '/img/feature1.png',
      category: 'workout',
      status: 'pending',
      note: 'Squat form check',
    },
    {
      id: '3',
      clientId: '3',
      clientName: 'Lê Văn C',
      uploadTime: '1 giờ trước',
      type: 'image',
      mediaUrl: '/img/feature2.png',
      thumbnail: '/img/feature2.png',
      category: 'meal',
      status: 'pending',
      note: 'Bữa trưa hôm nay',
    },
    {
      id: '4',
      clientId: '4',
      clientName: 'Phạm Thị D',
      uploadTime: '2 giờ trước',
      type: 'image',
      mediaUrl: '/img/feature3.png',
      thumbnail: '/img/feature3.png',
      category: 'progress',
      status: 'pending',
      note: 'Ảnh tiến độ tuần 4',
    },
    {
      id: '5',
      clientId: '5',
      clientName: 'Hoàng Văn E',
      uploadTime: '3 giờ trước',
      type: 'video',
      mediaUrl: '/videos/workout2.mp4',
      thumbnail: '/img/homeBanner.png',
      category: 'workout',
      status: 'pending',
      note: 'Deadlift technique',
    },
    {
      id: '6',
      clientId: '1',
      clientName: 'Nguyễn Văn A',
      uploadTime: '4 giờ trước',
      type: 'image',
      mediaUrl: '/img/Group65.png',
      thumbnail: '/img/Group65.png',
      category: 'meal',
      status: 'reviewed',
      note: 'Bữa tối prep',
    },
  ];

  const filteredItems = feedbackItems.filter((item) => {
    if (filter === 'all') return item.status === 'pending';
    return item.category === filter && item.status === 'pending';
  });

  const handleReview = (item: FeedbackItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'workout':
        return '💪';
      case 'meal':
        return '🍱';
      case 'progress':
        return '📊';
      default:
        return '📷';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'workout':
        return 'Tập luyện';
      case 'meal':
        return 'Ăn uống';
      case 'progress':
        return 'Tiến độ';
      default:
        return 'Khác';
    }
  };

  return (
    <>
      <Card className="p-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all"
            style={{
              background: filter === 'all' ? 'var(--primary)' : 'var(--bg-secondary)',
              color: filter === 'all' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              boxShadow: filter === 'all' ? '0 4px 6px var(--shadow-medium)' : 'none',
            }}
          >
            Tất cả ({feedbackItems.filter(i => i.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('workout')}
            className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all"
            style={{
              background: filter === 'workout' ? 'var(--primary)' : 'var(--bg-secondary)',
              color: filter === 'workout' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              boxShadow: filter === 'workout' ? '0 4px 6px var(--shadow-medium)' : 'none',
            }}
          >
            💪 Tập luyện ({feedbackItems.filter(i => i.category === 'workout' && i.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('meal')}
            className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all"
            style={{
              background: filter === 'meal' ? 'var(--primary)' : 'var(--bg-secondary)',
              color: filter === 'meal' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              boxShadow: filter === 'meal' ? '0 4px 6px var(--shadow-medium)' : 'none',
            }}
          >
            🍱 Ăn uống ({feedbackItems.filter(i => i.category === 'meal' && i.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('progress')}
            className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all"
            style={{
              background: filter === 'progress' ? 'var(--primary)' : 'var(--bg-secondary)',
              color: filter === 'progress' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              boxShadow: filter === 'progress' ? '0 4px 6px var(--shadow-medium)' : 'none',
            }}
          >
            📊 Tiến độ ({feedbackItems.filter(i => i.category === 'progress' && i.status === 'pending').length})
          </button>
        </div>

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-all"
              style={{
                background: 'var(--bg)',
                borderColor: 'var(--border)',
              }}
            >
              {/* Media Thumbnail */}
              <div className="relative h-48" style={{ background: 'var(--bg-secondary)' }}>
                <img
                  src={item.thumbnail}
                  alt={item.note}
                  className="w-full h-full object-cover"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--bg)' }}
                    >
                      <div style={{ color: 'var(--primary)' }}>
                        <Icon name="mdi:play" size={32} />
                      </div>
                    </div>
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: 'var(--text)',
                    }}
                  >
                    {getCategoryIcon(item.category)} {getCategoryLabel(item.category)}
                  </span>
                </div>
                {/* New Badge */}
                <div className="absolute top-3 right-3">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold animate-pulse"
                    style={{
                      background: 'var(--error)',
                      color: 'var(--text-inverse)',
                    }}
                  >
                    MỚI
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      background: 'linear-gradient(to bottom right, var(--primary), var(--primary-dark))',
                      color: 'var(--text-inverse)',
                    }}
                  >
                    {item.clientName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{item.clientName}</h4>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.uploadTime}</p>
                  </div>
                </div>

                {item.note && (
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{item.note}</p>
                )}

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleReview(item)}
                >
                  Đánh giá ngay
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Không có mục nào cần đánh giá
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>Bạn đã xem xét tất cả các bài đăng</p>
          </div>
        )}
      </Card>

      {/* Feedback Modal */}
      {showModal && selectedItem && (
        <FeedbackModal
          item={selectedItem}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </>
  );
}
