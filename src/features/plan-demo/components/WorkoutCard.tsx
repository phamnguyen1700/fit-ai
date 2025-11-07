import React, { useState } from 'react';
import { Card, Flex, Button } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { WorkoutPlanCreation } from '@/types/plan';
import WorkoutDetailModal from './WorkoutDetailModal';

interface WorkoutCardProps {
  workoutPlan: WorkoutPlanCreation;
  exerciseCategories?: { id: string; name: string }[];
  exercises?: { id: string; name: string; categoryId: string }[];
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workoutPlan,
  exerciseCategories = [],
  exercises = [],
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Count total sessions and exercises
  const totalSessions = workoutPlan.workouts.reduce((acc, day) => {
    const sessionNames = new Set(day.exercises.map((ex) => ex.sessionName));
    return acc + sessionNames.size;
  }, 0);

  const totalExercises = workoutPlan.workouts.reduce(
    (acc, day) => acc + day.exercises.length,
    0
  );

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
        {/* Plan Name */}
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: 20, 
          fontWeight: 600, 
          color: 'var(--text)' 
        }}>
          {workoutPlan.planName}
        </h2>

        {/* Goal */}
        {workoutPlan.goal && (
          <Flex gap={8} align="center" style={{ marginBottom: 20 }}>
            <Icon name="mdi:target" size={18} color="var(--primary)" />
            <span style={{ fontSize: 14, color: 'var(--text)' }}>
              {workoutPlan.goal}
            </span>
          </Flex>
        )}

        {/* Summary Stats */}
        <Flex gap={16} style={{ marginBottom: 20 }}>
          <Flex gap={8} align="center">
            <Icon name="mdi:calendar-check" size={20} color="var(--primary)" />
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {workoutPlan.workouts.length} ngày
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
        workouts={workoutPlan.workouts}
        exerciseCategories={exerciseCategories}
        exercises={exercises}
      />
    </>
  );
};

export default WorkoutCard;
