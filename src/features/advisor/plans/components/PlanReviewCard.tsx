'use client';

import React from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Avatar } from '@/shared/ui/core/Avatar';
import { Flex } from '@/shared/ui/core/Flex';
import { Icon } from '@/shared/ui/icon';
import type { PlanReview } from '../types';

export interface PlanReviewCardProps {
  plan: PlanReview;
  onReview?: (plan: PlanReview) => void;
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

const getPlanTypeLabel = (type: string) => {
  switch (type) {
    case 'workout':
      return 'Tập luyện';
    case 'meal':
      return 'Ăn uống';
    case 'combined':
      return 'Tập luyện & Ăn uống';
    default:
      return type;
  }
};

const getPlanTypeIcon = (type: string) => {
  switch (type) {
    case 'workout':
      return 'mdi:dumbbell';
    case 'meal':
      return 'mdi:food-apple';
    case 'combined':
      return 'mdi:clipboard-text-outline';
    default:
      return 'mdi:file-document-outline';
  }
};

export const PlanReviewCard: React.FC<PlanReviewCardProps> = ({ plan, onReview }) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex h-full flex-col gap-4">
        {/* Header Section */}
        <Flex align="center" justify="space-between" className="flex-shrink-0 pb-3 border-b border-[var(--border)]">
          <Flex align="center" gap={12} wrap className="flex-1 min-w-0">
            <Avatar 
              size={52} 
              src={plan.userAvatar} 
              className="flex-shrink-0"
            >
              {plan.userName.charAt(0)}
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-[var(--text)] mb-1">{plan.userName}</div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-1">
                <Icon name="mdi:email-outline" size={14} />
                <span className="truncate">{plan.userEmail}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                <Icon name="mdi:clock-outline" size={12} />
                <span>Gửi: {formatDateTime(plan.submittedAt)}</span>
              </div>
            </div>
          </Flex>
        </Flex>

        {/* Content Section */}
        <div className="flex flex-col gap-3.5 flex-1 min-h-0">
          {/* Plan Name */}
          <div className="flex items-center gap-2">
            <Icon name={getPlanTypeIcon(plan.planType)} size={18} className="text-[var(--primary)]" />
            <span className="text-base font-semibold text-[var(--text)]">{plan.planName}</span>
          </div>

          {/* Plan Type Badge */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
              {getPlanTypeLabel(plan.planType)}
            </span>
            {plan.planType === 'combined' && (
              <>
                <Icon name="mdi:dumbbell" size={14} className="text-[var(--primary)]" />
                <Icon name="mdi:food-apple" size={14} className="text-[var(--primary)]" />
              </>
            )}
          </div>

          {/* Goal */}
          {plan.goal && (
            <div className="rounded-lg bg-[var(--bg-secondary)] p-3.5 border-l-4 border-[var(--primary)]">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="mdi:target" size={16} className="text-[var(--primary)]" />
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Mục tiêu</span>
              </div>
              <p className="text-sm text-[var(--text)] leading-relaxed pl-6">{plan.goal}</p>
            </div>
          )}

          {/* Plan Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Icon name="mdi:calendar-clock-outline" size={16} />
              <span>{plan.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Icon name="mdi:calendar-range" size={16} />
              <span>{plan.totalDays} ngày</span>
            </div>
            {plan.startDate && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Icon name="mdi:calendar-start" size={16} />
                <span>{new Date(plan.startDate).toLocaleDateString('vi-VN')}</span>
              </div>
            )}
            {plan.endDate && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Icon name="mdi:calendar-end" size={16} />
                <span>{new Date(plan.endDate).toLocaleDateString('vi-VN')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 pt-2.5 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={() => onReview?.(plan)}
            className="w-full h-10 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Icon name="mdi:eye-outline" size={18} />
            <span>Xem chi tiết và duyệt</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PlanReviewCard;

