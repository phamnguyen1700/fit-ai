'use client';

import React, { useState } from 'react';
import { Modal, Button, Flex, Tabs, Input, Select } from '@/shared/ui';
import { Form, InputNumber, Space, Divider } from 'antd';
import { Icon } from '@/shared/ui/icon';
import type { CreatePlanFormData, DayWorkout, WorkoutExercise } from '@/types/plan';
import { exerciseCategories, getExercisesByCategory, getCategoryById, getExerciseById } from '../data/exerciseData';

interface WorkoutDetailsModalProps {
  open: boolean;
  planData: CreatePlanFormData | null;
  onCancel: () => void;
  onSubmit: (workouts: DayWorkout[]) => void;
}

export const WorkoutDetailsModal: React.FC<WorkoutDetailsModalProps> = ({
  open,
  planData,
  onCancel,
  onSubmit,
}) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [dayWorkouts, setDayWorkouts] = useState<Record<number, WorkoutExercise[]>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [form] = Form.useForm();

  // Reset when modal opens/closes
  React.useEffect(() => {
    if (open && planData) {
      setActiveDay(1);
      setSelectedCategoryId(undefined);
      // Initialize empty workouts for each day
      const initialWorkouts: Record<number, WorkoutExercise[]> = {};
      for (let i = 1; i <= planData.totalDays; i++) {
        initialWorkouts[i] = [];
      }
      setDayWorkouts(initialWorkouts);
    }
  }, [open, planData]);

  const handleAddExercise = async () => {
    try {
      const values = await form.validateFields();
      
      const category = getCategoryById(values.categoryId);
      if (!category) return;

      const newExercise: WorkoutExercise = {
        id: `${Date.now()}-${Math.random()}`,
        sessionName: values.sessionName,
        categoryId: values.categoryId,
        exerciseId: values.exerciseId,
        ...(category.type === 'cardio'
          ? { minutes: values.minutes }
          : { sets: values.sets, reps: values.reps }),
      };

      setDayWorkouts(prev => ({
        ...prev,
        [activeDay]: [...(prev[activeDay] || []), newExercise],
      }));

      form.resetFields();
      setSelectedCategoryId(undefined);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setDayWorkouts(prev => ({
      ...prev,
      [activeDay]: prev[activeDay].filter(ex => ex.id !== exerciseId),
    }));
  };

  const handleSubmitAll = () => {
    const workouts: DayWorkout[] = Object.entries(dayWorkouts).map(([day, exercises]) => ({
      day: parseInt(day),
      exercises,
    }));
    onSubmit(workouts);
  };

  const handleCancel = () => {
    form.resetFields();
    setDayWorkouts({});
    setSelectedCategoryId(undefined);
    onCancel();
  };

  if (!planData) return null;

  // Generate tabs for each day
  const dayTabs = Array.from({ length: planData.totalDays }, (_, i) => ({
    key: String(i + 1),
    label: `Ngày ${i + 1}`,
  }));

  // Watch category to show/hide appropriate fields
  const selectedCategory = selectedCategoryId ? getCategoryById(selectedCategoryId) : null;
  const isCardio = selectedCategory?.type === 'cardio';

  // Get exercises for selected category
  const availableExercises = selectedCategoryId
    ? getExercisesByCategory(selectedCategoryId).map(ex => ({
        label: ex.name,
        value: ex.id,
      }))
    : [];

  // Category options
  const categoryOptions = exerciseCategories.map(cat => ({
    label: cat.name,
    value: cat.id,
  }));

  // Current day's exercises
  const currentDayExercises = dayWorkouts[activeDay] || [];

  return (
    <Modal
      title={`Chi tiết kế hoạch: ${planData.planName}`}
      isOpen={open}
      onClose={handleCancel}
      size="lg"
    >
      <div style={{ marginBottom: 16 }}>
        <Tabs
          activeKey={String(activeDay)}
          items={dayTabs}
          onChange={(key) => setActiveDay(parseInt(key))}
          size="large"
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
          Thêm bài tập cho ngày {activeDay}
        </h4>

        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên buổi tập"
            name="sessionName"
            rules={[{ required: true, message: 'Vui lòng nhập tên buổi tập' }]}
          >
            <Input placeholder="Ví dụ: Buổi sáng, Buổi chiều..." size="large" />
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
              onChange={(value) => {
                setSelectedCategoryId(value);
                // Reset exercise when category changes
                form.setFieldValue('exerciseId', undefined);
              }}
            />
          </Form.Item>

          <Form.Item
            label="Bài tập"
            name="exerciseId"
            rules={[{ required: true, message: 'Vui lòng chọn bài tập' }]}
          >
            <Select
              placeholder="Chọn bài tập"
              size="large"
              options={availableExercises}
              disabled={!selectedCategoryId}
            />
          </Form.Item>

          {isCardio ? (
            <Form.Item
              label="Số phút"
              name="minutes"
              rules={[
                { required: true, message: 'Vui lòng nhập số phút' },
                { type: 'number', min: 1, max: 180, message: 'Số phút phải từ 1 đến 180' },
              ]}
            >
              <InputNumber
                placeholder="Nhập số phút"
                size="large"
                style={{ width: '100%' }}
                min={1}
                max={180}
                addonAfter="phút"
              />
            </Form.Item>
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
            >
              Thêm bài tập
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Divider />

      {/* List of exercises for current day */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
          Danh sách bài tập ngày {activeDay} ({currentDayExercises.length})
        </h4>

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
              const category = getCategoryById(exercise.categoryId);
              const exerciseInfo = getExerciseById(exercise.exerciseId);
              
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
                        <span>{category?.name}</span>
                        <span style={{ margin: '0 8px' }}>•</span>
                        <span>{exerciseInfo?.name}</span>
                      </div>
                      <div
                        style={{
                          marginTop: 8,
                          color: 'var(--primary)',
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        {category?.type === 'cardio'
                          ? `${exercise.minutes} phút`
                          : `${exercise.sets} sets × ${exercise.reps} reps`}
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

      {/* Footer buttons */}
      <Flex gap={12} justify="flex-end" style={{ marginTop: 32 }}>
        <Button variant="secondary" size="md" onClick={handleCancel}>
          Hủy
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleSubmitAll}
          disabled={Object.values(dayWorkouts).every(exercises => exercises.length === 0)}
        >
          Hoàn thành và lưu kế hoạch
        </Button>
      </Flex>
    </Modal>
  );
};

export default WorkoutDetailsModal;
