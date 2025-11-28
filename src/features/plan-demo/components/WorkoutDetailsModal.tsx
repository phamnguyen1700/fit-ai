'use client';

import React, { useMemo, useState } from 'react';
import { Modal, Button, Flex, Tabs, Input } from '@/shared/ui';
import { Form, InputNumber, Select, Space, Divider } from 'antd';
import { Icon } from '@/shared/ui/icon';
import type { CreatePlanFormData, DayWorkout, WorkoutExercise } from '@/types/plan';
import {
  useGetWorkoutDemoDetail,
  useUpdateWorkoutDemoDetail,
} from '@/tanstack/hooks/workoutdemo';
import { useGetExerciseCategories } from '@/tanstack/hooks/exercisecategory';
import { useGetExercises } from '@/tanstack/hooks/exercise';
import type { Exercise } from '@/types/exercise';
import type { ExerciseCategory } from '@/types/exercisecategory';
import type { UpdateWorkoutDemoDetailPayload } from '@/types/workoutdemo';
import toast from 'react-hot-toast';

interface WorkoutDetailsModalProps {
  open: boolean;
  planData: CreatePlanFormData | null;
  workoutDemoId?: string | null;
  onCancel: () => void;
  onSubmit: (workouts: DayWorkout[]) => void;
}

const normalizeApiArray = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    const data = (payload as Record<string, unknown>).data;
    if (Array.isArray(data)) {
      return data as T[];
    }
  }

  return [];
};

