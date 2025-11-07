'use client';

import React, { useMemo } from 'react';
import type { Plan } from '@/types/plan';

interface MealTabProps {
  plans: Plan[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const MealTab: React.FC<MealTabProps> = ({ plans }) => {
  const mealPlans = useMemo(() => {
    return plans.filter(plan => plan.planType === 'meal');
  }, [plans]);

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Meal Plans Table or List */}
      <div style={{ 
        backgroundColor: 'var(--bg)', 
        border: '1px solid var(--border)', 
        borderRadius: '8px',
        padding: '16px'
      }}>
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
          Danh sách kế hoạch dinh dưỡng
        </h3>
        
        {mealPlans.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
              Chưa có kế hoạch dinh dưỡng
            </div>
            <div style={{ fontSize: 14 }}>
              Tạo kế hoạch dinh dưỡng mới để bắt đầu.
            </div>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: '12px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}>
            {mealPlans.map(plan => (
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

export default MealTab;
