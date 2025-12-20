"use client";

import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, ConfigProvider, Button, Select } from 'antd';
import type { FoodItem } from '..';
import { useGetFoodCategories } from '@/tanstack/hooks/foodcategory';
import { useCreateFoodLibraryItem } from '@/tanstack/hooks/foodlibrary';

interface FoodFormModalProps {
  open: boolean;
  food: FoodItem | null;
  onClose: () => void;
  onSubmit: (data: Omit<FoodItem, 'id'> & { id?: string }) => void;
}

export const FoodFormModal: React.FC<FoodFormModalProps> = ({ open, food, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetFoodCategories(open);
  const createFoodMutation = useCreateFoodLibraryItem();

  const categories = categoriesResponse?.data || [];

  useEffect(() => {
    if (food) {
      form.setFieldsValue(food);
    } else {
      form.resetFields();
      form.setFieldsValue({ unit: '100g' });
    }
  }, [food, form]);

  const parseWeightFromUnit = (unit: string): number => {
    // Parse "100g" -> 100, "1 phần" -> 100 (default), etc.
    const match = unit.match(/(\d+(?:\.\d+)?)\s*g/i);
    if (match) {
      return parseFloat(match[1]);
    }
    return 100; // default weight
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const { name, categoryId, unit, calories, protein, carbs, fat } = values;
        
        // Nếu đang edit, dùng onSubmit callback như cũ
        if (food?.id) {
          onSubmit({ ...(values as Omit<FoodItem, 'id'>), id: food.id });
          return;
        }

        // Nếu đang tạo mới, gọi API
        const weight = parseWeightFromUnit(unit || '100g');
        
        createFoodMutation.mutate(
          {
            name,
            categoryId: categoryId || undefined,
            fatSecretFoodId: '', // Không cần fatSecretFoodId khi tạo từ form
            nutrition: {
              calories: Number(calories),
              protein: Number(protein),
              carbs: Number(carbs),
              fat: Number(fat),
              weight,
            },
          },
          {
            onSuccess: () => {
              form.resetFields();
              form.setFieldsValue({ unit: '100g' });
              onClose();
            },
          },
        );
      })
      .catch(() => {});
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ff8c00',
        },
      }}
    >
      <Modal
        title={food ? 'Chỉnh sửa thực phẩm' : 'Thêm thực phẩm mới'}
        open={open}
        onCancel={onClose}
        centered
        width={550}
        className="food-form-modal"
        styles={{
          header: {
            background: 'transparent',
            borderBottom: '1px solid #f0f0f0',
          },
        }}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button onClick={onClose}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              onClick={handleOk}
              loading={createFoodMutation.isPending}
            >
              {food ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
          </div>
        }
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
            <Input placeholder="Ví dụ: Ức gà luộc" />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="categoryId"
          >
            <Select
              placeholder="Chọn danh mục"
              loading={isLoadingCategories}
              allowClear
              showSearch
              optionFilterProp="label"
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />
          </Form.Item>

          <Form.Item 
            label="Thương hiệu" 
            name="brand"
          >
            <Input placeholder="Ví dụ: Brol" />
          </Form.Item>

          <Form.Item
            label="Đơn vị hiển thị"
            name="unit"
            rules={[{ required: true, message: 'Vui lòng nhập đơn vị' }]}
          >
            <Input placeholder="Ví dụ: 100g, 1 phần, 1 hộp" />
          </Form.Item>

          <div className="grid grid-cols-4 gap-4">
            <Form.Item
              label="Calories"
              name="calories"
              rules={[{ required: true, message: 'Nhập calories' }]}
              className="col-span-1"
            >
              <InputNumber 
                className="w-full" 
                min={0} 
                addonAfter="kcal"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="Protein (g)"
              name="protein"
              rules={[{ required: true, message: 'Nhập protein' }]}
              className="col-span-1"
            >
              <InputNumber 
                className="w-full" 
                min={0} 
                step={0.1} 
              />
            </Form.Item>

            <Form.Item
              label="Carb (g)"
              name="carbs"
              rules={[{ required: true, message: 'Nhập carb' }]}
              className="col-span-1"
            >
              <InputNumber 
                className="w-full" 
                min={0} 
                step={0.1} 
              />
            </Form.Item>

            <Form.Item
              label="Fat (g)"
              name="fat"
              rules={[{ required: true, message: 'Nhập fat' }]}
              className="col-span-1"
            >
              <InputNumber 
                className="w-full" 
                min={0} 
                step={0.1} 
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};
