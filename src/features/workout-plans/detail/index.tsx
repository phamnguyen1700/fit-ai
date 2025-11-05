'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Breadcrumb, Avatar, Button, Progress, Tabs, Badge, Flex, Row, Col } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { WorkoutPlan, DailyWorkoutPlan, DailyMealPlan } from '@/types/workoutPlan';

interface WorkoutPlanDetailPageProps {
  planId?: string;
}

// Mock detailed data
const mockDetailedPlan: WorkoutPlan & {
  workoutPlans: DailyWorkoutPlan[];
  mealPlans: DailyMealPlan[];
} = {
  id: '1',
  userId: 'user1',
  userName: 'Nguyễn Văn A',
  userEmail: 'nguyenvana@example.com',
  userAvatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c',
  planName: 'Kế hoạch giảm cân 4 tuần',
  planType: 'combined',
  goal: 'Giảm cân, giảm mỡ bụng, tăng cơ nạc',
  duration: '4 tuần',
  startDate: '2025-11-01',
  endDate: '2025-11-28',
  status: 'active',
  totalWorkoutDays: 28,
  workoutsCompleted: 12,
  totalMealDays: 28,
  mealsCompleted: 15,
  generatedBy: 'ai',
  aiModel: 'GPT-4',
  generatedAt: '2025-11-01T08:00:00Z',
  createdAt: '2025-11-01T08:00:00Z',
  progress: 50,
  totalCaloriesTarget: 2000,
  totalCaloriesBurned: 8500,
  
  // Sample workout plan
  workoutPlans: [
    {
      day: 'Thứ 2',
      date: '2025-11-04',
      completed: true,
      totalCalories: 350,
      sessions: [
        {
          id: 'morning-1',
          time: 'Buổi sáng (6:00 AM)',
          totalDuration: '45 phút',
          totalCalories: 350,
          exercises: [
            {
              id: 'ex1',
              name: 'Chạy bộ',
              duration: '20 phút',
              caloriesBurned: 200,
              description: 'Chạy bộ nhẹ nhàng trên máy chạy hoặc ngoài trời',
            },
            {
              id: 'ex2',
              name: 'Plank',
              sets: 3,
              duration: '30 giây/lần',
              caloriesBurned: 50,
              description: 'Giữ tư thế plank để tăng cường cơ core',
            },
            {
              id: 'ex3',
              name: 'Squats',
              sets: 3,
              reps: 15,
              caloriesBurned: 100,
              description: 'Bài tập squat cơ bản cho chân và mông',
            },
          ],
        },
      ],
    },
    {
      day: 'Thứ 3',
      date: '2025-11-05',
      completed: true,
      totalCalories: 300,
      sessions: [
        {
          id: 'evening-1',
          time: 'Buổi tối (6:00 PM)',
          totalDuration: '40 phút',
          totalCalories: 300,
          exercises: [
            {
              id: 'ex4',
              name: 'Đạp xe',
              duration: '30 phút',
              caloriesBurned: 250,
              description: 'Đạp xe với cường độ vừa phải',
            },
            {
              id: 'ex5',
              name: 'Push-ups',
              sets: 3,
              reps: 12,
              caloriesBurned: 50,
              description: 'Hít đất cơ bản',
            },
          ],
        },
      ],
    },
    {
      day: 'Thứ 4',
      date: '2025-11-06',
      completed: false,
      sessions: [
        {
          id: 'morning-2',
          time: 'Buổi sáng (6:30 AM)',
          exercises: [
            {
              id: 'ex6',
              name: 'Yoga',
              duration: '30 phút',
              caloriesBurned: 150,
            },
          ],
        },
      ],
    },
  ],
  
  // Sample meal plan
  mealPlans: [
    {
      day: 'Thứ 2',
      date: '2025-11-04',
      completed: true,
      totalCalories: 1850,
      totalProtein: 120,
      totalCarbs: 180,
      totalFat: 50,
      sessions: [
        {
          id: 'breakfast-1',
          time: 'Bữa sáng (7:00 AM)',
          totalCalories: 450,
          meals: [
            {
              id: 'meal1',
              name: 'Trứng ốp la',
              calories: 200,
              protein: 15,
              carbs: 5,
              fat: 14,
              ingredients: ['2 quả trứng', 'Dầu olive'],
            },
            {
              id: 'meal2',
              name: 'Bánh mì nguyên cám',
              calories: 150,
              protein: 6,
              carbs: 28,
              fat: 2,
              ingredients: ['2 lát bánh mì nguyên cám'],
            },
            {
              id: 'meal3',
              name: 'Chuối',
              calories: 100,
              protein: 1,
              carbs: 27,
              fat: 0,
            },
          ],
        },
        {
          id: 'lunch-1',
          time: 'Bữa trưa (12:00 PM)',
          totalCalories: 650,
          meals: [
            {
              id: 'meal4',
              name: 'Cơm gạo lứt',
              calories: 200,
              protein: 5,
              carbs: 45,
              fat: 2,
            },
            {
              id: 'meal5',
              name: 'Ức gà nướng',
              calories: 250,
              protein: 45,
              carbs: 0,
              fat: 8,
            },
            {
              id: 'meal6',
              name: 'Salad rau củ',
              calories: 200,
              protein: 5,
              carbs: 20,
              fat: 12,
            },
          ],
        },
        {
          id: 'snack-1',
          time: 'Bữa phụ (3:00 PM)',
          totalCalories: 200,
          meals: [
            {
              id: 'meal7',
              name: 'Sữa chua Hy Lạp',
              calories: 150,
              protein: 15,
              carbs: 12,
              fat: 5,
            },
            {
              id: 'meal8',
              name: 'Hạnh nhân',
              calories: 50,
              protein: 2,
              carbs: 2,
              fat: 4,
            },
          ],
        },
        {
          id: 'dinner-1',
          time: 'Bữa tối (7:00 PM)',
          totalCalories: 550,
          meals: [
            {
              id: 'meal9',
              name: 'Cá hồi nướng',
              calories: 350,
              protein: 40,
              carbs: 0,
              fat: 20,
            },
            {
              id: 'meal10',
              name: 'Rau xào',
              calories: 200,
              protein: 5,
              carbs: 25,
              fat: 8,
            },
          ],
        },
      ],
    },
  ],
};

