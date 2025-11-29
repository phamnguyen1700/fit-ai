"use client";

import React from 'react';

import FeedbackCard from './FeedbackCard';
import { Pagination } from '@/shared/ui/core/Pagination';
import { useFeedbackList } from '@/tanstack/hooks/feedback';
import type { FeedbackItem as ApiFeedbackItem } from '@/types/feedback';

type FeedbackStatus = 'pending' | 'approved' | 'rejected' | 'published';

export interface FeedbackCardsItem {
  id: string;
  userAvatar?: string;
  userName: string;
  date: string;
  rating: number;
  content: string;
  status: FeedbackStatus;
}

interface FeedbackCardsProps {
  feedbacks?: FeedbackCardsItem[];
  state?: number;
  itemsPerPage?: number;
  className?: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  onHide?: (id: string) => void;
  onRestore?: (id: string) => void;
}

const STATUS_MAP: Record<number, FeedbackStatus> = {
  0: 'pending',
  1: 'approved',
  2: 'rejected',
  3: 'published',
};

const fallbackStatus = (state?: number | string): FeedbackStatus => {
  if (typeof state === 'string') {
    const normalized = state.toLowerCase() as FeedbackStatus;
    return ['pending', 'approved', 'rejected', 'published'].includes(normalized)
      ? normalized
      : 'pending';
  }
  return STATUS_MAP[state ?? -1] ?? 'pending';
};

const formatDate = (value?: string): string => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('vi-VN');
};

const fallbackAvatarUrl =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80';

const mapApiItemToCard = (item: ApiFeedbackItem, index: number): FeedbackCardsItem => {
  const avatar =
    (item as { avatarUrl?: string }).avatarUrl ??
    (item as { userAvatar?: string }).userAvatar ??
    fallbackAvatarUrl;

  const name =
    item.userName ??
    (item as { userFullName?: string }).userFullName ??
    (item as { userEmail?: string }).userEmail ??
    'Người dùng ẩn danh';

  const content =
    (item.content as string) ??
    (item as { feedback?: string }).feedback ??
    'Không có nội dung.';

  const stateValue =
    (item as { state?: number }).state ??
    (item as { status?: number | string }).status;

  return {
    id: item.id ?? `feedback-${index}`,
    userAvatar: avatar,
    userName: name,
    date: formatDate((item as { updatedAt?: string }).updatedAt ?? item.createdAt),
    rating:
      typeof item.rating === 'number' && !Number.isNaN(item.rating) ? item.rating : 0,
    content,
    status: fallbackStatus(stateValue),
  };
};

const FeedbackCards: React.FC<FeedbackCardsProps> = ({
  feedbacks,
  state,
  itemsPerPage = 10,
  className = '',
  onApprove,
  onReject,
  onDelete,
  onPublish,
  onHide,
  onRestore,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const effectiveDataProvided = feedbacks && feedbacks.length > 0;

  const queryParams = React.useMemo(
    () => ({
      pageNumber: currentPage,
      pageSize: itemsPerPage,
      state,
    }),
    [currentPage, itemsPerPage, state]
  );

  const { data, isLoading, isError } = useFeedbackList(queryParams);

  const fetchedFeedbacks = React.useMemo(
    () => (data?.data?.items ?? []).map(mapApiItemToCard),
    [data?.data?.items]
  );

  const pagedProvidedFeedbacks = React.useMemo(() => {
    if (!effectiveDataProvided || !feedbacks) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return feedbacks.slice(startIndex, startIndex + itemsPerPage);
  }, [effectiveDataProvided, feedbacks, currentPage, itemsPerPage]);

  const displayFeedbacks = effectiveDataProvided
    ? pagedProvidedFeedbacks
    : fetchedFeedbacks;

  const totalPages = effectiveDataProvided
    ? Math.max(1, Math.ceil((feedbacks?.length ?? 0) / itemsPerPage))
    : Math.max(1, data?.data?.totalPages ?? (fetchedFeedbacks.length > 0 ? 1 : 0));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`feedback-cards-container ${className}`}>
      {isError ? (
        <div className="py-10 text-center text-sm text-red-500">
          Không thể tải danh sách feedback.
        </div>
      ) : isLoading && !effectiveDataProvided ? (
        <div className="py-10 text-center text-sm text-secondary">Đang tải feedback...</div>
      ) : displayFeedbacks.length === 0 ? (
        <div className="py-12 text-center text-gray-500 text-lg">Không có phản hồi nào</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {displayFeedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              id={feedback.id}
              userAvatar={feedback.userAvatar}
              userName={feedback.userName}
              date={feedback.date}
              rating={feedback.rating}
              content={feedback.content}
              status={feedback.status}
              onApprove={onApprove}
              onReject={onReject}
              onDelete={onDelete}
              onPublish={onPublish}
              onHide={onHide}
              onRestore={onRestore}
              className="h-fit"
            />
          ))}
        </div>
      )}

      {displayFeedbacks.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showPageNumbers
            maxVisiblePages={5}
            className="pagination-feedback"
          />
        </div>
      )}
    </div>
  );
};

export default FeedbackCards;
