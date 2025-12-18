'use client';

import React, { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Modal } from '@/shared/ui/core/Modal';
import { Flex } from '@/shared/ui/core/Flex';
import { Avatar } from '@/shared/ui/core/Avatar';
import { TextArea, Input } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import {
  usePendingMealReviews,
  usePendingWorkoutReviews,
  useSubmitMealReview,
  useSubmitWorkoutReview,
} from '@/tanstack/hooks/advisorreview';
import { useAddMealPlanComment, useMealPlanComments } from '@/tanstack/hooks/mealplan';
import { useAddWorkoutPlanComment, useWorkoutPlanComments } from '@/tanstack/hooks/workoutplan';
import type { WorkoutReview, MealReview } from '@/types/advisorreview';

interface Comment {
  id: string;
  author: 'customer' | 'advisor';
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
}

interface FeedbackReviewPayload {
  advisorNotes: string;
  status: 'reviewed';
  rating: number;
  quickRemarks: string[];
}

const QUICK_REMARKS: string[] = [
  'Tuyệt vời! Giữ vững phong độ',
  'Tốt, nhưng cần chú ý tư thế',
  'Hãy tăng cường độ tập luyện',
  'Cần điều chỉnh khẩu phần ăn',
  'Form chưa chuẩn, cẩn thận chấn thương',
  'Tiến độ rất tốt, tiếp tục phát huy',
];

export interface ReviewModalProps {
  submission: WorkoutReview | MealReview | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: FeedbackReviewPayload) => void;
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

