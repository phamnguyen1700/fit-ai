'use client';

import React from 'react';

import { Card, Col, Row } from '@/shared/ui';
import { FeedbackCard } from '@/shared/ui';
import { useFeedbackList } from '@/tanstack/hooks/feedback';

const FALLBACK_LENGTH = 4;

const mapAvatar = (url?: string) =>
  url ??
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80';

export const FeedbackReport: React.FC = () => {
  const { data, isLoading, isError } = useFeedbackList({
    pageNumber: 1,
    pageSize: FALLBACK_LENGTH,
    state: 0,
  });

  const feedbackItems = data?.data?.items ?? [];

  return (
    <Card
      className="rounded-xl"
      title={<span className="text text-base sm:text-lg font-semibold">Feedback mới</span>}
    >
      {isError ? (
        <div className="py-10 text-center text-sm text-red-500">
          Không thể tải danh sách feedback.
        </div>
      ) : isLoading ? (
        <div className="py-10 text-center text-sm text-secondary">Đang tải feedback...</div>
      ) : feedbackItems.length === 0 ? (
        <div className="py-10 text-center text-sm text-secondary">
          Hiện chưa có feedback nào để hiển thị.
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {feedbackItems.slice(0, FALLBACK_LENGTH).map((item) => (
            <Col key={item.id} xs={24} md={12}>
              <FeedbackCard
                avatarUrl={mapAvatar(item.avatarUrl as string)}
                name={item.userName ?? item.userEmail ?? 'Người dùng'}
                role={item.userEmail ?? 'Khách hàng'}
                rating={item.rating ?? 0}
                content={item.content ?? 'Không có nội dung.'}
              />
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
};

export default FeedbackReport;