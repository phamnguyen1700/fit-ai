"use client";
import React, { useState } from 'react';
import { Modal, Row, Col, Button } from '@/shared/ui';
import { Form, Input, Select, InputNumber } from 'antd';
import type { WorkoutPlan } from '@/types/workoutPlan';

interface CreateWorkoutPlanModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (plan: Partial<WorkoutPlan>) => void;
  onOpenContentModal: (planType: 'workout' | 'meal' | 'combined', totalWorkoutDays: number, totalMealDays: number) => void;
}

export const CreateWorkoutPlanModal: React.FC<CreateWorkoutPlanModalProps> = ({
  visible,
  onClose,
  onSubmit,
  onOpenContentModal,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [planType, setPlanType] = useState<'workout' | 'meal' | 'combined'>('combined');

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Generate fake user data
      const fakeUsers = [
        { id: 'user1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c' },
        { id: 'user2', name: 'Trần Thị B', email: 'tranthib@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
        { id: 'user3', name: 'Lê Văn C', email: 'levanc@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
        { id: 'user4', name: 'Phạm Thị D', email: 'phamthid@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80' },
      ];
      const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
      
      const newPlan: Partial<WorkoutPlan> = {
        id: `plan-${Date.now()}`,
        userId: randomUser.id,
        userName: randomUser.name,
        userEmail: randomUser.email,
        userAvatar: randomUser.avatar,
        planName: values.planName,
        planType: values.planType,
        goal: values.goal,
        duration: values.duration,
        status: 'pending',
        generatedBy: 'manual',
        generatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        progress: 0,
      };

      // Add workout-specific fields
      if (values.planType === 'workout' || values.planType === 'combined') {
        newPlan.totalWorkoutDays = values.totalWorkoutDays || 0;
        newPlan.workoutsCompleted = 0;
      }

      // Add meal-specific fields
      if (values.planType === 'meal' || values.planType === 'combined') {
        newPlan.totalMealDays = values.totalMealDays || 0;
        newPlan.mealsCompleted = 0;
      }

      onSubmit(newPlan);
      form.resetFields();
      setLoading(false);
      onClose();
      
      // Mở popup thêm nội dung chi tiết
      setTimeout(() => {
        onOpenContentModal(
          values.planType,
          values.totalWorkoutDays || 0,
          values.totalMealDays || 0
        );
      }, 300);
    } catch (error) {
      console.error('Validation failed:', error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Tạo Workout Plan mới"
      isOpen={visible}
      onClose={handleCancel}
      size="lg"
      showFooter={true}
      footerContent={
        <div className="flex justify-end gap-2">
          <Button onClick={handleCancel}>
            Hủy
          </Button>
          <Button
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleSubmit}
          >
            {loading ? 'Đang tạo...' : 'Tạo kế hoạch'}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          planType: 'combined',
          status: 'pending',
        }}
      >
        {/* Plan Information */}
        <div className="mb-4">
          <h4 className="font-semibold text-[var(--text)] mb-3">Thông tin kế hoạch</h4>
          
          <Form.Item
            label="Tên kế hoạch"
            name="planName"
            rules={[{ required: true, message: 'Vui lòng nhập tên kế hoạch!' }]}
          >
            <Input placeholder="Kế hoạch giảm cân 4 tuần" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Loại kế hoạch"
                name="planType"
                rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
              >
                <Select
                  onChange={(value) => setPlanType(value as any)}
                  options={[
                    { label: 'Tổng hợp (Workout + Meal)', value: 'combined' },
                    { label: 'Chỉ Tập luyện', value: 'workout' },
                    { label: 'Chỉ Dinh dưỡng', value: 'meal' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Thời gian"
                name="duration"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
              >
                <Input placeholder="4 tuần" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Mục tiêu"
            name="goal"
            rules={[{ required: true, message: 'Vui lòng chọn mục tiêu!' }]}
          >
            <Select
              placeholder="Chọn mục tiêu"
              options={[
                { label: 'Giảm cân', value: 'Giảm cân' },
                { label: 'Tăng cơ', value: 'Tăng cơ' },
                { label: 'Giảm mỡ bụng', value: 'Giảm mỡ bụng' },
                { label: 'Tăng sức bền', value: 'Tăng sức bền' },
                { label: 'Tăng sức mạnh', value: 'Tăng sức mạnh' },
                { label: 'Cải thiện sức khỏe', value: 'Cải thiện sức khỏe' },
                { label: 'Ăn sạch', value: 'Ăn sạch' },
                { label: 'Duy trì cân nặng', value: 'Duy trì cân nặng' },
              ]}
            />
          </Form.Item>
        </div>

        {/* Plan Details */}
        <div className="mb-4">
          <h4 className="font-semibold text-[var(--text)] mb-3">Chi tiết kế hoạch</h4>
          <Row gutter={16}>
            {(planType === 'workout' || planType === 'combined') && (
              <Col span={12}>
                <Form.Item
                  label="Tổng số ngày tập"
                  name="totalWorkoutDays"
                  rules={[{ required: true, message: 'Vui lòng chọn số ngày!' }]}
                >
                  <Select
                    placeholder="Chọn số ngày"
                    options={[
                      { label: '7 ngày', value: 7 },
                      { label: '14 ngày', value: 14 },
                    ]}
                  />
                </Form.Item>
              </Col>
            )}
            
            {(planType === 'meal' || planType === 'combined') && (
              <Col span={12}>
                <Form.Item
                  label="Tổng số ngày ăn"
                  name="totalMealDays"
                  rules={[{ required: true, message: 'Vui lòng chọn số ngày!' }]}
                >
                  <Select
                    placeholder="Chọn số ngày"
                    options={[
                      { label: '7 ngày', value: 7 },
                      { label: '14 ngày', value: 14 },
                    ]}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Lưu ý:</strong> Kế hoạch mới sẽ được tạo với trạng thái "Chờ xử lý" 
            và tiến độ 0%. Bạn có thể chỉnh sửa chi tiết sau khi tạo.
          </p>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateWorkoutPlanModal;
