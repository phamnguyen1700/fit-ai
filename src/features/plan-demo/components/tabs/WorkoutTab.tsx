'use client';
import React from 'react';
import WorkoutCard from '../WorkoutCard';
import { useGetWorkoutDemoList } from '@/tanstack/hooks/workoutdemo';
import { Icon } from '@/shared/ui/icon';

const WorkoutTab = () => {
  const { data: workoutDemoResponse, isLoading, isError, error } = useGetWorkoutDemoList({
    pageNumber: 1,
    pageSize: 15,
  });

  const workoutPlans = workoutDemoResponse?.data?.data ?? [];
  const errorMessage = workoutDemoResponse?.message ?? (error instanceof Error ? error.message : undefined);

  if (isLoading) {
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
      </div>
    );
  }

  if (!workoutPlans.length) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Chưa có kế hoạch tập luyện nào.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0' }}>
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
    </div>
  );
};

export default WorkoutTab;