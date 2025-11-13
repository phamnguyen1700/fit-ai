'use client';

import React, { useMemo, useState } from 'react';
import WorkoutCard from '../WorkoutCard';
import { useGetWorkoutDemoList } from '@/tanstack/hooks/workoutdemo';
import { Icon } from '@/shared/ui/icon';
import { Flex, Pagination } from '@/shared/ui';

const WorkoutTab = () => {
  const PAGE_SIZE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const listParams = useMemo(
    () => ({
      pageNumber: currentPage,
      pageSize: PAGE_SIZE,
    }),
    [currentPage]
  );

  const {
    data: workoutDemoResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetWorkoutDemoList(listParams);

  const workoutPlans = workoutDemoResponse?.data?.data ?? [];
  const totalRecords = workoutDemoResponse?.data?.totalRecords ?? workoutPlans.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const showPagination = totalPages > 1;
  const errorMessage = workoutDemoResponse?.message ?? (error instanceof Error ? error.message : undefined);

  if (isLoading && !isFetching) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Icon name="mdi:loading" size={32} color="var(--primary)" />
        <p style={{ marginTop: 8 }}>Đang tải kế hoạch tập luyện...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--danger)' }}>
        <p>Không thể tải kế hoạch tập luyện.</p>
        {errorMessage && <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>{errorMessage}</p>}
        <Flex justify="center" style={{ marginTop: 16 }}>
          <button
            type="button"
            onClick={() => refetch()}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Thử lại
          </button>
        </Flex>
      </div>
    );
  }

  if (!workoutPlans.length && !isFetching) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Chưa có kế hoạch tập luyện nào.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0' }}>
      {isFetching && (
        <div style={{ textAlign: 'center', marginBottom: 16, color: 'var(--text-secondary)' }}>
          <Icon name="mdi:loading" size={24} color="var(--primary)" />
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {workoutPlans.map((plan) => (
          <WorkoutCard
            key={plan.workoutDemoId}
            workoutPlan={plan}
          />
        ))}
      </div>

      {showPagination && (
        <Flex justify="center" style={{ marginTop: 24 }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showPageNumbers
          />
        </Flex>
      )}
    </div>
  );
};

export default WorkoutTab;
