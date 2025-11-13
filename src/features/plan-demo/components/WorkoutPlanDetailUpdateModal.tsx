'use client';

import React from 'react';
import { Modal, Button, Flex, Card } from '@/shared/ui';
import { Form, InputNumber, Input, Select } from 'antd';
import { Icon } from '@/shared/ui/icon';
import type { WorkoutDemoDay } from '@/types/workoutdemo';
import type { UpdateWorkoutDemoExercisePayload, UpdateWorkoutDemoDayPayload } from '@/types/workoutdemo';
import { useUpdateWorkoutDemoDay } from '@/tanstack/hooks/workoutdemo';
import { useGetExerciseCategories } from '@/tanstack/hooks/exercisecategory';
import toast from 'react-hot-toast';

interface WorkoutPlanDetailUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutDemoId: string | null;
  days: WorkoutDemoDay[];
  isLoading?: boolean;
  onUpdated?: () => void;
}

interface FormExerciseValue {
  exerciseId: string;
  exerciseCategoryId: string;
  name?: string | null;
  categoryName?: string | null;
  sets?: number | null;
  reps?: number | null;
  minutes?: number | null;
}

interface FormDayValue {
  day: number;
  dayName?: string | null;
  exercises: FormExerciseValue[];
}

const normalizeDays = (days: WorkoutDemoDay[]): FormDayValue[] =>
  days.map((day) => ({
    day: day.day,
    dayName: day.dayName,
    exercises: day.exercises.map((exercise) => {
      // exerciseId: ưu tiên exercise.exerciseId, nếu không có thì dùng exercise.name (vì name có thể là ID)
      const exerciseId = exercise.exerciseId || exercise.name || '';
      // exerciseCategoryId: ưu tiên exercise.exerciseCategoryId, nếu không có thì dùng category.name
      const exerciseCategoryId = exercise.exerciseCategoryId || exercise.category?.name || '';
      
      return {
        exerciseId,
        exerciseCategoryId,
        name: exercise.description || exercise.name || 'Bài tập',
        categoryName: exercise.category?.name ?? null,
        sets: exercise.sets ?? null,
        reps: exercise.reps ?? null,
        minutes: exercise.minutes ?? null,
      };
    }),
  }));

