'use client';

import React from 'react';
import { Modal, Input, Select, Button, Flex } from '@/shared/ui';
import { Form, InputNumber } from 'antd';
import type { CreatePlanFormData } from '@/types/plan';
import { useCreateWorkoutDemo } from '@/tanstack/hooks/workoutdemo';
import toast from 'react-hot-toast';

interface CreatePlanModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: CreatePlanFormData, workoutDemoId: string) => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  open,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const { mutateAsync: createWorkoutDemo, isPending } = useCreateWorkoutDemo();

  const resolveWorkoutDemoId = (raw: unknown): string | undefined => {
    if (!raw) {
      return undefined;
    }

    if (typeof raw === 'string' || typeof raw === 'number') {
      const value = String(raw).trim();
      return value || undefined;
    }

    if (Array.isArray(raw)) {
      for (const item of raw) {
        const nested = resolveWorkoutDemoId(item);
        if (nested) {
          return nested;
        }
      }
      return undefined;
    }

    if (typeof raw === 'object') {
      const record = raw as Record<string, unknown>;
      const candidateKeys = ['workoutDemoId', 'workoutDemoID', 'id', 'workoutPlanId', 'workoutPlanID'];

      for (const key of candidateKeys) {
        const candidate = record[key];
        if (typeof candidate === 'string' || typeof candidate === 'number') {
          const normalized = String(candidate).trim();
          if (normalized) {
            return normalized;
          }
        }
      }

      const nestedKeys = ['data', 'result', 'workoutDemo', 'payload'];
      for (const nestedKey of nestedKeys) {
        if (nestedKey in record) {
          const nested = resolveWorkoutDemoId(record[nestedKey]);
          if (nested) {
            return nested;
          }
        }
      }
    }

    return undefined;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData: CreatePlanFormData = {
        planName: values.planName,
        gender: values.gender,
        startDate: new Date().toISOString(),
        goal: values.goal,
        totalDays: values.totalDays,
      };

      const response = await createWorkoutDemo({
        planName: formData.planName,
        gender: formData.gender,
        goal: formData.goal,
        totalDays: formData.totalDays,
      });

      if (!response?.success) {
        toast.error(response?.message || 'Không thể tạo kế hoạch. Vui lòng thử lại.');
        return;
      }

      const workoutDemoId = resolveWorkoutDemoId(response?.data);

      if (!workoutDemoId) {
        toast.error('Không nhận được mã kế hoạch từ máy chủ.');
        return;
      }

      onSubmit(formData, workoutDemoId);
      form.resetFields();
    } catch (error: any) {
      if (error?.errorFields) {
        console.error('Validation failed:', error);
      } else {
        console.error('Create workout demo failed:', error);
        toast.error('Không thể tạo kế hoạch. Vui lòng thử lại.');
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const genderOptions = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
  ];

  return (
    <Modal
      title="Tạo kế hoạch tập luyện mới"
      isOpen={open}
      onClose={handleCancel}
      size="md"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          totalDays: 7,
        }}
      >
        {/* Tên kế hoạch */}
        <Form.Item
          label="Tên kế hoạch"
          name="planName"
          rules={[
            { required: true, message: 'Vui lòng nhập tên kế hoạch' },
            { min: 3, message: 'Tên kế hoạch phải có ít nhất 3 ký tự' },
          ]}
        >
          <Input
            placeholder="Ví dụ: Kế hoạch giảm cân 4 tuần"
            size="large"
          />
        </Form.Item>

        {/* Giới tính */}
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
        >
          <Select
            placeholder="Chọn giới tính"
            size="large"
            options={genderOptions}
          />
        </Form.Item>

        {/* Mục tiêu */}
        <Form.Item
          label="Mục tiêu"
          name="goal"
          rules={[
            { required: true, message: 'Vui lòng nhập mục tiêu' },
            { min: 5, message: 'Mục tiêu phải có ít nhất 5 ký tự' },
          ]}
        >
          <Input.TextArea
            placeholder="Ví dụ: Giảm 5kg, tăng cơ bắp, cải thiện sức khỏe..."
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        {/* Tổng số ngày tập */}
        <Form.Item
          label="Tổng số ngày tập"
          name="totalDays"
          rules={[
            { required: true, message: 'Vui lòng nhập số ngày tập' },
            { type: 'number', min: 1, max: 90, message: 'Số ngày phải từ 1 đến 90' },
          ]}
          tooltip="Số ngày tập luyện trong kế hoạch (tối đa 90 ngày)"
        >
          <InputNumber
            placeholder="Nhập số ngày"
            size="large"
            style={{ width: '100%' }}
            min={1}
            max={90}
          />
        </Form.Item>

        {/* Footer buttons */}
        <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
          <Flex gap={12} justify="flex-end">
            <Button
              variant="secondary"
              size="md"
              onClick={handleCancel}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              loading={isPending}
            >
              Tạo kế hoạch
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePlanModal;