const generateExerciseLocalId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const WorkoutDetailsModal: React.FC<WorkoutDetailsModalProps> = ({
  open,
  planData,
  workoutDemoId,
  onCancel,
  onSubmit,
}) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [dayWorkouts, setDayWorkouts] = useState<Record<number, WorkoutExercise[]>>({});
  const [dayNames, setDayNames] = useState<Record<number, string>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [usesZeroBasedDays, setUsesZeroBasedDays] = useState(false);
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [form] = Form.useForm();

  const { mutateAsync: updateWorkoutDetail, isPending: isUpdating } = useUpdateWorkoutDemoDetail();

  const {
    data: workoutDetailResponse,
    isPending: isDetailPending,
    error: workoutDetailError,
    refetch: refetchWorkoutDetail,
  } = useGetWorkoutDemoDetail(open && workoutDemoId ? workoutDemoId : undefined);

  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetExerciseCategories({
    page: 1,
    pageSize: 200,
  });

  const categories = useMemo<ExerciseCategory[]>(
    () => normalizeApiArray<ExerciseCategory>(categoriesResponse?.data),
    [categoriesResponse?.data]
  );

  const categoryMap = useMemo(() => {
    const map = new Map<string, ExerciseCategory>();
    categories.forEach((category) => {
      map.set(String(category.id), category);
    });
    return map;
  }, [categories]);

  const selectedCategory = selectedCategoryId ? categoryMap.get(selectedCategoryId) : undefined;
  
  // Kiểm tra cardio bằng cả type và name
  const isCardioCategory = React.useMemo(() => {
    if (!selectedCategory) return false;
    
    const typeLower = selectedCategory.type?.toLowerCase() || '';
    const nameLower = selectedCategory.name?.toLowerCase() || '';
    
    const isCardio = typeLower === 'cardio' || nameLower === 'cardio' || nameLower.includes('cardio');
    
    // eslint-disable-next-line no-console
    console.log('Cardio check:', {
      selectedCategory,
      type: selectedCategory.type,
      name: selectedCategory.name,
      isCardio,
    });
    
    return isCardio;
  }, [selectedCategory]);

  const exerciseParams = useMemo(
    () => (selectedCategoryId ? { categoryId: selectedCategoryId } : undefined),
    [selectedCategoryId]
  );

  const {
    data: exercisesResponse,
    isLoading: isExercisesLoading,
  } = useGetExercises(exerciseParams);

  const exercises = useMemo<Exercise[]>(() => {
    const rawExercises = normalizeApiArray<Exercise>(exercisesResponse?.data);

    if (!selectedCategoryId) {
      return [];
    }

    return rawExercises.filter(
      (exercise) => String(exercise.categoryId) === String(selectedCategoryId)
    );
  }, [exercisesResponse?.data, selectedCategoryId]);

  const exerciseMap = useMemo(() => {
    const map = new Map<string, Exercise>();
    exercises.forEach((exercise) => {
      map.set(String(exercise.id), exercise);
    });
    return map;
  }, [exercises]);

  React.useEffect(() => {
    if (open && planData) {
      const initialWorkouts: Record<number, WorkoutExercise[]> = {};
      const initialDayNames: Record<number, string> = {};

      for (let i = 1; i <= planData.totalDays; i++) {
        initialWorkouts[i] = [];
        initialDayNames[i] = '';
      }

      setActiveDay(1);
      setDayWorkouts(initialWorkouts);
      setDayNames(initialDayNames);
      setSelectedCategoryId(undefined);
      setIsPrefilled(false);
      setUsesZeroBasedDays(false);
      form.resetFields();
    }

    if (!open) {
      setIsPrefilled(false);
      setUsesZeroBasedDays(false);
    }
  }, [open, planData, form]);

  React.useEffect(() => {
    if (!open || !planData || !workoutDetailResponse?.data || isPrefilled) return;

    const detail = workoutDetailResponse.data;
    const detailDays = Array.isArray(detail.days) ? detail.days : [];

    if (detailDays.length === 0) {
      setUsesZeroBasedDays(false);
      setIsPrefilled(true);
      return;
    }

    const isZeroBased = detailDays.some((day) => day.day === 0);
    const workoutsByDay: Record<number, WorkoutExercise[]> = {};
    const dayNamesByDay: Record<number, string> = {};

    detailDays.forEach((day, index) => {
      const rawDayNumber = typeof day.day === 'number' ? day.day : index + 1;
      const normalizedDay = isZeroBased ? rawDayNumber + 1 : rawDayNumber;

      if (Number.isNaN(normalizedDay) || normalizedDay < 1) return;

      const exercisesInDay = Array.isArray(day.exercises) ? day.exercises : [];

      const normalizedExercises = exercisesInDay
        .map((exercise, exerciseIndex) => {
          const categoryId = exercise.exerciseCategoryId ?? undefined;
          const exerciseId = exercise.exerciseId ?? undefined;

          if (!categoryId || !exerciseId) {
            return null;
          }

          const sessionName = exercise.sessionName || exercise.category?.name || `Buổi tập ${exerciseIndex + 1}`;

          const normalizedExercise: WorkoutExercise = {
            id: `${normalizedDay}-${exerciseId}-${exerciseIndex}`,
            sessionName,
            categoryId: String(categoryId),
            categoryName: exercise.category?.name ?? undefined,
            exerciseId: String(exerciseId),
            exerciseName: exercise.name ?? undefined,
            minutes: exercise.minutes ?? undefined,
            sets: exercise.sets ?? undefined,
            reps: exercise.reps ?? undefined,
          };

          return normalizedExercise;
        })
        .filter((exercise): exercise is WorkoutExercise => Boolean(exercise));

      workoutsByDay[normalizedDay] = normalizedExercises;
      dayNamesByDay[normalizedDay] = day.dayName ?? '';
    });

    const filledWorkouts: Record<number, WorkoutExercise[]> = {};
    const filledDayNames: Record<number, string> = {};

    for (let i = 1; i <= planData.totalDays; i++) {
      filledWorkouts[i] = workoutsByDay[i] ?? [];
      filledDayNames[i] = dayNamesByDay[i] ?? '';
    }

    setDayWorkouts(filledWorkouts);
    setDayNames(filledDayNames);
    setUsesZeroBasedDays(isZeroBased);
    setIsPrefilled(true);
  }, [open, planData, workoutDetailResponse, isPrefilled]);

  // Debug: Log khi selectedCategoryId thay đổi
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Selected category changed:', {
      selectedCategoryId,
      selectedCategory,
      isCardioCategory,
      categoryMap: selectedCategoryId ? categoryMap.get(selectedCategoryId) : null,
    });
  }, [selectedCategoryId, selectedCategory, isCardioCategory, categoryMap]);

  const handleAddExercise = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedCategoryId) {
        toast.error('Vui lòng chọn nhóm cơ trước khi thêm bài tập.');
        return;
      }

      const category = categoryMap.get(selectedCategoryId);
      if (!category) {
        toast.error('Không tìm thấy thông tin nhóm cơ đã chọn.');
        return;
      }

      const exercise = exerciseMap.get(String(values.exerciseId));
      if (!exercise) {
        toast.error('Vui lòng chọn bài tập hợp lệ.');
        return;
      }

      const newExercise: WorkoutExercise = {
        id: generateExerciseLocalId(),
        sessionName: values.sessionName,
        categoryId: String(category.id),
        categoryName: category.name,
        exerciseId: String(exercise.id),
        exerciseName: exercise.name,
        minutes: values.minutes ?? undefined,
        sets: !isCardioCategory ? values.sets : undefined,
        reps: !isCardioCategory ? values.reps : undefined,
      };

      setDayWorkouts((prev) => ({
        ...prev,
        [activeDay]: [...(prev[activeDay] || []), newExercise],
      }));

      form.resetFields(['sessionName', 'exerciseId', 'sets', 'reps', 'minutes']);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setDayWorkouts((prev) => ({
      ...prev,
      [activeDay]: prev[activeDay].filter((exercise) => exercise.id !== exerciseId),
    }));
  };

  const handleSubmitAll = async () => {
    if (!workoutDemoId) {
      toast.error('Thiếu mã kế hoạch. Vui lòng tạo lại kế hoạch.');
      return;
    }

    const orderedEntries = Object.entries(dayWorkouts)
      .map(([day, exercises]) => ({ day: parseInt(day, 10), exercises }))
      .sort((a, b) => a.day - b.day);

    const workouts: DayWorkout[] = orderedEntries.map(({ day, exercises }) => ({
      day,
      dayName: dayNames[day] || undefined,
      exercises,
    }));

    const payload: UpdateWorkoutDemoDetailPayload = workouts.map((workoutDay) => ({
      day: usesZeroBasedDays ? Math.max(workoutDay.day - 1, 0) : workoutDay.day,
      dayName: workoutDay.dayName,
      exercises: workoutDay.exercises
        .filter((exercise) => exercise.exerciseId && exercise.categoryId)
        .map((exercise) => ({
          exerciseId: exercise.exerciseId,
          exerciseCategoryId: exercise.categoryId,
          sets: exercise.sets,
          reps: exercise.reps,
          minutes: exercise.minutes,
        })),
    }));

    const totalExercises = payload.reduce((sum, day) => sum + day.exercises.length, 0);
    if (totalExercises === 0) {
      toast.error('Vui lòng thêm ít nhất một bài tập trước khi lưu.');
      return;
    }

    const response = await updateWorkoutDetail({ workoutDemoId, payload });

    if (response.success) {
      onSubmit(workouts);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setDayWorkouts({});
    setDayNames({});
    setSelectedCategoryId(undefined);
    setIsPrefilled(false);
    setUsesZeroBasedDays(false);
    onCancel();
  };

  const handleDayNameChange = (value: string) => {
    setDayNames((prev) => ({
      ...prev,
      [activeDay]: value,
    }));
  };

  if (!planData) return null;

  const dayTabs = Array.from({ length: planData.totalDays }, (_, index) => ({
    key: String(index + 1),
    label: `Ngày ${index + 1}`,
  }));

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: String(category.id),
  }));

  const exerciseOptions = selectedCategoryId
    ? exercises.map((exercise) => ({
        label: exercise.name,
        value: String(exercise.id),
      }))
    : [];

  const currentDayExercises = dayWorkouts[activeDay] || [];
  const isLoadingDetail = isDetailPending && !isPrefilled;
  const detailErrorMessage = workoutDetailError instanceof Error ? workoutDetailError.message : undefined;

  return (
    <Modal
      title={`Chi tiết kế hoạch: ${planData.planName}`}
      isOpen={open}
      onClose={handleCancel}
      size="lg"
    >
      {isLoadingDetail ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200,
            fontSize: 16,
            color: 'var(--text-secondary)',
          }}
        >
          Đang tải chi tiết kế hoạch...
        </div>
      ) : detailErrorMessage ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 220,
            padding: 24,
            textAlign: 'center',
            color: 'var(--danger)',
            gap: 16,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600 }}>Không thể tải chi tiết kế hoạch</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{detailErrorMessage}</div>
          <Button
            variant="primary"
            size="md"
            onClick={() => refetchWorkoutDetail()}
            icon={<Icon name="mdi:reload" size={18} />}
          >
            Thử lại
          </Button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <Tabs
              activeKey={String(activeDay)}
              items={dayTabs}
              onChange={(key) => setActiveDay(parseInt(key, 10))}
              size="large"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
              Thông tin ngày {activeDay}
            </h4>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--text)',
                }}
              >
                Tên ngày tập
              </label>
              <Input
                placeholder="Ví dụ: Tập giãn cơ, Tập ngực, Tập chân..."
                size="large"
                value={dayNames[activeDay] || ''}
                onChange={(event) => handleDayNameChange(event.target.value)}
                prefix={<Icon name="mdi:calendar-text" size={18} color="var(--text-secondary)" />}
              />
              <div
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                }}
              >
                Đặt tên cho ngày tập này để dễ phân biệt
              </div>
            </div>

            <Divider style={{ margin: '24px 0' }} />

            <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
              Thêm bài tập
            </h4>

            <Form form={form} layout="vertical">
              <Form.Item
                label="Tên buổi tập"
                name="sessionName"
                rules={[{ required: true, message: 'Vui lòng nhập tên buổi tập' }]}
              >
                <Input placeholder="Ví dụ: Buổi tập ngực / Tập chân" size="large" />
              </Form.Item>

              <Form.Item
                label="Nhóm cơ / Loại bài tập"
                name="categoryId"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}
              >
                <Select
                  placeholder="Chọn nhóm cơ"
                  size="large"
                  options={categoryOptions}
                  loading={isLoadingCategories}
                  onChange={(value) => {
                    setSelectedCategoryId(value);
                    form.setFieldsValue({
                      exerciseId: undefined,
                      sets: undefined,
                      reps: undefined,
                      minutes: undefined,
                    });
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Bài tập"
                name="exerciseId"
                rules={[{ required: true, message: 'Vui lòng chọn bài tập' }]}
              >
                <Select
                  placeholder={selectedCategoryId ? 'Chọn bài tập' : 'Vui lòng chọn nhóm cơ trước'}
                  size="large"
                  options={exerciseOptions}
                  loading={isExercisesLoading}
                  disabled={!selectedCategoryId}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>

              {isCardioCategory ? (
                <div>
                  <Form.Item
                    label={
                      <Flex gap={6} align="center">
                        <Icon name="mdi:timer-outline" size={18} color="var(--primary)" />
                        <span>Thời gian tập (phút)</span>
                      </Flex>
                    }
                    name="minutes"
                    rules={[
                      { required: true, message: 'Vui lòng nhập thời gian tập' },
                      { type: 'number', min: 1, max: 180, message: 'Thời gian phải từ 1 đến 180 phút' },
                    ]}
                    extra="Nhập thời gian tập luyện cho bài tập cardio (tính bằng phút)"
                  >
                    <InputNumber
                      placeholder="Ví dụ: 30"
                      size="large"
                      style={{ width: '100%' }}
                      min={1}
                      max={180}
                      addonAfter={
                        <Flex gap={4} align="center">
                          <Icon name="mdi:clock-outline" size={16} color="var(--text-secondary)" />
                          <span>phút</span>
                        </Flex>
                      }
                    />
                  </Form.Item>
                </div>
              ) : (
                <Space size="middle" style={{ width: '100%' }}>
                  <Form.Item
                    label="Sets (Hiệp)"
                    name="sets"
                    rules={[
                      { required: true, message: 'Nhập số sets' },
                      { type: 'number', min: 1, max: 10, message: '1-10 sets' },
                    ]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <InputNumber
                      placeholder="Sets"
                      size="large"
                      style={{ width: '100%' }}
                      min={1}
                      max={10}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Reps (Lần)"
                    name="reps"
                    rules={[
                      { required: true, message: 'Nhập số reps' },
                      { type: 'number', min: 1, max: 100, message: '1-100 reps' },
                    ]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <InputNumber
                      placeholder="Reps"
                      size="large"
                      style={{ width: '100%' }}
                      min={1}
                      max={100}
                    />
                  </Form.Item>
                </Space>
              )}

              <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddExercise}
                  icon={<Icon name="mdi:plus" size={18} />}
                  style={{ width: '100%' }}
                  disabled={isLoadingCategories || (!selectedCategoryId && !isLoadingCategories)}
                >
                  Thêm bài tập
                </Button>
              </Form.Item>
            </Form>
          </div>

          <Divider />

          <div style={{ marginBottom: 24 }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                Danh sách bài tập ({currentDayExercises.length})
              </h4>
              {dayNames[activeDay] && (
                <div
                  style={{
                    fontSize: 14,
                    color: 'var(--primary)',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Icon name="mdi:label" size={16} />
                  {dayNames[activeDay]}
                </div>
              )}
            </Flex>

            {currentDayExercises.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: 40,
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 8,
                }}
              >
                <Icon name="mdi:dumbbell" size={48} color="var(--text-tertiary)" />
                <div style={{ marginTop: 12 }}>Chưa có bài tập nào</div>
              </div>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {currentDayExercises.map((exercise, index) => {
                  const displayCategory =
                    exercise.categoryName || categoryMap.get(exercise.categoryId)?.name || '—';
                  const displayExercise =
                    exercise.exerciseName || exerciseMap.get(exercise.exerciseId)?.name || '—';

                  return (
                    <div
                      key={exercise.id}
                      style={{
                        padding: 16,
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        backgroundColor: 'var(--bg)',
                      }}
                    >
                      <Flex justify="space-between" align="flex-start">
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>
                            {index + 1}. {exercise.sessionName}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                            <span>{displayCategory}</span>
                            <span style={{ margin: '0 8px' }}>•</span>
                            <span>{displayExercise}</span>
                          </div>
                          <div
                            style={{
                              marginTop: 8,
                              color: 'var(--primary)',
                              fontWeight: 500,
                              fontSize: 14,
                            }}
                          >
                            {exercise.minutes
                              ? `${exercise.minutes} phút`
                              : `${exercise.sets ?? 0} sets × ${exercise.reps ?? 0} reps`}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          danger
                          onClick={() => handleRemoveExercise(exercise.id)}
                        >
                          <Icon name="mdi:delete-outline" size={18} />
                        </Button>
                      </Flex>
                    </div>
                  );
                })}
              </Space>
            )}
          </div>

          <Flex gap={12} justify="flex-end" style={{ marginTop: 32 }}>
            <Button variant="secondary" size="md" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmitAll}
              disabled={
                Object.values(dayWorkouts).every((exercises) => exercises.length === 0) ||
                !workoutDemoId ||
                isLoadingDetail ||
                Boolean(detailErrorMessage)
              }
              loading={isUpdating}
            >
              Hoàn thành và lưu kế hoạch
            </Button>
          </Flex>
        </>
      )}
    </Modal>
  );
};

export default WorkoutDetailsModal;
