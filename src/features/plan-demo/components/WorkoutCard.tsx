import React, { useState } from 'react';
import { Card, Flex, Button } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { WorkoutDemo } from '@/types/workoutdemo';
import WorkoutDetailModal from './WorkoutDetailModal';

interface WorkoutCardProps {
  workoutPlan: WorkoutDemo;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workoutPlan,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalExercises = workoutPlan.days.reduce(
    (acc, day) => acc + day.exercises.length,
    0
  );

  const activeDays = workoutPlan.days.filter((day) => day.exercises.length > 0).length;
  const totalDays = workoutPlan.days.length;

  return (
    <>
      <Card
        className="workout-card"
        style={{
          width: '100%',
          height: '100%',
        }}
        styles={{
          body: { padding: 24 },
        }}
      >
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: 20, 
          fontWeight: 600, 
          color: 'var(--text)' 
        }}>
          {workoutPlan.planName}
        </h2>

        <Flex gap={6} align="center" style={{ marginBottom: 20 }}>
          <Icon
            name={workoutPlan.isDeleted ? 'mdi:close-circle-outline' : 'mdi:check-circle-outline'}
            size={18}
            color={workoutPlan.isDeleted ? 'var(--danger)' : 'var(--success)'}
          />
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: workoutPlan.isDeleted ? 'var(--danger)' : 'var(--success)',
            backgroundColor: workoutPlan.isDeleted ? 'rgba(255, 99, 71, 0.12)' : 'rgba(34, 197, 94, 0.12)',
            padding: '4px 10px',
            borderRadius: 999,
          }}>
            {workoutPlan.isDeleted ? 'Đã ẩn' : 'Đang hoạt động'}
          </span>
        </Flex>

        {/* Summary Stats */}
        <Flex gap={16} style={{ marginBottom: 20 }}>
          <Flex gap={8} align="center">
            <Icon name="mdi:calendar-check" size={20} color="var(--primary)" />
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {totalDays} ngày ({activeDays} ngày có bài tập)
            </span>
          </Flex>
          <Flex gap={8} align="center">
            <Icon name="mdi:dumbbell" size={20} color="var(--warning)" />
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {totalExercises} bài tập
            </span>
          </Flex>
        </Flex>

        {/* View Details Button */}
        <Button
          variant="primary"
          block
          onClick={() => setIsModalOpen(true)}
          icon={<Icon name="mdi:eye" size={18} />}
        >
          Xem chi tiết
        </Button>
      </Card>

      {/* Detail Modal */}
      <WorkoutDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName={workoutPlan.planName}
        workouts={workoutPlan.days}
      />
    </>
  );
};

export default WorkoutCard;