export const ReviewModal: React.FC<ReviewModalProps> = ({ submission, isOpen, onClose, onSubmit }) => {
  const [notes, setNotes] = useState('');
  const [score, setScore] = useState<number>(0);
  const [selectedRemarks, setSelectedRemarks] = useState<string[]>([]);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const pendingWorkoutQuery = usePendingWorkoutReviews();
  const pendingMealQuery = usePendingMealReviews();
  const submitWorkoutReviewMutation = useSubmitWorkoutReview();
  const submitMealReviewMutation = useSubmitMealReview();

  const activeSubmission = useMemo<WorkoutReview | MealReview | null>(() => {
    if (!submission) return null;

    // Enrich submission with latest data from pending workout/meal APIs (including comments, segments, foodWeights, ...)
    if ('workoutLogId' in submission) {
      const list = pendingWorkoutQuery.data?.data ?? [];
      const found = list.find((item) => item.workoutLogId === submission.workoutLogId);
      return found ?? submission;
    }

    if ('mealLogId' in submission) {
      const list = pendingMealQuery.data?.data ?? [];
      const found = list.find((item) => item.mealLogId === submission.mealLogId);
      return found ?? submission;
    }

    return submission;
  }, [submission, pendingWorkoutQuery.data, pendingMealQuery.data]);

  const mealLogId = activeSubmission && 'mealLogId' in activeSubmission ? activeSubmission.mealLogId : undefined;
  const workoutLogId =
    activeSubmission && 'workoutLogId' in activeSubmission ? activeSubmission.workoutLogId : undefined;

  const mealCommentsQuery = useMealPlanComments(mealLogId, Boolean(mealLogId));
  const workoutCommentsQuery = useWorkoutPlanComments(workoutLogId, Boolean(workoutLogId));
  const addMealCommentMutation = useAddMealPlanComment(mealLogId);
  const addWorkoutCommentMutation = useAddWorkoutPlanComment(workoutLogId);

  const remoteComments = React.useMemo<Comment[]>(() => {
    if (mealLogId) {
      const response = mealCommentsQuery.data?.data;
      return (
        response?.comments.map((comment) => ({
          id: comment.id ?? `meal-comment-${comment.createdAt ?? comment.content}`,
          author: comment.senderType === 'advisor' ? 'advisor' : 'customer',
          authorName: comment.senderName ?? (comment.senderType === 'advisor' ? 'Coach' : submission?.userName ?? 'User'),
          authorAvatar: comment.senderAvatarUrl,
          content: comment.content ?? '',
          timestamp: comment.createdAt ?? comment.updatedAt ?? new Date().toISOString(),
        })) ?? []
      );
    }

    if (workoutLogId) {
      const response = workoutCommentsQuery.data?.data;
      return (
        response?.comments.map((comment) => ({
          id: comment.id ?? `workout-comment-${comment.createdAt ?? comment.content}`,
          author: comment.senderType === 'advisor' ? 'advisor' : 'customer',
          authorName: comment.senderName ?? (comment.senderType === 'advisor' ? 'Coach' : submission?.userName ?? 'User'),
          authorAvatar: comment.senderAvatarUrl,
          content: comment.content ?? '',
          timestamp: comment.createdAt ?? comment.updatedAt ?? new Date().toISOString(),
        })) ?? []
      );
    }

    return [];
  }, [mealLogId, mealCommentsQuery.data, submission?.userName, workoutCommentsQuery.data, workoutLogId]);

  // For display, only use remote comments from server to avoid duplication
  const combinedComments = React.useMemo(
    () => remoteComments,
    [remoteComments]
  );

  const isLoadingComments = mealLogId
    ? mealCommentsQuery.isLoading
    : workoutLogId
    ? workoutCommentsQuery.isLoading
    : false;

  const isErrorComments = mealLogId
    ? mealCommentsQuery.isError
    : workoutLogId
    ? workoutCommentsQuery.isError
    : false;

  const buildMealCommentsPayload = React.useCallback(() => {
    const noteLines = notes
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const remarkLines = selectedRemarks.filter(Boolean);

    const advisorCommentLines = localComments
      .filter((comment) => comment.author === 'advisor')
      .map((comment) => comment.content.trim())
      .filter(Boolean);

    return [...noteLines, ...remarkLines, ...advisorCommentLines];
  }, [localComments, notes, selectedRemarks]);

  const isSubmitting =
    submitWorkoutReviewMutation.isPending || submitMealReviewMutation.isPending;

  React.useEffect(() => {
    if (submission) {
      setNotes('');
      setScore(0);
      setSelectedRemarks([]);
      setLocalComments([]);
      setNewComment('');
    }
  }, [submission]);

  const toggleRemark = (remark: string) => {
    setSelectedRemarks((prev) => {
      const isSelected = prev.includes(remark);
      if (isSelected) {
        // Bỏ chọn: xóa khỏi selectedRemarks
        return prev.filter((item) => item !== remark);
      } else {
        // Chọn: thêm vào selectedRemarks và thêm vào notes
        setNotes((currentNotes) => {
          const trimmedNotes = currentNotes.trim();
          if (trimmedNotes === '') {
            return remark;
          }
          // Thêm remark mới vào cuối, cách nhau bằng dấu xuống dòng
          return `${trimmedNotes}\n${remark}`;
        });
        return [...prev, remark];
      }
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !activeSubmission) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'advisor',
      authorName: 'Advisor', // TODO: Get from auth context
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setLocalComments((prev) => [...prev, comment]);
    setNewComment('');

    if (mealLogId) {
      addMealCommentMutation.mutate({ content: comment.content });
    } else if (workoutLogId) {
      addWorkoutCommentMutation.mutate({ content: comment.content });
    }
  };

  const preview = useMemo(() => {
    if (!activeSubmission) return null;
    
    // Check if it's a workout (has videoUrl) or meal (has photoUrl)
    if ('videoUrl' in activeSubmission) {
      return (
        <video
          controls
          preload="metadata"
          className="w-full rounded-lg shadow-sm"
        >
          <source src={activeSubmission.videoUrl} />
          Trình duyệt không hỗ trợ phát video.
        </video>
      );
    }

    if ('photoUrl' in activeSubmission) {
      return (
        <img
          src={activeSubmission.photoUrl}
          alt={`${activeSubmission.mealType} - Ngày ${activeSubmission.dayNumber}`}
          className="w-full rounded-lg object-cover shadow-sm"
          loading="lazy"
        />
      );
    }

    return null;
  }, [activeSubmission]);

  const userName = activeSubmission ? activeSubmission.userName : '';
  const displayName = 'exerciseName' in (activeSubmission || {})
    ? `${(activeSubmission as WorkoutReview).exerciseName} - Ngày ${(activeSubmission as WorkoutReview).dayNumber}`
    : 'mealType' in (activeSubmission || {})
    ? `${(activeSubmission as MealReview).mealType} - Ngày ${(activeSubmission as MealReview).dayNumber}`
    : '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Đánh giá từ ${userName}`.trim()}
      size="xl"
      showFooter={false}
    >
      {activeSubmission ? (
        <div className="flex flex-col gap-6">
          {/* Header */}
          <Flex align="center" gap={14} wrap>
            <Avatar size={56} className="flex-shrink-0 ring-2 ring-[var(--border)] ring-offset-2 ring-offset-white">
              {userName.charAt(0)}
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-semibold text-[var(--text)] mb-1">{userName}</div>
              <div className="flex items-center gap-2">
                <Icon
                  name={'workoutLogId' in activeSubmission ? 'mdi:dumbbell' : 'mdi:food-apple'}
                  size={16}
                  className="text-[var(--primary)]"
                />
                <span className="text-sm font-medium text-[var(--text)]">{displayName}</span>
              </div>
            </div>
          </Flex>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            {/* Left Column - Media, Workout/Meal Details & Comments */}
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                {preview}
              </div>

              {/* Workout details (segments, duration) */}
              {'workoutLogId' in activeSubmission && (activeSubmission.segments?.length || activeSubmission.actualDurationMinutes != null) ? (
                <div className="rounded-lg border border-[var(--border)] bg-white p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon name="mdi:dumbbell" size={18} className="text-[var(--primary)]" />
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">
                      Chi tiết bài tập
                    </span>
                  </div>

                  {activeSubmission.segments?.length ? (
                    <div className="mb-3 space-y-2 text-sm">
                      {activeSubmission.segments.map((segment, index) => (
                        <div
                          key={`${segment.setNumber}-${index}`}
                          className="flex items-center justify-between rounded-md bg-[var(--bg-tertiary)]/60 px-3 py-2"
                        >
                          <span className="font-medium text-[var(--text)]">
                            Set {segment.setNumber}
                          </span>
                          <span className="text-sm text-[var(--text-secondary)]">
                            Hoàn thành: {segment.completed}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {activeSubmission.actualDurationMinutes != null && (
                    <div className="mt-1 text-xs text-[var(--text-secondary)]">
                      Thời lượng thực tế:{" "}
                      <span className="font-semibold text-[var(--text)]">
                        {activeSubmission.actualDurationMinutes} phút
                      </span>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Meal details (foodWeights) */}
              {'mealLogId' in activeSubmission && activeSubmission.foodWeights?.length ? (
                <div className="rounded-lg border border-[var(--border)] bg-white p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon name="mdi:food-apple" size={18} className="text-[var(--primary)]" />
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">
                      Chi tiết khẩu phần ăn
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {activeSubmission.foodWeights.map((item, index) => (
                      <div
                        key={`${item.foodName}-${index}`}
                        className="flex items-center justify-between rounded-md bg-[var(--bg-tertiary)]/60 px-3 py-2"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-[var(--text)]">{item.foodName}</span>
                          <span className="text-xs text-[var(--text-secondary)]">
                            {item.caloriesPer100g} kcal / 100g
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-[var(--text)]">
                            {item.weightInGrams} g
                          </div>
                          <div className="text-xs text-[var(--text-secondary)]">
                            ~ {item.calculatedCalories} kcal
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Comments Section */}
              <div className="rounded-lg border border-[var(--border)] bg-white">
                <div className="border-b border-[var(--border)] p-4">
                  <div className="flex items-center gap-2">
                    <Icon name="mdi:comment-text-outline" size={18} className="text-[var(--primary)]" />
                    <span className="text-base font-semibold text-[var(--text)]">Bình luận</span>
                  </div>
                </div>

                {/* Comments List */}
                <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                  {isErrorComments ? (
                    <div className="py-8 text-center text-sm text-red-500">
                      Không thể tải bình luận. Vui lòng thử lại sau.
                    </div>
                  ) : isLoadingComments ? (
                    <div className="py-8 text-center text-sm text-[var(--text-secondary)]">
                      Đang tải bình luận...
                    </div>
                  ) : combinedComments.length === 0 ? (
                    <div className="py-8 text-center text-sm text-[var(--text-secondary)]">
                      Chưa có bình luận nào
                    </div>
                  ) : (
                    combinedComments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`flex gap-3 ${comment.author === 'advisor' ? 'flex-row-reverse' : ''}`}
                      >
                        <Avatar size={40} src={comment.authorAvatar} className="flex-shrink-0">
                          {comment.authorName.charAt(0)}
                        </Avatar>
                        <div className={`flex-1 ${comment.author === 'advisor' ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-[var(--text)]">{comment.authorName}</span>
                            <span className="text-xs text-[var(--text-secondary)]">
                              {formatDateTime(comment.timestamp)}
                            </span>
                          </div>
                          <div
                            className={`rounded-lg p-3 text-sm ${
                              comment.author === 'advisor'
                                ? 'bg-[var(--primary)]/10 text-[var(--text)] ml-auto'
                                : 'bg-[var(--bg-tertiary)] text-[var(--text)]'
                            }`}
                          >
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Input */}
                <div className="border-t border-[var(--border)] p-4">
                  <div className="flex gap-2">
                    <TextArea
                      value={newComment}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
                      placeholder="Nhập bình luận..."
                      rows={2}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="h-10 px-4 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
                    >
                      <Icon name="mdi:send" size={18} />
                      <span>Gửi</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Review Form */}
            <div className="flex flex-col gap-4">
              {/* Score Input */}
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]/30 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Icon name="mdi:percent" size={18} className="text-[var(--primary)]" />
                  <span className="text-sm font-semibold text-[var(--text-secondary)]">Đánh giá (%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={score || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                      setScore(Math.min(100, Math.max(0, value)));
                    }}
                    className="flex-1"
                    placeholder="0"
                    suffix="%"
                  />
                  <div className="text-2xl font-bold text-[var(--primary)] min-w-[60px] text-right">{score}%</div>
                </div>
              </div>

              {/* Quick Remarks */}
              <div className="rounded-lg border border-[var(--border)] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Icon name="mdi:lightning-bolt-outline" size={18} className="text-[var(--primary)]" />
                  <span className="text-sm font-semibold text-[var(--text-secondary)]">Nhận xét nhanh</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REMARKS.map((remark) => {
                    const active = selectedRemarks.includes(remark);
                    return (
                      <button
                        key={remark}
                        type="button"
                        onClick={() => toggleRemark(remark)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                          active
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                            : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--primary)]/40'
                        }`}
                      >
                        {remark}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Notes */}
              <div className="grid gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                  <Icon name="mdi:note-text-outline" size={16} />
                  <span>Nhận xét chi tiết</span>
                </label>
                <TextArea
                  value={notes}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                  rows={5}
                  placeholder="Nhập nhận xét chi tiết của bạn..."
                  className="resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 rounded-lg border border-[var(--border)] px-4 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!activeSubmission) return;
                    
                    // Check if it's a workout review (has workoutLogId)
                    if ('workoutLogId' in activeSubmission) {
                      const workoutLogId = activeSubmission.workoutLogId;
                      const completionPercent = score || 0;
                      const feedback = notes || selectedRemarks.join('\n') || '';
                      
                      try {
                        await submitWorkoutReviewMutation.mutateAsync({
                          workoutLogId,
                          data: {
                            completionPercent,
                            feedback,
                          },
                        });
                        onSubmit({ advisorNotes: notes, status: 'reviewed', rating: score, quickRemarks: selectedRemarks });
                        onClose();
                      } catch (error) {
                        // Error đã được xử lý trong hook
                        console.error('Submit workout review error:', error);
                      }
                    } else if ('mealLogId' in activeSubmission) {
                      const completionPercent = score || 0;
                      let commentsPayload = buildMealCommentsPayload();
                      if (commentsPayload.length === 0) {
                        commentsPayload = [`Hoàn thành ${completionPercent}%`];
                      }
                      try {
                        await submitMealReviewMutation.mutateAsync({
                          mealLogId: activeSubmission.mealLogId,
                          data: {
                            completionPercent,
                            comments: commentsPayload,
                          },
                        });
                        onSubmit({
                          advisorNotes: notes,
                          status: 'reviewed',
                          rating: score,
                          quickRemarks: selectedRemarks,
                        });
                        onClose();
                      } catch (error) {
                        console.error('Submit meal review error:', error);
                      }
                    }
                  }}
                  disabled={isSubmitting}
                  className="h-10 rounded-lg bg-[var(--primary)] px-4 font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="mdi:check-circle-outline" size={18} />
                  <span>{isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
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
