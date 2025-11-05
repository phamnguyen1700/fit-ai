"use client";
import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { Button, Row, Col } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

interface WorkoutFormProps {
  onSubmit: () => void;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSubmit }) => {
  return (
    <div>
      <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-sm text-orange-700">
          <strong>Hướng dẫn:</strong> Chọn ngày và thêm bài tập cho ngày đó. Bạn có thể thêm nhiều bài tập trong một ngày.
        </p>
      </div>

      <Form.List name="exercises" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-[var(--text)]">Bài tập</h4>
              <Button
                onClick={() => add()}
                className="text-orange-500 hover:text-orange-600"
              >
                <Icon name="mdi:plus" size={16} /> Thêm bài tập
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.key}
                className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
              >
                {fields.length > 1 && (
                  <Button
                    onClick={() => remove(field.name)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                  >
                    <Icon name="mdi:close" size={16} />
                  </Button>
                )}

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name={[field.name, 'name']}
                      label="Tên bài tập"
                      rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                      <Input placeholder="Chạy bộ, Plank, Squats..." />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={[field.name, 'type']}
                      label="Loại bài tập"
                      rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
                    >
                      <Select placeholder="Chọn loại bài tập">
                        <Select.Option value="chest">Tập ngực</Select.Option>
                        <Select.Option value="back">Tập lưng</Select.Option>
                        <Select.Option value="legs">Tập chân</Select.Option>
                        <Select.Option value="shoulders">Tập vai</Select.Option>
                        <Select.Option value="arms">Tập tay</Select.Option>
                        <Select.Option value="abs">Tập bụng</Select.Option>
                        <Select.Option value="cardio">Cardio</Select.Option>
                        <Select.Option value="fullbody">Toàn thân</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={[field.name, 'sets']} label="Sets">
                      <InputNumber min={1} style={{ width: '100%' }} placeholder="3" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={[field.name, 'reps']} label="Reps">
                      <InputNumber min={1} style={{ width: '100%' }} placeholder="15" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ))}
          </>
        )}
      </Form.List>

      <Button
        className="w-full bg-orange-500 text-white hover:bg-orange-600 mt-4"
        onClick={onSubmit}
      >
        <Icon name="mdi:plus" size={16} /> Thêm ngày tập này
      </Button>
    </div>
  );
};