export const WorkoutPlanDetailPage: React.FC<WorkoutPlanDetailPageProps> = ({ planId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'workout' | 'meal'>('workout');

  const plan = mockDetailedPlan; // In real app, fetch based on planId

  const breadcrumbItems = [
    { title: 'Trang chủ', href: '/admin/dashboard' },
    { title: 'Quản lý Workout Plans', href: '/admin/workout-plans' },
    { title: 'Chi tiết kế hoạch' },
  ];

  const tabItems = [
    {
      key: 'workout',
      label: (
        <span className="flex items-center gap-2">
          <Icon name="mdi:dumbbell" size={16} />
          Lịch tập luyện
        </span>
      ),
    },
    {
      key: 'meal',
      label: (
        <span className="flex items-center gap-2">
          <Icon name="mdi:food-apple" size={16} />
          Kế hoạch dinh dưỡng
        </span>
      ),
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      active: '#52c41a',
      completed: '#1890ff',
      pending: '#faad14',
      cancelled: '#ff4d4f',
    };
    return colors[status as keyof typeof colors] || '#d9d9d9';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'Đang hoạt động',
      completed: 'Hoàn thành',
      pending: 'Chờ xử lý',
      cancelled: 'Đã hủy',
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Card
      title={
        <span className="text text-base sm:text-lg font-semibold">
          Chi tiết Workout Plan
        </span>
      }
    >
      {/* Header với Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb items={breadcrumbItems} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/workout-plans')}
        >
          <Icon name="mdi:arrow-left" />
          Quay lại
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - User & Plan Info */}
        <Col xs={24} lg={12}>
          <Card title="Thông tin người dùng" className="h-fit mb-6">
            <Flex align="flex-start" gap={16}>
              <Avatar size={100} src={plan.userAvatar} />
              <Flex vertical flex={1} gap={8}>
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  {plan.userName}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {plan.userEmail}
                </p>
                <Badge
                  color={getStatusColor(plan.status)}
                  text={getStatusLabel(plan.status)}
                />
              </Flex>
            </Flex>
          </Card>

          <Card title="Thông tin kế hoạch" className="h-fit">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <span className="text-[var(--text-secondary)]">Tên kế hoạch:</span>
              </Col>
              <Col span={16}>
                <span className="font-semibold text-[var(--text)]">
                  {plan.planName}
                </span>
              </Col>

              <Col span={8}>
                <span className="text-[var(--text-secondary)]">Mục tiêu:</span>
              </Col>
              <Col span={16}>
                <span className="text-[var(--text)]">{plan.goal}</span>
              </Col>

              <Col span={8}>
                <span className="text-[var(--text-secondary)]">Thời gian:</span>
              </Col>
              <Col span={16}>
                <span className="text-[var(--text)]">{plan.duration}</span>
              </Col>

              <Col span={8}>
                <span className="text-[var(--text-secondary)]">Ngày bắt đầu:</span>
              </Col>
              <Col span={16}>
                <span className="text-[var(--text)]">{plan.startDate}</span>
              </Col>

              <Col span={8}>
                <span className="text-[var(--text-secondary)]">Ngày kết thúc:</span>
              </Col>
              <Col span={16}>
                <span className="text-[var(--text)]">{plan.endDate}</span>
              </Col>

              <Col span={8}>
                <span className="text-[var(--text-secondary)]">Tạo bởi:</span>
              </Col>
              <Col span={16}>
                <Badge
                  text={plan.generatedBy === 'ai' ? `AI (${plan.aiModel})` : 'Manual'}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--primary)',
                  }}
                />
              </Col>

              <Col span={24}>
                <div className="mt-2">
                  <Flex justify="space-between" className="mb-2">
                    <span className="text-[var(--text-secondary)]">Tiến độ hoàn thành</span>
                    <span className="font-semibold text-[var(--primary)]">
                      {plan.progress}%
                    </span>
                  </Flex>
                  <Progress
                    percent={plan.progress}
                    strokeColor="var(--primary)"
                    showInfo={false}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right Column - Plan Details */}
        <Col xs={24} lg={12}>
          <Card title="Chi tiết kế hoạch" className="h-fit">
            <Tabs
              items={tabItems}
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as 'workout' | 'meal')}
            />

            <div className="mt-4 max-h-[600px] overflow-y-auto">
              {activeTab === 'workout' && (
                <div className="space-y-4">
                  {plan.workoutPlans?.map((dayPlan, index) => (
                    <Card
                      key={index}
                      size="small"
                      className={dayPlan.completed ? 'bg-green-50' : ''}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-[var(--text)]">
                          {dayPlan.day} - {dayPlan.date}
                        </h4>
                        {dayPlan.completed && (
                          <Badge
                            color="green"
                            text="Hoàn thành"
                            style={{ fontSize: '11px' }}
                          />
                        )}
                      </div>

                      {dayPlan.sessions.map((session) => (
                        <div key={session.id} className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="mdi:clock-outline" size={14} color="var(--text-secondary)" />
                            <span className="text-sm font-medium text-[var(--text-secondary)]">
                              {session.time}
                            </span>
                          </div>

                          <div className="space-y-2 pl-4">
                            {session.exercises.map((exercise) => (
                              <div
                                key={exercise.id}
                                className="flex items-start gap-2 p-2 bg-white rounded border border-[var(--border)]"
                              >
                                <Icon name="mdi:dumbbell" size={16} color="var(--primary)" />
                                <div className="flex-1">
                                  <p className="font-medium text-sm text-[var(--text)]">
                                    {exercise.name}
                                  </p>
                                  <p className="text-xs text-[var(--text-secondary)]">
                                    {exercise.sets && `${exercise.sets} sets`}
                                    {exercise.reps && ` × ${exercise.reps} reps`}
                                    {exercise.duration && ` - ${exercise.duration}`}
                                    {exercise.caloriesBurned && ` | ${exercise.caloriesBurned} kcal`}
                                  </p>
                                  {exercise.description && (
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                                      {exercise.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {dayPlan.totalCalories && (
                        <div className="mt-2 pt-2 border-t border-[var(--border)]">
                          <span className="text-xs text-[var(--text-secondary)]">
                            Tổng calories đốt cháy: {' '}
                            <span className="font-semibold text-[var(--primary)]">
                              {dayPlan.totalCalories} kcal
                            </span>
                          </span>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'meal' && (
                <div className="space-y-4">
                  {plan.mealPlans?.map((dayPlan, index) => (
                    <Card
                      key={index}
                      size="small"
                      className={dayPlan.completed ? 'bg-green-50' : ''}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-[var(--text)]">
                          {dayPlan.day} - {dayPlan.date}
                        </h4>
                        {dayPlan.completed && (
                          <Badge
                            color="green"
                            text="Hoàn thành"
                            style={{ fontSize: '11px' }}
                          />
                        )}
                      </div>

                      {dayPlan.sessions.map((session) => (
                        <div key={session.id} className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="mdi:clock-outline" size={14} color="var(--text-secondary)" />
                            <span className="text-sm font-medium text-[var(--text-secondary)]">
                              {session.time}
                            </span>
                          </div>

                          <div className="space-y-2 pl-4">
                            {session.meals.map((meal) => (
                              <div
                                key={meal.id}
                                className="flex items-start gap-2 p-2 bg-white rounded border border-[var(--border)]"
                              >
                                <Icon name="mdi:food-apple" size={16} color="var(--primary)" />
                                <div className="flex-1">
                                  <p className="font-medium text-sm text-[var(--text)]">
                                    {meal.name}
                                  </p>
                                  <p className="text-xs text-[var(--text-secondary)]">
                                    {meal.calories} kcal | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                                  </p>
                                  {meal.ingredients && meal.ingredients.length > 0 && (
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                                      {meal.ingredients.join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {dayPlan.totalCalories && (
                        <div className="mt-2 pt-2 border-t border-[var(--border)] grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-xs text-[var(--text-secondary)]">
                              Tổng calories: {' '}
                              <span className="font-semibold text-[var(--primary)]">
                                {dayPlan.totalCalories} kcal
                              </span>
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-[var(--text-secondary)]">
                              Protein: {dayPlan.totalProtein}g | Carbs: {dayPlan.totalCarbs}g | Fat: {dayPlan.totalFat}g
                            </span>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default WorkoutPlanDetailPage;
