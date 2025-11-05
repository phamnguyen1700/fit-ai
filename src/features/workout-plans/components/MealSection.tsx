"use client";
import React from 'react';
import { Form, Input, InputNumber } from 'antd';
import { Button, Row, Col } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

interface MealSectionProps {
  name: string;
  title: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  addButtonText: string;
}

export const MealSection: React.FC<MealSectionProps> = ({
  name,
  title,
  emoji,
  bgColor,
  borderColor,
  addButtonText,
}) => {
  return (
    <div className="mb-6">
      <h4 className="font-semibold text-[var(--text)] mb-3">
        {emoji} {title}
      </h4>
      <Form.List name={name} initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <div
                key={field.key}
                className={`mb-3 p-3 ${bgColor} rounded-lg border ${borderColor}`}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name={[field.name, 'name']}
                      label="Tên món"
                      rules={[{ required: true, message: 'Nhập tên món!' }]}
                    >
                      <Input placeholder="Tên món ăn..." />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={[field.name, 'calories']}
                      label="Calories (kcal)"
                      rules={[{ required: true, message: 'Nhập calories!' }]}
                    >
                      <InputNumber min={0} style={{ width: '100%' }} placeholder="200" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name={[field.name, 'protein']} label="Protein (g)">
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name={[field.name, 'carbs']} label="Carbs (g)">
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name={[field.name, 'fat']} label="Fat (g)">
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name={[field.name, 'ingredients']}
                      label="Nguyên liệu (cách nhau bởi dấu phẩy)"
                    >
                      <Input placeholder="Nguyên liệu..." />
                    </Form.Item>
                  </Col>
                </Row>
                {fields.length > 1 && (
                  <Button onClick={() => remove(field.name)} className="text-red-500">
                    Xóa món
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={() => add()} className="mb-4">
              <Icon name="mdi:plus" size={16} /> {addButtonText}
            </Button>
          </>
        )}
      </Form.List>
    </div>
  );
};
