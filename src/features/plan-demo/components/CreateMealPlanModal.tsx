'use client';

import React from 'react';
import { Modal, Input, Select, Button, Flex } from '@/shared/ui';
import { Form, InputNumber } from 'antd';
import type { CreateMealPlanFormData } from '@/types/plan';
import { useCreateMealDemo } from '@/tanstack/hooks/mealdemo';
import toast from 'react-hot-toast';
import { ValidationError } from '@/types/utils/APIError';

interface CreateMealPlanModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateMealPlanFormData, mealDemoId: string) => void;
}

export const CreateMealPlanModal: React.FC<CreateMealPlanModalProps> = ({
  open,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const { mutateAsync: createMealDemo, isPending } = useCreateMealDemo();

  const resolveMealDemoId = (raw: unknown): string | undefined => {
    if (!raw) return undefined;

    if (typeof raw === 'string' || typeof raw === 'number') {
      const value = String(raw).trim();
      return value || undefined;
    }

    if (Array.isArray(raw)) {
      for (const item of raw) {
        const nested = resolveMealDemoId(item);
        if (nested) return nested;
      }
      return undefined;
    }

    if (typeof raw === 'object') {
      const record = raw as Record<string, unknown>;
      const candidateKeys = ['mealDemoId', 'mealDemoID', 'id', 'mealPlanId', 'mealPlanID'];

      for (const key of candidateKeys) {
        const candidate = record[key];
        if (typeof candidate === 'string' || typeof candidate === 'number') {
          const normalized = String(candidate).trim();
          if (normalized) return normalized;
        }
      }

      const nestedKeys = ['data', 'result', 'mealDemo', 'payload'];
      for (const nestedKey of nestedKeys) {
        if (nestedKey in record) {
          const nested = resolveMealDemoId(record[nestedKey]);
          if (nested) return nested;
        }
      }
    }

    return undefined;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const formData: CreateMealPlanFormData = {
        planName: values.planName,
        gender: values.gender,
        totalCaloriesPerDay: values.totalCaloriesPerDay,
        goal: values.goal,
        totalMenus: values.totalMenus,
      };

      const response = await createMealDemo({
        planName: formData.planName,
        gender: formData.gender,
        goal: formData.goal,
        maxDailyCalories: formData.totalCaloriesPerDay,
        totalMenus: formData.totalMenus,
      });

      if (!response?.success) {
        toast.error(response?.message || 'Không thể tạo kế hoạch. Vui lòng thử lại.');
        return;
      }

      const mealDemoId = resolveMealDemoId(response?.data);

      if (!mealDemoId) {
        toast.error('Không nhận được mã kế hoạch từ máy chủ.');
        return;
      }

      toast.success('Tạo kế hoạch dinh dưỡng thành công!');
      onSubmit(formData, mealDemoId);
      form.resetFields();
    } catch (error: unknown) {
      if ((error as ValidationError)?.errorFields) {
        console.error('Validation failed:', error);
      } else {
        console.error('Create meal demo failed:', error);
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
    { label: 'Khác', value: 'other' },
  ];

  return (
    <Modal
      title="Tạo kế hoạch dinh dưỡng mới"
      isOpen={open}
      onClose={handleCancel}
      size="md"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          totalCaloriesPerDay: 2000,
          totalMenus: 7,
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
            placeholder="Ví dụ: Kế hoạch giảm cân 7 ngày"
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

        {/* Tổng số calo 1 ngày */}
        <Form.Item
          label="Tổng số calo mỗi ngày"
          name="totalCaloriesPerDay"
          rules={[
            { required: true, message: 'Vui lòng nhập số calo' },
            { type: 'number', min: 1000, max: 5000, message: 'Số calo phải từ 1000 đến 5000' },
          ]}
          tooltip="Tổng lượng calo cần thiết mỗi ngày"
        >
          <InputNumber
            placeholder="Nhập số calo"
            size="large"
            style={{ width: '100%' }}
            min={1000}
            max={5000}
            addonAfter="kcal"
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
            placeholder="Ví dụ: Giảm cân, tăng cơ, cải thiện sức khỏe..."
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        {/* Tổng số thực đơn */}
        <Form.Item
          label="Tổng số thực đơn"
          name="totalMenus"
          rules={[
            { required: true, message: 'Vui lòng nhập số thực đơn' },
            { type: 'number', min: 1, max: 30, message: 'Số thực đơn phải từ 1 đến 30' },
          ]}
          tooltip="Số thực đơn cần tạo (mỗi thực đơn có 3 bữa: sáng, trưa, tối)"
        >
          <InputNumber
            placeholder="Nhập số thực đơn"
            size="large"
            style={{ width: '100%' }}
            min={1}
            max={30}
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

export default CreateMealPlanModal;
