'use client';

import React from 'react';
import { Modal, Input, Select, Button, Flex } from '@/shared/ui';
import { Form, InputNumber } from 'antd';
import type { MealDemo } from '@/types/mealdemo';
import type { UpdateMealDemoPayload } from '@/types/mealdemo';
import { useUpdateMealDemo } from '@/tanstack/hooks/mealdemo';
import { ValidationError } from '@/types/utils/APIError';

interface MealPlanUpdateModalProps {
  isOpen: boolean;
  mealDemoId: string | null;
  initialValues?: Partial<Pick<MealDemo, 'planName' | 'gender' | 'goal' | 'maxDailyCalories' | 'totalMenus'>>;
  isLoading?: boolean;
  onClose: () => void;
  onUpdated?: (payload: UpdateMealDemoPayload) => Promise<void> | void;
}

const genderOptions = [
  { label: 'Nam', value: 'male' },
  { label: 'Nữ', value: 'female' },
];

export const MealPlanUpdateModal: React.FC<MealPlanUpdateModalProps> = ({
  isOpen,
  mealDemoId,
  initialValues,
  isLoading,
  onClose,
  onUpdated,
}) => {
  const [form] = Form.useForm();
  const { mutateAsync: updateMealPlan, isPending } = useUpdateMealDemo();

  React.useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      planName: initialValues?.planName ?? '',
      gender: initialValues?.gender ?? undefined,
      goal: initialValues?.goal ?? '',
      maxDailyCalories: initialValues?.maxDailyCalories ?? undefined,
      totalMenus: initialValues?.totalMenus ?? undefined,
    });
  }, [isOpen, initialValues?.planName, initialValues?.gender, initialValues?.goal, initialValues?.maxDailyCalories, initialValues?.totalMenus, form]);

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!mealDemoId) {
        return;
      }

      const payload: UpdateMealDemoPayload = {
        id: mealDemoId,
        planName: values.planName,
        gender: values.gender,
        goal: values.goal,
        maxDailyCalories: values.maxDailyCalories,
        totalMenus: values.totalMenus,
      };

      const response = await updateMealPlan({ mealDemoId, payload });

      if (response.success) {
        if (onUpdated) {
          await onUpdated(payload);
        }
        handleCancel();
      }
    } catch (error) {
      if (error && (error as ValidationError).errorFields) {
        return;
      }
      console.error('Failed to update meal plan', error);
    }
  };

  return (
    <Modal
      title="Cập nhật kế hoạch dinh dưỡng"
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
            label="Calories tối đa mỗi ngày"
            name="maxDailyCalories"
            rules={[
              { required: true, message: 'Vui lòng nhập calories tối đa' },
              { type: 'number', min: 1000, max: 10000, message: 'Calories phải từ 1000 đến 10000' },
            ]}
          >
            <InputNumber min={1000} max={10000} style={{ width: '100%' }} size="large" placeholder="Nhập calories" />
          </Form.Item>

          <Form.Item
            label="Tổng số thực đơn"
            name="totalMenus"
            rules={[
              { required: true, message: 'Vui lòng nhập số thực đơn' },
              { type: 'number', min: 1, max: 90, message: 'Số thực đơn phải từ 1 đến 90' },
            ]}
          >
            <InputNumber min={1} max={90} style={{ width: '100%' }} size="large" placeholder="Nhập số thực đơn" />
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
                disabled={!mealDemoId}
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

export default MealPlanUpdateModal;

