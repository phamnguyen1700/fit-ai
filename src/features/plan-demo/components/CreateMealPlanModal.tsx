'use client';

import React, { useState } from 'react';
import { Modal, Input, Select, Button, Flex } from '@/shared/ui';
import { Form, InputNumber } from 'antd';
import type { CreateMealPlanFormData, Gender } from '@/types/plan';

interface CreateMealPlanModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateMealPlanFormData) => void;
}

export const CreateMealPlanModal: React.FC<CreateMealPlanModalProps> = ({
  open,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const formData: CreateMealPlanFormData = {
        planName: values.planName,
        gender: values.gender,
        totalCaloriesPerDay: values.totalCaloriesPerDay,
        goal: values.goal,
        totalMenus: values.totalMenus,
      };

      onSubmit(formData);
      setLoading(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
      setLoading(false);
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
              loading={loading}
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
