"use client";

import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch } from 'antd';
import type { FoodItem } from '..';

interface FoodFormModalProps {
  open: boolean;
  food: FoodItem | null;
  onClose: () => void;
  onSubmit: (data: Omit<FoodItem, 'id'> & { id?: string }) => void;
}

export const FoodFormModal: React.FC<FoodFormModalProps> = ({ open, food, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (food) {
      form.setFieldsValue(food);
    } else {
      form.resetFields();
      form.setFieldsValue({ isActive: true, unit: '100g' });
    }
  }, [food, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit({ ...(values as Omit<FoodItem, 'id'>), id: food?.id });
      })
      .catch(() => {});
  };

  return (
    <Modal
      title={food ? 'Chỉnh sửa thực phẩm' : 'Thêm thực phẩm mới'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText={food ? 'Lưu thay đổi' : 'Tạo mới'}
      cancelText="Hủy"
      centered
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="Tên thực phẩm"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên thực phẩm' }]}
        >
          <Input placeholder="Ví dụ: Ức gà luộc" />
        </Form.Item>

        <Form.Item label="Thương hiệu" name="brand">
          <Input placeholder="Ví dụ: Brol" />
        </Form.Item>

        <Form.Item
          label="Đơn vị hiển thị"
          name="unit"
          rules={[{ required: true, message: 'Vui lòng nhập đơn vị' }]}
        >
          <Input placeholder="Ví dụ: 100g, 1 phần, 1 hộp" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Calories"
            name="calories"
            rules={[{ required: true, message: 'Nhập calories' }]}
          >
            <InputNumber className="w-full" min={0} addonAfter="kcal" />
          </Form.Item>

          <Form.Item
            label="Protein (g)"
            name="protein"
            rules={[{ required: true, message: 'Nhập protein' }]}
          >
            <InputNumber className="w-full" min={0} step={0.1} />
          </Form.Item>

          <Form.Item
            label="Carb (g)"
            name="carbs"
            rules={[{ required: true, message: 'Nhập carb' }]}
          >
            <InputNumber className="w-full" min={0} step={0.1} />
          </Form.Item>

          <Form.Item
            label="Fat (g)"
            name="fat"
            rules={[{ required: true, message: 'Nhập fat' }]}
          >
            <InputNumber className="w-full" min={0} step={0.1} />
          </Form.Item>
        </div>

        <Form.Item
          label="Trạng thái"
          name="isActive"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
