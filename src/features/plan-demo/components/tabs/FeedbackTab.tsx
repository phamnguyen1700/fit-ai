'use client';

import React, { useMemo, useState } from 'react';
import { Row, Col, Pagination } from '@/shared/ui';
import { PlanCard } from '../PlanCard';
import type { Plan } from '@/types/plan';

interface FeedbackTabProps {
  plans: Plan[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const FeedbackTab: React.FC<FeedbackTabProps> = ({ 
  plans, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filter plans with good feedback (rating >= 4)
  const feedbackPlans = useMemo(() => {
    return plans.filter(plan => 
      plan.hasFeedback && 
      plan.feedbackRating && 
      plan.feedbackRating >= 4
    );
  }, [plans]);

  // Paginate filtered plans
  const paginatedPlans = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return feedbackPlans.slice(startIndex, endIndex);
  }, [feedbackPlans, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Plans Grid with PlanCard */}
      <Row gutter={[24, 24]}>
        {paginatedPlans.map((plan) => (
          <Col key={plan.id} xs={24} sm={24} md={12} lg={12} xl={12}>
            <PlanCard
              {...plan}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {feedbackPlans.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
          <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
            Chưa có plan nào có feedback tốt
          </div>
          <div style={{ fontSize: 14 }}>
            Các plan có đánh giá từ 4 sao trở lên sẽ hiển thị ở đây.
          </div>
        </div>
      )}

      {/* Pagination */}
      {feedbackPlans.length > pageSize && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 32,
          }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(feedbackPlans.length / pageSize)}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default FeedbackTab;
