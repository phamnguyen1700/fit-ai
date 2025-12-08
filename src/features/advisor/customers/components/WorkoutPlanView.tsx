'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Icon } from '@/shared/ui/icon';
import { Select } from '@/shared/ui/core/Select';
import { Button } from '@/shared/ui/core/Button';
import { Input } from '@/shared/ui/core/Input';
import { useWorkoutDetails, useUpdateWorkoutExercise } from '@/tanstack/hooks/advisorplan';
import { useGetExercises } from '@/tanstack/hooks/exercise';
import type { WorkoutDetail, Exercise as WorkoutExercise } from '@/types/advisorplan';
import type { Exercise } from '@/types/exercise';

interface WorkoutPlanViewProps {
  userId: string;
  checkpointNumber?: number;
}

export const WorkoutPlanView: React.FC<WorkoutPlanViewProps> = ({ userId, checkpointNumber }) => {
  const { data: workoutData, isLoading, error } = useWorkoutDetails({
    userId,
    checkpointNumber,
  });

  const workouts = workoutData?.data || [];

  // Group workouts by day
  const { workoutsByDay, sortedDays } = useMemo(() => {
    const grouped = workouts.reduce((acc, workout) => {
      if (!acc[workout.dayNumber]) {
        acc[workout.dayNumber] = [];
      }
      acc[workout.dayNumber].push(workout);
      return acc;
    }, {} as Record<number, WorkoutDetail[]>);

    const sorted = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b);

    return { workoutsByDay: grouped, sortedDays: sorted };
  }, [workouts]);

  // State for selected day
  const [selectedDay, setSelectedDay] = useState<number | null>(
    sortedDays.length > 0 ? sortedDays[0] : null
  );

  // State for edit mode - track which exercise is being edited: { workoutDetailId, exerciseId }
  const [editingExercise, setEditingExercise] = useState<{ workoutDetailId: string; exerciseId: string } | null>(null);
  const [editExerciseData, setEditExerciseData] = useState<WorkoutExercise | null>(null);
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');

  const { mutate: updateExercise, isPending: isUpdating } = useUpdateWorkoutExercise();

  // Fetch all exercises for base list (when in edit mode)
  const { data: baseExercisesData, isFetching: isLoadingBaseExercises } = useGetExercises(
    undefined,
    {
      enabled: Boolean(editingExercise), // Only fetch when editing
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch exercises with search term
  const searchParams = useMemo(() => {
    if (exerciseSearchTerm.trim().length < 2) {
      return undefined;
    }
    return { search: exerciseSearchTerm.trim() };
  }, [exerciseSearchTerm]);

  const { data: searchExercisesData, isFetching: isSearchingExercises } = useGetExercises(
    searchParams,
    {
      enabled: Boolean(editingExercise) && Boolean(searchParams), // Only fetch when editing and has search term
      staleTime: 60 * 1000,
    }
  );

  // Prepare exercise options - use search results if available, otherwise use base list
  const exerciseOptions = useMemo(() => {
    const baseExercises = baseExercisesData?.data || [];
    const searchExercises = searchExercisesData?.data || [];
    const exercises = searchParams ? searchExercises : baseExercises;

    return exercises.map((exercise: Exercise) => ({
      label: exercise.name,
      value: exercise.id,
      exercise: exercise,
    }));
  }, [baseExercisesData, searchExercisesData, searchParams]);

  const isLoadingExercises = isLoadingBaseExercises || isSearchingExercises;

  // Update selectedDay when sortedDays changes
  React.useEffect(() => {
    if (sortedDays.length > 0) {
      if (selectedDay === null || !sortedDays.includes(selectedDay)) {
        setSelectedDay(sortedDays[0]);
      }
    }
  }, [sortedDays]);

  // Reset edit mode when selectedDay changes
  const prevSelectedDayRef = React.useRef<number | null>(selectedDay);
  useEffect(() => {
    if (prevSelectedDayRef.current !== null && prevSelectedDayRef.current !== selectedDay) {
      setEditingExercise(null);
      setEditExerciseData(null);
    }
    prevSelectedDayRef.current = selectedDay;
  }, [selectedDay]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-[var(--text-secondary)]">Đang tải kế hoạch tập luyện...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <div className="text-sm font-medium text-red-600">Không thể tải kế hoạch tập luyện</div>
        <div className="text-xs text-[var(--text-secondary)]">
          {error instanceof Error ? error.message : 'Vui lòng thử lại sau'}
        </div>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--text-secondary)]">
        Chưa có kế hoạch tập luyện
      </div>
    );
  }

  if (!selectedDay || !workoutsByDay[selectedDay]) {
    return null;
  }

  const dayWorkouts = workoutsByDay[selectedDay];
  const currentIndex = sortedDays.indexOf(selectedDay);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < sortedDays.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      setSelectedDay(sortedDays[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setSelectedDay(sortedDays[currentIndex + 1]);
    }
  };

  const handleStartEditExercise = (workoutDetailId: string, exercise: WorkoutExercise) => {
    // Create a deep copy to avoid reference issues
    setEditingExercise({ workoutDetailId, exerciseId: exercise.exerciseId });
    setEditExerciseData({
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      category: exercise.category || '',
      videoUrl: exercise.videoUrl || '',
      sets: exercise.sets,
      reps: exercise.reps,
      durationMinutes: exercise.durationMinutes || 0,
      note: exercise.note || '',
    });
  };

  const handleCancelEditExercise = () => {
    setEditingExercise(null);
    setEditExerciseData(null);
    setExerciseSearchTerm('');
  };

  const handleSaveExercise = () => {
    if (!editingExercise || !editExerciseData) return;

    const workout = dayWorkouts.find((w) => w.workoutDetailId === editingExercise.workoutDetailId);
    if (!workout) return;

    updateExercise(
      {
        userId,
        workoutDetailId: editingExercise.workoutDetailId,
        data: {
          oldExerciseId: editingExercise.exerciseId,
          newExercise: editExerciseData,
        },
      },
      {
        onSuccess: () => {
          setEditingExercise(null);
          setEditExerciseData(null);
          setExerciseSearchTerm('');
        },
      }
    );
  };

  const handleExerciseFieldChange = (field: keyof WorkoutExercise, value: string | number) => {
    if (!editExerciseData) return;
    setEditExerciseData({
      ...editExerciseData,
      [field]: value,
    });
  };

  const handleSelectNewExercise = (exerciseId: string) => {
    const selectedExerciseOption = exerciseOptions.find((opt) => opt.value === exerciseId);
    if (selectedExerciseOption && editExerciseData) {
      const exercise = selectedExerciseOption.exercise;
      setEditExerciseData({
        exerciseId: exercise.id,
        name: exercise.name,
        category: exercise.categoryName || '',
        videoUrl: exercise.videoUrl || '',
        sets: editExerciseData.sets,
        reps: editExerciseData.reps,
        durationMinutes: editExerciseData.durationMinutes,
        note: editExerciseData.note,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Day Selector */}
      <Card>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary)]/10">
              <Icon name="mdi:calendar-today" size={20} className="text-[var(--primary)]" />
            </div>
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium text-[var(--text)] whitespace-nowrap">Chọn ngày:</span>
              <Select
                value={selectedDay}
                onChange={(value) => setSelectedDay(value as number)}
                className="flex-1 min-w-[140px]"
                options={sortedDays.map((day) => ({
                  label: `Ngày ${day}`,
                  value: day,
                }))}
              />
              <span className="text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap">
                {currentIndex + 1}/{sortedDays.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--bg)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-tertiary)] hover:border-[var(--primary)]/30 transition-all"
              aria-label="Ngày trước"
            >
              <Icon name="mdi:chevron-left" size={22} className="text-[var(--text)]" />
            </button>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--bg)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-tertiary)] hover:border-[var(--primary)]/30 transition-all"
              aria-label="Ngày sau"
            >
              <Icon name="mdi:chevron-right" size={22} className="text-[var(--text)]" />
            </button>
          </div>
        </div>
      </Card>

      {/* Day Content */}
      <Card className="overflow-hidden">
        {/* Day Header */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-[var(--border)]">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary)]/10">
              <Icon name="mdi:calendar-today" size={20} className="text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--text)]">Ngày {selectedDay}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Checkpoint {dayWorkouts[0]?.checkpointNumber}
              </p>
            </div>
          </div>
          {!editingExercise ? (
            <Button
              onClick={() => {
                // Enable edit mode for first exercise if available
                if (dayWorkouts.length > 0 && dayWorkouts[0].exercises.length > 0) {
                  const firstExercise = dayWorkouts[0].exercises[0];
                  handleStartEditExercise(dayWorkouts[0].workoutDetailId, firstExercise);
                }
              }}
              className="flex items-center gap-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
            >
              <Icon name="mdi:pencil" size={16} />
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCancelEditExercise}
                disabled={isUpdating}
                variant="secondary"
                className="flex items-center gap-2"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSaveExercise}
                loading={isUpdating}
                className="flex items-center gap-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
              >
                <Icon name="mdi:check" size={16} />
                Lưu
              </Button>
            </div>
          )}
        </div>

        {/* Workouts List */}
        <div className="flex flex-col gap-5">
          {dayWorkouts.map((workout) => (
            <div
              key={workout.workoutDetailId}
              className="rounded-xl border-2 border-[var(--border)] bg-[var(--bg)] p-5 hover:border-[var(--primary)]/30 transition-colors"
            >
              {/* Session Header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border)]">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary)]/10">
                  <Icon name="mdi:dumbbell" size={18} className="text-[var(--primary)]" />
                </div>
                <span className="text-base font-semibold text-[var(--text)]">{workout.sessionName}</span>
              </div>

              {workout.exercises.length === 0 ? (
                <div className="text-sm text-[var(--text-secondary)] py-4 text-center">
                  Chưa có bài tập
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {workout.exercises.map((exercise, idx) => {
                    const isEditing = editingExercise?.workoutDetailId === workout.workoutDetailId && 
                                     editingExercise?.exerciseId === exercise.exerciseId;
                    const displayExercise = isEditing && editExerciseData ? editExerciseData : exercise;
                    // Create unique key using workoutDetailId + index to handle duplicate exerciseIds
                    const uniqueKey = `${workout.workoutDetailId}-${idx}`;

                    return (
                      <div
                        key={uniqueKey}
                        className="flex items-start justify-between gap-4 p-4 rounded-lg bg-[var(--bg-tertiary)]/50 border border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="flex flex-col gap-3">
                              <Select
                                value={
                                  // Fallback: if exerciseId not found in options, try to find by name
                                  exerciseOptions.find(opt => opt.value === displayExercise.exerciseId) 
                                    ? displayExercise.exerciseId 
                                    : exerciseOptions.find(opt => opt.label === displayExercise.name)?.value || displayExercise.exerciseId
                                }
                                onChange={handleSelectNewExercise}
                                onSearch={setExerciseSearchTerm}
                                showSearch
                                filterOption={false}
                                placeholder="Tìm kiếm bài tập..."
                                className="w-full"
                                loading={isLoadingExercises}
                                notFoundContent={
                                  exerciseSearchTerm.length > 0 && exerciseSearchTerm.length < 2
                                    ? 'Nhập ít nhất 2 ký tự để tìm kiếm'
                                    : isLoadingExercises
                                    ? 'Đang tải...'
                                    : exerciseOptions.length === 0
                                    ? 'Không có bài tập nào. Vui lòng tìm kiếm.'
                                    : 'Không tìm thấy bài tập'
                                }
                                options={exerciseOptions}
                                allowClear={false}
                              />
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                  <label className="block text-xs text-[var(--text-secondary)] mb-1">Sets</label>
                                  <Input
                                    type="number"
                                    value={String(displayExercise.sets)}
                                    onChange={(e) => handleExerciseFieldChange('sets', parseInt(e.target.value) || 0)}
                                    className="w-full"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-[var(--text-secondary)] mb-1">Reps</label>
                                  <Input
                                    type="number"
                                    value={String(displayExercise.reps)}
                                    onChange={(e) => handleExerciseFieldChange('reps', parseInt(e.target.value) || 0)}
                                    className="w-full"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-[var(--text-secondary)] mb-1">Duration (phút)</label>
                                  <Input
                                    type="number"
                                    value={String(displayExercise.durationMinutes)}
                                    onChange={(e) => handleExerciseFieldChange('durationMinutes', parseInt(e.target.value) || 0)}
                                    className="w-full"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-[var(--text-secondary)] mb-1">Category</label>
                                  <Input
                                    value={displayExercise.category}
                                    onChange={(e) => handleExerciseFieldChange('category', e.target.value)}
                                    placeholder="Category"
                                    className="w-full"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-[var(--text-secondary)] mb-1">Note</label>
                                <Input
                                  value={displayExercise.note}
                                  onChange={(e) => handleExerciseFieldChange('note', e.target.value)}
                                  placeholder="Ghi chú"
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-[var(--text-secondary)] mb-1">Video URL</label>
                                <Input
                                  value={displayExercise.videoUrl}
                                  onChange={(e) => handleExerciseFieldChange('videoUrl', e.target.value)}
                                  placeholder="URL video"
                                  className="w-full"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="font-semibold text-[var(--text)] mb-1.5">{displayExercise.name}</div>
                              {displayExercise.category && (
                                <div className="text-xs text-[var(--text-secondary)] mb-3 px-2 py-1 inline-block rounded bg-[var(--bg)]">
                                  {displayExercise.category}
                                </div>
                              )}
                              <div className="flex items-center gap-4 text-sm mb-2">
                                <div className="flex items-center gap-1.5">
                                  <Icon name="mdi:repeat" size={16} className="text-[var(--text-secondary)]" />
                                  <span className="font-medium text-[var(--text)]">{displayExercise.sets}</span>
                                  <span className="text-[var(--text-secondary)]">sets</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Icon name="mdi:counter" size={16} className="text-[var(--text-secondary)]" />
                                  <span className="font-medium text-[var(--text)]">{displayExercise.reps}</span>
                                  <span className="text-[var(--text-secondary)]">reps</span>
                                </div>
                                {displayExercise.durationMinutes > 0 && (
                                  <div className="flex items-center gap-1.5">
                                    <Icon name="mdi:timer-outline" size={16} className="text-[var(--text-secondary)]" />
                                    <span className="font-medium text-[var(--text)]">{displayExercise.durationMinutes}</span>
                                    <span className="text-[var(--text-secondary)]">phút</span>
                                  </div>
                                )}
                              </div>
                              {displayExercise.note && displayExercise.note !== 'string' && (
                                <div className="text-xs text-[var(--text-secondary)] mt-2 italic bg-[var(--bg)] px-2 py-1.5 rounded border-l-2 border-[var(--primary)]/30">
                                  {displayExercise.note}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isEditing ? (
                            <div className="text-xs text-[var(--text-secondary)] px-2 py-1 rounded bg-[var(--primary)]/10">
                              Đang chỉnh sửa
                            </div>
                          ) : (
                            <>
                              <Button
                                onClick={() => handleStartEditExercise(workout.workoutDetailId, exercise)}
                                size="sm"
                                variant="secondary"
                                className="text-xs"
                              >
                                <Icon name="mdi:pencil" size={14} />
                              </Button>
                              {displayExercise.videoUrl && (
                                <a
                                  href={displayExercise.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition-colors"
                                  aria-label="Xem video hướng dẫn"
                                >
                                  <Icon name="mdi:play-circle-outline" size={24} className="text-[var(--primary)]" />
                                </a>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

