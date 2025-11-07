'use client';

import React, { useMemo } from 'react';
import { Row, Col } from '@/shared/ui';
import type { Plan } from '@/types/plan';

interface WorkoutTabProps {
  plans: Plan[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const WorkoutTab: React.FC<WorkoutTabProps> = ({ plans }) => {
  const workoutPlans = useMemo(() => {
    return plans.filter(plan => plan.planType === 'workout');
  }, [plans]);

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Workout Plans Table or List */}
      <div style={{ 
        backgroundColor: 'var(--bg)', 
        border: '1px solid var(--border)', 
        borderRadius: '8px',
        padding: '16px'
      }}>
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
          Danh sách kế hoạch tập luyện
        </h3>
        
        {workoutPlans.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💪</div>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
              Chưa có kế hoạch tập luyện
            </div>
            <div style={{ fontSize: 14 }}>
              Tạo kế hoạch tập luyện mới để bắt đầu.
            </div>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: '12px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}>
            {workoutPlans.map(plan => (
              <div 
                key={plan.id}
                style={{
                  padding: '16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  {plan.planName}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  {plan.userName} • {plan.duration}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutTab;
