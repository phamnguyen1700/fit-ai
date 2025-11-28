'use client';

import React from 'react';
import { Icon } from '@/shared/ui/icon';
import type { WorkoutPlanDayDetail } from '@/types/planreview';

interface WorkoutPlanDayViewProps {
  workout: WorkoutPlanDayDetail;
  dayNumber: number;
}

export const WorkoutPlanDayView: React.FC<WorkoutPlanDayViewProps> = ({ workout, dayNumber }) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
        Kế hoạch tập luyện AI đã gen - Ngày {dayNumber}
      </h3>
      {workout.exercises.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-secondary)]">
          Chưa có bài tập nào cho ngày này
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {workout.exercises.map((exercise, index) => (
            <div
              key={`${exercise.name}-${index}`}
              className="rounded-lg border border-[var(--border)] bg-white p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-[var(--text)]">
                    {exercise.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
                    {exercise.category}
                  </span>
                </div>
                {exercise.videoUrl && (
                  <a
                    href={exercise.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    <Icon name="mdi:play-circle-outline" size={14} />
                    Video
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm font-medium text-[var(--primary)] mb-2">
                {exercise.durationMinutes ? (
                  <>
                    <Icon name="mdi:timer-outline" size={16} />
                    <span>{exercise.durationMinutes} phút</span>
                  </>
                ) : (
                  <>
                    <Icon name="mdi:repeat" size={16} />
                    <span>
                      {exercise.sets} sets × {exercise.reps} reps
                    </span>
                  </>
                )}
              </div>

              {exercise.note && (
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {exercise.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

