'use client';

import React from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Avatar } from '@/shared/ui/core/Avatar';
import { Flex } from '@/shared/ui/core/Flex';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Icon } from '@/shared/ui/icon';
import type { WorkoutReview, MealReview } from '@/types/advisorreview';

export interface FeedbackCardProps {
  workoutReview?: WorkoutReview;
  mealReview?: MealReview;
  onAction?: (action: string) => void;
}

const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ workoutReview, mealReview, onAction }) => {
  const review = workoutReview || mealReview;

  if (!review) {
    return (
      <Card className="h-full flex flex-col">
        <div className="flex items-center justify-center p-8 text-sm text-[var(--text-secondary)]">
          Không có dữ liệu
        </div>
      </Card>
    );
  }

  const isWorkout = !!workoutReview;
  const displayName = isWorkout 
    ? `${workoutReview.exerciseName} - Ngày ${workoutReview.dayNumber}`
    : `${mealReview!.mealType} - Ngày ${mealReview!.dayNumber}`;
  const mediaUrl = isWorkout ? workoutReview.videoUrl : mealReview!.photoUrl;

  const handleMenuClick = (action: string) => {
    onAction?.(action);
  };

  const menuItems: MenuProps['items'] = [
    { key: 'review', label: 'Đánh giá ngay' },
    { key: 'mark-reviewed', label: 'Đánh dấu đã đánh giá' },
    { key: 'request-rework', label: 'Yêu cầu tập lại' },
  ];

  const renderMedia = () => {
    if (isWorkout) {
      return (
        <video
          controls
          preload="metadata"
          className="h-52 w-full object-cover rounded-lg"
        >
          <source src={mediaUrl} />
          Trình duyệt không hỗ trợ phát video.
        </video>
      );
    }
    return (
      <img
        src={mediaUrl}
        alt={displayName}
        className="h-52 w-full object-cover rounded-lg"
        loading="lazy"
      />
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="flex h-full flex-col gap-4">
        {/* Header Section */}
        <Flex align="center" justify="space-between" className="flex-shrink-0 pb-3 border-b border-[var(--border)]">
          <Flex align="center" gap={12} wrap className="flex-1 min-w-0">
            <Avatar 
              size={52} 
              className="flex-shrink-0"
            >
              {review.userName.charAt(0)}
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-[var(--text)] mb-1">{review.userName}</div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                <Icon name="mdi:clock-outline" size={12} />
                <span>{formatDateTime(review.createdAt)}</span>
              </div>
            </div>
          </Flex>

          <Dropdown
            trigger={['click']}
            menu={{ items: menuItems, onClick: ({ key }) => handleMenuClick(key) }}
          >
            <button className="h-8 w-8 flex-shrink-0 grid place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
              <Icon name="mdi:dots-vertical" size={18} className="text-[var(--text-secondary)]" />
            </button>
          </Dropdown>
        </Flex>

        {/* Content Section */}
        <div className="flex flex-col gap-3.5 flex-1 min-h-0">
          {/* Workout Name with Tag */}
          <div className="flex items-center gap-2 flex-wrap">
            <Icon name={isWorkout ? "mdi:dumbbell" : "mdi:food-apple"} size={18} className="text-[var(--primary)]" />
            <span className="text-base font-semibold text-[var(--text)]">{displayName}</span>
            {review.hasComments && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
                <Icon name="mdi:check-circle" size={14} className="text-green-600" />
                <span className="text-xs font-medium text-green-700">Đã đánh giá</span>
              </span>
            )}
          </div>

          {/* Media */}
          <div className="rounded-lg overflow-hidden border border-[var(--border)]">
            {renderMedia()}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 pt-2.5 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={() => handleMenuClick('review')}
            className="w-full h-10 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Icon name="mdi:star-outline" size={18} />
            <span>Đánh giá ngay</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default FeedbackCard;
