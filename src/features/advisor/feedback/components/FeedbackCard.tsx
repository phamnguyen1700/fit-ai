'use client';

import React, { useMemo } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Avatar } from '@/shared/ui/core/Avatar';
import { Flex } from '@/shared/ui/core/Flex';
import { Badge } from '@/shared/ui/core/Badge';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Icon } from '@/shared/ui/icon';
import type { FeedbackSubmission } from '../types';
import type { WorkoutReview, MealReview } from '@/types/advisorreview';

export interface FeedbackCardProps {
  submission?: FeedbackSubmission; // Optional để backward compatible
  workoutReview?: WorkoutReview; // New prop để fetch trực tiếp
  mealReview?: MealReview; // New prop cho meal reviews
  onAction?: (action: string, submission: FeedbackSubmission) => void;
}

const normalizeWorkoutReviewToFeedback = (review: WorkoutReview): FeedbackSubmission => {
  // Determine status based on hasComments and lastCommentFrom
  let status: FeedbackSubmission['status'] = 'pending';
  if (review.hasComments) {
    if (review.lastCommentFrom === 'advisor') {
      status = 'reviewed';
    } else if (review.lastCommentFrom === 'customer' || review.lastCommentFrom === 'user') {
      status = 'rework';
    }
  }

  return {
    id: review.workoutLogId,
    customerName: review.userName,
    customerEmail: '', // API không có email
    customerAvatar: undefined,
    submittedAt: review.createdAt,
    workoutName: `${review.exerciseName} - Ngày ${review.dayNumber}`,
    focusArea: review.exerciseName,
    notesFromCustomer: undefined,
    mediaType: 'video' as const,
    mediaUrl: review.videoUrl,
    thumbnailUrl: undefined,
    status,
    advisorNotes: review.hasComments && review.lastCommentFrom === 'advisor' ? 'Đã có nhận xét' : undefined,
    category: 'training' as const,
  };
};

const normalizeMealReviewToFeedback = (review: MealReview): FeedbackSubmission => {
  // Determine status based on hasComments and lastCommentFrom
  let status: FeedbackSubmission['status'] = 'pending';
  if (review.hasComments) {
    if (review.lastCommentFrom === 'advisor') {
      status = 'reviewed';
    } else if (review.lastCommentFrom === 'user' || review.lastCommentFrom === 'customer') {
      status = 'rework';
    }
  }

  return {
    id: review.mealLogId,
    customerName: review.userName,
    customerEmail: '', // API không có email
    customerAvatar: undefined,
    submittedAt: review.createdAt,
    workoutName: `${review.mealType} - Ngày ${review.dayNumber}`,
    focusArea: review.mealType,
    notesFromCustomer: undefined,
    mediaType: 'image' as const,
    mediaUrl: review.photoUrl,
    thumbnailUrl: review.photoUrl,
    status,
    advisorNotes: review.hasComments && review.lastCommentFrom === 'advisor' ? 'Đã có nhận xét' : undefined,
    category: 'nutrition' as const,
  };
};

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

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ submission: submissionProp, workoutReview, mealReview, onAction }) => {
  // Normalize workoutReview hoặc mealReview nếu có, hoặc dùng submission prop (backward compatible)
  const submission = useMemo(() => {
    if (submissionProp) {
      return submissionProp;
    }
    
    if (workoutReview) {
      console.log('📊 [FeedbackCard] Normalizing workout review:', workoutReview);
      const normalized = normalizeWorkoutReviewToFeedback(workoutReview);
      console.log('✅ [FeedbackCard] Normalized submission:', normalized);
      return normalized;
    }
    
    if (mealReview) {
      console.log('📊 [FeedbackCard] Normalizing meal review:', mealReview);
      const normalized = normalizeMealReviewToFeedback(mealReview);
      console.log('✅ [FeedbackCard] Normalized submission:', normalized);
      return normalized;
    }
    
    return null;
  }, [submissionProp, workoutReview, mealReview]);

  if (!submission) {
    return (
      <Card className="h-full flex flex-col">
        <div className="flex items-center justify-center p-8 text-sm text-[var(--text-secondary)]">
          Không có dữ liệu
        </div>
      </Card>
    );
  }

  const handleMenuClick = (action: string) => {
    onAction?.(action, submission);
  };

  const menuItems: MenuProps['items'] = [
    { key: 'review', label: 'Đánh giá ngay' },
    { key: 'mark-reviewed', label: 'Đánh dấu đã đánh giá' },
    { key: 'request-rework', label: 'Yêu cầu tập lại' },
  ];

  const renderMedia = () => {
    if (submission.mediaType === 'video') {
      return (
        <video
          controls
          preload="metadata"
          poster={submission.thumbnailUrl}
          className="h-52 w-full object-cover rounded-lg"
        >
          <source src={submission.mediaUrl} />
          Trình duyệt không hỗ trợ phát video.
        </video>
      );
    }
    return (
      <img
        src={submission.mediaUrl}
        alt={submission.workoutName}
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
              src={submission.customerAvatar} 
              className="flex-shrink-0"
            >
              {submission.customerName.charAt(0)}
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-[var(--text)] mb-1">{submission.customerName}</div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-1">
                <Icon name="mdi:email-outline" size={14} />
                <span className="truncate">{submission.customerEmail}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                <Icon name="mdi:clock-outline" size={12} />
                <span>{formatDateTime(submission.submittedAt)}</span>
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
            <Icon name="mdi:dumbbell" size={18} className="text-[var(--primary)]" />
            <span className="text-base font-semibold text-[var(--text)]">{submission.workoutName}</span>
            {(workoutReview?.hasComments || mealReview?.hasComments) && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
                <Icon name="mdi:check-circle" size={14} className="text-green-600" />
                <span className="text-xs font-medium text-green-700">Đã đánh giá</span>
              </span>
            )}
          </div>

          {/* Customer Notes */}
          {submission.notesFromCustomer && (
            <div className="rounded-lg bg-[var(--bg-secondary)] p-3.5 border-l-4 border-[var(--primary)]">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="mdi:message-text-outline" size={16} className="text-[var(--primary)]" />
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Ghi chú từ khách hàng</span>
              </div>
              <p className="text-sm text-[var(--text)] leading-relaxed pl-6">{submission.notesFromCustomer}</p>
            </div>
          )}

          {/* Media */}
          <div className="rounded-lg overflow-hidden border border-[var(--border)]">
            {renderMedia()}
          </div>

          {/* Advisor Notes */}
          {submission.advisorNotes && (
            <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-secondary)] p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="mdi:clipboard-text-outline" size={16} className="text-[var(--text-secondary)]" />
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Nhận xét trước đó</span>
              </div>
              <p className="text-sm text-[var(--text)] leading-relaxed pl-6">{submission.advisorNotes}</p>
            </div>
          )}
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
