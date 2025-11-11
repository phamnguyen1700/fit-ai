'use client';

import React, { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Modal } from '@/shared/ui/core/Modal';
import { Flex } from '@/shared/ui/core/Flex';
import { Avatar } from '@/shared/ui/core/Avatar';
import { TextArea, Select, Rate } from '@/shared/ui';
import { Tag } from 'antd';
import type { FeedbackSubmission, FeedbackStatus, FeedbackReviewPayload } from '../types';

const statusOptions: { label: string; value: FeedbackStatus }[] = [
  { value: 'pending', label: 'Chờ đánh giá' },
  { value: 'reviewed', label: 'Đã đánh giá' },
  { value: 'rework', label: 'Cần làm lại' },
];

const QUICK_REMARKS: string[] = [
  'Tuyệt vời! Giữ vững phong độ',
  'Tốt, nhưng cần chú ý tư thế',
  'Hãy tăng cường độ tập luyện',
  'Cần điều chỉnh khẩu phần ăn',
  'Form chưa chuẩn, cẩn thận chấn thương',
  'Tiến độ rất tốt, tiếp tục phát huy',
];

export interface ReviewModalProps {
  submission: FeedbackSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: FeedbackReviewPayload) => void;
}

const statusColors: Record<FeedbackStatus, string> = {
  pending: 'var(--warning, #fa8c16)',
  reviewed: 'var(--success)',
  rework: 'var(--error)',
};

export const ReviewModal: React.FC<ReviewModalProps> = ({ submission, isOpen, onClose, onSubmit }) => {
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<FeedbackStatus>('reviewed');
  const [rating, setRating] = useState<number>(0);
  const [selectedRemarks, setSelectedRemarks] = useState<string[]>([]);

  React.useEffect(() => {
    if (submission) {
      setNotes(submission.advisorNotes ?? '');
      setStatus(submission.status === 'pending' ? 'reviewed' : submission.status);
      setRating(submission.status === 'reviewed' ? 4 : 0);
      setSelectedRemarks([]);
    }
  }, [submission]);

  const relativeSubmittedTime = useMemo(() => {
    if (!submission) return '';
    const submittedDate = new Date(submission.submittedAt);
    const diffMs = Date.now() - submittedDate.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    if (diffMinutes < 1) return 'Vừa gửi';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} ngày trước`;
  }, [submission]);

  const toggleRemark = (remark: string) => {
    setSelectedRemarks((prev) =>
      prev.includes(remark) ? prev.filter((item) => item !== remark) : [ ...prev, remark ],
    );
  };

  const preview = useMemo(() => {
    if (!submission) return null;
    if (submission.mediaType === 'video') {
      return (
        <video
          controls
          preload="metadata"
          poster={submission.thumbnailUrl}
          className="w-full rounded-lg"
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
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    );
  }, [submission]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Đánh giá từ ${submission?.customerName ?? ''}`.trim()}
      size="xl"
      showFooter={false}
    >
      {submission ? (
        <div className="flex flex-col gap-6">
          <Flex align="center" justify="space-between" wrap>
            <Flex align="center" gap={12} wrap>
              <Avatar size={48} src={submission.customerAvatar}>
                {submission.customerName.charAt(0)}
              </Avatar>
              <div>
                <div className="text-base font-semibold text-[var(--text)]">{submission.customerName}</div>
                <div className="text-sm text-[var(--text-secondary)]">{submission.customerEmail}</div>
                <div className="text-xs text-[var(--text-tertiary,#667085)]">{relativeSubmittedTime}</div>
              </div>
            </Flex>
            <Tag color={statusColors[submission.status]}>{submission.workoutName}</Tag>
          </Flex>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                {preview}
              </div>

              {submission.notesFromCustomer && (
                <div className="rounded-lg bg-[var(--bg-tertiary)] p-3 text-sm text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text)]">Ghi chú từ khách hàng:</span>
                  <div>{submission.notesFromCustomer}</div>
                </div>
              )}

              <div className="grid gap-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Trạng thái</label>
                <Select
                  value={status}
                  onChange={(value) => setStatus(value as FeedbackStatus)}
                  options={statusOptions}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-[var(--border)] p-4">
                <div className="mb-2 text-sm font-semibold text-[var(--text-secondary)]">Đánh giá</div>
                <Rate value={rating} onChange={setRating} />
              </div>

              <div className="rounded-lg border border-[var(--border)] p-4">
                <div className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Nhận xét nhanh</div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REMARKS.map((remark) => {
                    const active = selectedRemarks.includes(remark);
                    return (
                      <button
                        key={remark}
                        type="button"
                        onClick={() => toggleRemark(remark)}
                        className={`rounded-full border px-3 py-1 text-sm transition ${active ? 'border-[var(--primary)] bg-[var(--primary-transparent,rgba(56,189,248,0.12))] text-[var(--primary)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
                      >
                        {remark}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Nhận xét chi tiết</label>
                <TextArea
                  value={notes}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                  rows={5}
                  placeholder="Nhập nhận xét của bạn..."
                />
              </div>

              <div className="flex flex-col gap-2 border-t border-[var(--border)] pt-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-[var(--text-tertiary,#667085)]">Hành động nhanh:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('reviewed')}
                    className="rounded-md border border-[var(--border)] px-3 py-1 text-sm hover:bg-[var(--bg-tertiary)]"
                  >
                    Đánh dấu hoàn thành
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('rework')}
                    className="rounded-md border border-[var(--border)] px-3 py-1 text-sm hover:bg-[var(--bg-tertiary)]"
                  >
                    Yêu cầu tập lại
                  </button>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 rounded-md border border-[var(--border)] px-4 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  onClick={() =>
                    submission &&
                    onSubmit({ advisorNotes: notes, status, rating, quickRemarks: selectedRemarks })
                  }
                  className="h-10 rounded-md bg-[var(--primary)] px-4 font-semibold text-white hover:opacity-90"
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Không tìm thấy thông tin khách hàng.</div>
      )}
    </Modal>
  );
};

export default ReviewModal;
