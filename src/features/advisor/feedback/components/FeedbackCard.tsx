'use client';

import React from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Avatar } from '@/shared/ui/core/Avatar';
import { Flex } from '@/shared/ui/core/Flex';
import { Tag, Dropdown, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { Icon } from '@/shared/ui/icon';
import type { FeedbackSubmission, FeedbackStatus } from '../types';

export interface FeedbackCardProps {
  submission: FeedbackSubmission;
  onAction?: (action: string, submission: FeedbackSubmission) => void;
}

const statusConfig: Record<FeedbackStatus, { label: string; color: string; bg: string }> = {
  pending: {
    label: 'Chờ đánh giá',
    color: 'var(--warning, #fa8c16)',
    bg: 'rgba(250, 140, 22, 0.12)',
  },
  reviewed: {
    label: 'Đã đánh giá',
    color: 'var(--success)',
    bg: 'rgba(82, 196, 26, 0.12)',
  },
  rework: {
    label: 'Cần làm lại',
    color: 'var(--error)',
    bg: 'rgba(255, 77, 79, 0.12)',
  },
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

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ submission, onAction }) => {
  const handleMenuClick = (action: string) => {
    onAction?.(action, submission);
  };

  const menuItems: MenuProps['items'] = [
    { key: 'review', label: 'Đánh giá ngay' },
    { key: 'mark-reviewed', label: 'Đánh dấu đã đánh giá' },
    { key: 'request-rework', label: 'Yêu cầu tập lại' },
  ];

  const status = statusConfig[submission.status];

  const renderMedia = () => {
    if (submission.mediaType === 'video') {
      return (
        <video
          controls
          preload="metadata"
          poster={submission.thumbnailUrl}
          className="h-48 w-full rounded-lg object-cover"
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
        className="h-48 w-full rounded-lg object-cover"
        loading="lazy"
      />
    );
  };

  return (
    <Card className="h-full" style={{ borderRadius: 12, border: '1px solid var(--border)' }}>
      <div className="flex h-full flex-col gap-4">
        <Flex align="center" justify="space-between" wrap>
          <Flex align="center" gap={12} wrap>
            <Avatar size={48} src={submission.customerAvatar}>
              {submission.customerName.charAt(0)}
            </Avatar>
            <div>
              <div className="text-base font-semibold text-[var(--text)]">{submission.customerName}</div>
              <div className="text-sm text-[var(--text-secondary)]">{submission.customerEmail}</div>
              <div className="text-xs text-[var(--text-tertiary,#667085)]">Gửi lúc {formatDateTime(submission.submittedAt)}</div>
            </div>
          </Flex>

          <Flex align="center" gap={8} wrap>
            <Tag
              style={{
                color: status.color,
                background: status.bg,
                borderColor: 'transparent',
              }}
            >
              {status.label}
            </Tag>
            <Dropdown
              trigger={[ 'click' ]}
              menu={{ items: menuItems, onClick: ({ key }) => handleMenuClick(key) }}
            >
              <button className="h-8 w-8 grid place-items-center rounded-md border border-[var(--border)] hover:bg-[var(--bg-tertiary)]">
                <Icon name="mdi:dots-vertical" />
              </button>
            </Dropdown>
          </Flex>
        </Flex>

        <div className="space-y-3">
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between font-medium text-[var(--text)]">
              <span>{submission.workoutName}</span>
              <Tooltip title="Trọng tâm bài tập">
                <span className="text-xs font-semibold uppercase text-[var(--primary)]">
                  {submission.focusArea}
                </span>
              </Tooltip>
            </div>
            {submission.notesFromCustomer && (
              <div className="rounded-md bg-[var(--bg-tertiary)] p-3 text-sm text-[var(--text-secondary)]">
                “{submission.notesFromCustomer}”
              </div>
            )}
          </div>

          {renderMedia()}

          {submission.advisorNotes && (
            <div className="rounded-md border border-dashed border-[var(--border)] p-3 text-sm text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text)]">Nhận xét trước đó:</span> {submission.advisorNotes}
            </div>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
          <button
            type="button"
            onClick={() => handleMenuClick('review')}
            className="h-9 rounded-md border border-[var(--primary)] px-4 text-[var(--primary)] hover:bg-[var(--bg-tertiary)]"
          >
            Đánh giá ngay
          </button>
          <button
            type="button"
            onClick={() => handleMenuClick('mark-reviewed')}
            className="h-9 rounded-md bg-[var(--primary)] px-4 text-white hover:opacity-90"
          >
            Đánh dấu hoàn thành
          </button>
        </div>
      </div>
    </Card>
  );
};

export default FeedbackCard;
