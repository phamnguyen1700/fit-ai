"use client";
import React from 'react';
import { Card, Avatar, Badge, Progress } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { WorkoutPlan } from '@/types/workoutPlan';

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
  onView?: (planId: string) => void;
  onEdit?: (planId: string) => void;
  onDelete?: (planId: string) => void;
}

export const WorkoutPlanCard: React.FC<WorkoutPlanCardProps> = ({
  plan,
  onView,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      active: '#52c41a',
      completed: '#1890ff',
      pending: '#faad14',
      cancelled: '#ff4d4f',
    };
    return colors[status as keyof typeof colors] || '#d9d9d9';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'Đang hoạt động',
      completed: 'Hoàn thành',
      pending: 'Chờ xử lý',
      cancelled: 'Đã hủy',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPlanTypeLabel = (type: string) => {
    const labels = {
      workout: 'Tập luyện',
      meal: 'Dinh dưỡng',
      combined: 'Tổng hợp',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPlanTypeIcon = (type: string) => {
    const icons = {
      workout: 'mdi:dumbbell',
      meal: 'mdi:food-apple',
      combined: 'mdi:clipboard-list',
    };
    return icons[type as keyof typeof icons] || 'mdi:clipboard-list';
  };

  return (
    <Card
      className="workout-plan-card hover:shadow-lg transition-all duration-300"
      style={{ cursor: 'pointer' }}
    >
      <div className="flex flex-col gap-4">
        {/* Header: User Info & Status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              size={48}
              src={plan.userAvatar}
              style={{ backgroundColor: '#ff8c00' }}
            >
              {plan.userName?.charAt(0) || 'U'}
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-[var(--text)]">
                {plan.userName || 'Unknown User'}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                {plan.userEmail}
              </span>
            </div>
          </div>
          <Badge
            color={getStatusColor(plan.status)}
            text={getStatusLabel(plan.status)}
            style={{ fontSize: '11px' }}
          />
        </div>

        {/* Plan Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Icon name={getPlanTypeIcon(plan.planType)} size={20} color="var(--primary)" />
            <h3 className="font-semibold text-base text-[var(--text)] flex-1">
              {plan.planName}
            </h3>
            <Badge
              text={getPlanTypeLabel(plan.planType)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--primary)',
                fontSize: '11px',
              }}
            />
          </div>

          {plan.goal && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Icon name="mdi:target" size={16} />
              <span>{plan.goal}</span>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-1">
              <Icon name="mdi:calendar" size={14} />
              <span>{plan.duration || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="mdi:robot" size={14} />
              <span>{plan.generatedBy === 'ai' ? 'AI' : 'Manual'}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        {typeof plan.progress === 'number' && (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Tiến độ</span>
              <span className="font-semibold text-[var(--primary)]">{plan.progress}%</span>
            </div>
            <Progress
              percent={plan.progress}
              showInfo={false}
              strokeColor="var(--primary)"
              size="small"
            />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-[var(--bg-secondary)] rounded-lg">
          {plan.planType === 'workout' || plan.planType === 'combined' ? (
            <>
              <div className="flex flex-col">
                <span className="text-xs text-[var(--text-secondary)]">Tổng ngày tập</span>
                <span className="font-semibold text-[var(--text)]">
                  {plan.totalWorkoutDays || 0} ngày
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[var(--text-secondary)]">Đã hoàn thành</span>
                <span className="font-semibold text-[var(--text)]">
                  {plan.workoutsCompleted || 0} ngày
                </span>
              </div>
            </>
          ) : null}

          {plan.planType === 'meal' && (
            <>
              <div className="flex flex-col">
                <span className="text-xs text-[var(--text-secondary)]">Tổng ngày ăn</span>
                <span className="font-semibold text-[var(--text)]">
                  {plan.totalMealDays || 0} ngày
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[var(--text-secondary)]">Đã hoàn thành</span>
                <span className="font-semibold text-[var(--text)]">
                  {plan.mealsCompleted || 0} ngày
                </span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView?.(plan.id);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          >
            <Icon name="mdi:eye" size={16} />
            Xem chi tiết
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(plan.id);
            }}
            className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          >
            <Icon name="mdi:pencil" size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(plan.id);
            }}
            className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Icon name="mdi:delete" size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default WorkoutPlanCard;
