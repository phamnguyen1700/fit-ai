'use client';

import React from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Avatar } from '@/shared/ui/core/Avatar';
import { Flex } from '@/shared/ui/core/Flex';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Icon } from '@/shared/ui/icon';
import type { FeedbackSubmission } from '../types';

export interface FeedbackCardProps {
  submission: FeedbackSubmission;
  onAction?: (action: string, submission: FeedbackSubmission) => void;
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

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ submission, onAction }) => {
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
          {/* Workout Name */}
          <div className="flex items-center gap-2">
            <Icon name="mdi:dumbbell" size={18} className="text-[var(--primary)]" />
            <span className="text-base font-semibold text-[var(--text)]">{submission.workoutName}</span>
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
