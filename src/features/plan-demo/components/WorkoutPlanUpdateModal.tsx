'use client';

import React from 'react';
import { Modal, Input, Select, Button, Flex } from '@/shared/ui';
import { Form, InputNumber } from 'antd';
import type { WorkoutDemoDetail } from '@/types/workoutdemo';
import type { UpdateWorkoutDemoPayload } from '@/types/workoutdemo';
import { useUpdateWorkoutDemo } from '@/tanstack/hooks/workoutdemo';

interface WorkoutPlanUpdateModalProps {
  isOpen: boolean;
  workoutDemoId: string | null;
  initialValues?: Partial<Pick<WorkoutDemoDetail, 'planName' | 'gender' | 'goal' | 'totalDays'>>;
  isLoading?: boolean;
  onClose: () => void;
  onUpdated?: (payload: UpdateWorkoutDemoPayload) => Promise<void> | void;
}

const genderOptions = [
  { label: 'Nam', value: 'male' },
  { label: 'Nữ', value: 'female' },
];

export const WorkoutPlanUpdateModal: React.FC<WorkoutPlanUpdateModalProps> = ({
  isOpen,
  workoutDemoId,
  initialValues,
  isLoading,
  onClose,
  onUpdated,
}) => {
  const [form] = Form.useForm();
  const { mutateAsync: updateWorkoutPlan, isPending } = useUpdateWorkoutDemo();

  React.useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      planName: initialValues?.planName ?? '',
      gender: initialValues?.gender ?? undefined,
      goal: initialValues?.goal ?? '',
      totalDays: initialValues?.totalDays ?? undefined,
    });
  }, [isOpen, initialValues?.planName, initialValues?.gender, initialValues?.goal, initialValues?.totalDays, form]);

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!workoutDemoId) {
        return;
      }

      const payload: UpdateWorkoutDemoPayload = {
        planName: values.planName,
        gender: values.gender,
        goal: values.goal,
        totalDays: values.totalDays,
      };

      const response = await updateWorkoutPlan({ workoutDemoId, payload });

      if (response.success) {
        if (onUpdated) {
          await onUpdated(payload);
        }
        handleCancel();
      }
    } catch (error) {
      if (error && (error as any).errorFields) {
        return;
      }
      console.error('Failed to update workout plan', error);
    }
  };

  return (
    <Modal
      title="Cập nhật kế hoạch luyện tập"
      isOpen={isOpen}
      onClose={handleCancel}
      size="md"
    >
      {isLoading ? (
        <div
          style={{
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          Đang tải thông tin kế hoạch...
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên kế hoạch"
            name="planName"
            rules={[
              { required: true, message: 'Vui lòng nhập tên kế hoạch' },
              { min: 3, message: 'Tên kế hoạch phải có ít nhất 3 ký tự' },
            ]}
          >
            <Input size="large" placeholder="Nhập tên kế hoạch" />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
          >
            <Select size="large" placeholder="Chọn giới tính" options={genderOptions} />
          </Form.Item>

          <Form.Item
            label="Mục tiêu"
            name="goal"
            rules={[
              { required: true, message: 'Vui lòng nhập mục tiêu' },
              { min: 5, message: 'Mục tiêu phải có ít nhất 5 ký tự' },
            ]}
          >
            <Input.TextArea
              rows={3}
              showCount
              maxLength={200}
              placeholder="Ví dụ: Giảm cân, tăng cơ, cải thiện sức khỏe..."
            />
          </Form.Item>

          <Form.Item
            label="Tổng số ngày tập"
            name="totalDays"
            rules={[
              { required: true, message: 'Vui lòng nhập số ngày tập' },
              { type: 'number', min: 1, max: 90, message: 'Số ngày phải từ 1 đến 90' },
            ]}
          >
            <InputNumber min={1} max={90} style={{ width: '100%' }} size="large" placeholder="Nhập số ngày" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
            <Flex gap={12} justify="flex-end">
              <Button variant="secondary" size="md" onClick={handleCancel}>
                Hủy
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                loading={isPending}
                disabled={!workoutDemoId}
              >
                Tiếp tục
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default WorkoutPlanUpdateModal;