const WorkoutPlanDetailUpdateModal: React.FC<WorkoutPlanDetailUpdateModalProps> = ({
  isOpen,
  onClose,
  workoutDemoId,
  days,
  isLoading,
  onUpdated,
}) => {
  const [form] = Form.useForm<{ days: FormDayValue[] }>();
  const { mutateAsync: updateWorkoutDay, isPending } = useUpdateWorkoutDemoDay();
  const [formDays, setFormDays] = React.useState<FormDayValue[]>([]);
  const normalizedDays = React.useMemo(() => normalizeDays(days), [days]);

  // Fetch exercise categories
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetExerciseCategories({
    page: 1,
    pageSize: 100, // Lấy tất cả categories
  });

  const categoryOptions = React.useMemo(() => {
    // eslint-disable-next-line no-console
    console.log('Categories response:', categoriesResponse);
    
    // Kiểm tra nhiều cấu trúc response có thể
    let categories: any[] = [];
    
    if (categoriesResponse?.data) {
      // Structure: IApiResponse<ExerciseCategoryListResponse>
      // categoriesResponse.data = ExerciseCategoryListResponse = { data: ExerciseCategory[], ... }
      if (categoriesResponse.data && typeof categoriesResponse.data === 'object') {
        if (Array.isArray(categoriesResponse.data)) {
          // Trường hợp data là array trực tiếp
          categories = categoriesResponse.data;
        } else if (Array.isArray(categoriesResponse.data.data)) {
          // Trường hợp data.data là array (đúng structure)
          categories = categoriesResponse.data.data;
        }
      }
    }
    
    // eslint-disable-next-line no-console
    console.log('Parsed categories:', categories);
    // eslint-disable-next-line no-console
    console.log('Category options count:', categories.length);
    
    const options = categories
      .filter((cat) => cat && cat.id)
      .map((cat) => ({
        label: cat.name || cat.id || 'Unknown',
        value: cat.id,
      }));
    
    // eslint-disable-next-line no-console
    console.log('Final category options:', options);
    
    return options;
  }, [categoriesResponse]);

  React.useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setFormDays([]);
      return;
    }

    form.setFieldsValue({
      days: normalizedDays,
    });
    setFormDays(normalizedDays);
  }, [isOpen, normalizedDays, form]);

  const watchedDays = Form.useWatch('days', form);

  React.useEffect(() => {
    if (Array.isArray(watchedDays)) {
      // Đảm bảo day và dayName được giữ nguyên từ normalizedDays gốc
      const mergedDays = watchedDays.map((watchedDay, index) => {
        const originalDay = normalizedDays[index];
        if (originalDay) {
          return {
            ...watchedDay,
            day: originalDay.day,
            dayName: originalDay.dayName,
          };
        }
        return watchedDay;
      });
      setFormDays(mergedDays);
    }
  }, [watchedDays, normalizedDays]);

  const handleCancel = () => {
    form.resetFields();
    setFormDays([]);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // eslint-disable-next-line no-console
      console.log('Submitting workout day update form values:', values);

      if (!workoutDemoId) {
        toast.error('Thiếu mã kế hoạch luyện tập.');
        return;
      }

      const dayValues = values.days ?? [];
      if (!dayValues.length) {
        toast.error('Không có dữ liệu bài tập để cập nhật.');
        return;
      }

      for (const day of dayValues) {
        // Validate day.day có giá trị
        if (typeof day.day !== 'number' || day.day <= 0) {
          // eslint-disable-next-line no-console
          console.error(`Invalid day value:`, day);
          toast.error(`Ngày ${day.day || 'undefined'} không hợp lệ. Vui lòng thử lại.`);
          continue;
        }

        // eslint-disable-next-line no-console
        console.log(`Processing Day ${day.day} - Raw day data:`, day);
        // eslint-disable-next-line no-console
        console.log(`Processing Day ${day.day} - Raw exercises from form:`, day.exercises);
        
        const exercises: UpdateWorkoutDemoExercisePayload[] = (day.exercises ?? [])
          .filter((exercise) => {
            const hasIds = !!(exercise.exerciseId && exercise.exerciseCategoryId);
            if (!hasIds) {
              // eslint-disable-next-line no-console
              console.warn(`Day ${day.day} - Exercise missing IDs:`, {
                exerciseId: exercise.exerciseId,
                exerciseCategoryId: exercise.exerciseCategoryId,
                fullExercise: exercise,
              });
            }
            return hasIds;
          })
          .map((exercise) => {
            const payload = {
              exerciseId: exercise.exerciseId,
              exerciseCategoryId: exercise.exerciseCategoryId,
              sets: exercise.sets ?? 0,
              reps: exercise.reps ?? 0,
              minutes: exercise.minutes ?? 0,
            };
            // eslint-disable-next-line no-console
            console.log(`Day ${day.day} - Exercise payload:`, payload);
            return payload;
          });

        if (!exercises.length) {
          // eslint-disable-next-line no-console
          console.warn(`Day ${day.day} - No valid exercises to update (all missing IDs)`);
          continue;
        }

        const dayPayload: UpdateWorkoutDemoDayPayload = {
          day: day.day,
          dayName: day.dayName ?? undefined,
          exercises,
        };

        // eslint-disable-next-line no-console
        console.log(`Day ${day.day} - Sending payload:`, dayPayload);

        const response = await updateWorkoutDay({
          workoutDemoId,
          dayPayload,
        });

        // eslint-disable-next-line no-console
        console.log(`Day ${day.day} - Update response:`, {
          workoutDemoId,
          dayPayload,
          response,
        });

        if (!response.success) {
          throw new Error(response.message || `Không thể cập nhật bài tập ngày ${day.day}`);
        }
      }

      toast.success('Cập nhật bài tập thành công!');
      onUpdated?.();
      handleCancel();
    } catch (error) {
      if (error && (error as any).errorFields) {
        return;
      }
      console.error('Failed to update workout day details', error);
      toast.error('Không thể cập nhật bài tập. Vui lòng thử lại.');
    }
  };

  const daysValue = formDays;
  const hasDays = daysValue.length > 0;

  return (
    <Modal
      title="Cập nhật bài tập theo ngày"
      isOpen={isOpen}
      onClose={handleCancel}
      size="xl"
    >
      {isLoading && (
        <Flex gap={8} align="center" style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>
          <Icon name="mdi:loading" size={20} color="var(--primary)" />
          <span>Đang tải dữ liệu bài tập...</span>
        </Flex>
      )}

      {!hasDays && !isLoading ? (
        <div style={{ padding: '24px 0', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Không có bài tập nào để cập nhật.
        </div>
      ) : (
        <Form form={form} layout="vertical">
          {daysValue.map((day, dayIndex) => {
            const exercises = day.exercises ?? [];
            const dayLabel = day.dayName?.trim() || `Ngày ${day.day}`;

            return (
              <Card
                key={day.day}
                style={{
                  marginBottom: 16,
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                }}
                styles={{ body: { padding: 20 } }}
              >
                {/* Hidden fields để lưu day và dayName */}
                <Form.Item name={['days', dayIndex, 'day']} hidden>
                  <Input type="hidden" />
                </Form.Item>
                <Form.Item name={['days', dayIndex, 'dayName']} hidden>
                  <Input type="hidden" />
                </Form.Item>

                <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, color: 'var(--text)' }}>{dayLabel}</h3>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
                      Cập nhật thông tin bài tập cho ngày này.
                    </p>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {exercises.length} bài tập
                  </span>
                </Flex>

                {!exercises.length ? (
                  <div style={{ padding: 12, color: 'var(--text-secondary)' }}>
                    Ngày này chưa có bài tập nào.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {exercises.map((exercise, exerciseIndex) => (
                      <div
                        key={`${day.day}-${exercise.exerciseId ?? exerciseIndex}`}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(200px, 2fr) minmax(180px, 1.5fr) repeat(3, minmax(120px, 1fr))',
                          gap: 16,
                          alignItems: 'flex-end',
                          padding: '12px 16px',
                          border: '1px solid var(--border)',
                          borderRadius: 12,
                          backgroundColor: 'var(--bg-secondary)',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                            {exercise.name || 'Bài tập'}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                            {exercise.categoryName || 'Nhóm cơ chưa xác định'}
                          </div>
                        </div>

                        <Form.Item
                          name={['days', dayIndex, 'exercises', exerciseIndex, 'exerciseCategoryId']}
                          label="Nhóm cơ"
                          rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}
                        >
                          <Select
                            placeholder="Chọn nhóm cơ"
                            options={categoryOptions}
                            loading={isCategoriesLoading}
                            showSearch
                            notFoundContent={
                              isCategoriesLoading
                                ? 'Đang tải...'
                                : categoryOptions.length === 0
                                  ? 'Không có dữ liệu nhóm cơ'
                                  : 'Không tìm thấy'
                            }
                            filterOption={(input, option) =>
                              String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                          />
                        </Form.Item>

                        <Form.Item
                          name={['days', dayIndex, 'exercises', exerciseIndex, 'sets']}
                          label="Sets"
                          rules={[{ type: 'number', min: 0, max: 200, message: '0 - 200' }]}
                        >
                          <InputNumber min={0} max={200} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                          name={['days', dayIndex, 'exercises', exerciseIndex, 'reps']}
                          label="Reps"
                          rules={[{ type: 'number', min: 0, max: 500, message: '0 - 500' }]}
                        >
                          <InputNumber min={0} max={500} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                          name={['days', dayIndex, 'exercises', exerciseIndex, 'minutes']}
                          label="Thời gian (phút)"
                          rules={[{ type: 'number', min: 0, max: 300, message: '0 - 300' }]}
                        >
                          <InputNumber min={0} max={300} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                          name={['days', dayIndex, 'exercises', exerciseIndex, 'exerciseId']}
                          hidden
                        >
                          <Input type="hidden" />
                        </Form.Item>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Flex gap={12} justify="flex-end">
              <Button variant="secondary" size="md" onClick={handleCancel} disabled={isPending}>
                Hủy
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                loading={isPending}
                disabled={isPending}
              >
                Hoàn tất
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default WorkoutPlanDetailUpdateModal;

