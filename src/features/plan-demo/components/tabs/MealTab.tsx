'use client';

import React, { useMemo, useState } from 'react';
import { Row, Col, Flex } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import { MealPlanCard } from '../MealPlanCard';
import { MealPlanDetailModal } from '../MealPlanDetailModal';
import { mockMealPlanDetails } from '../../data/mockMealPlanDetails';
import type { MealPlanDetail } from '@/types/plan';

const MealTab: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<MealPlanDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalCaloriesInLibrary = useMemo(
    () =>
      mockMealPlanDetails.reduce((acc, plan) => {
        const planCalories = plan.menus.reduce(
          (planTotal, menu) =>
            planTotal +
            menu.meals.reduce(
              (menuTotal, meal) => menuTotal + meal.totalCalories,
              0,
            ),
          0,
        );

        return acc + planCalories;
      }, 0),
    [],
  );

  const handleViewDetails = (plan: MealPlanDetail) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="meal-tab-container">
      {/* <header className="meal-tab-header">
        <div className="meal-tab-header__title">
          <h2>Thư viện kế hoạch dinh dưỡng</h2>
          <p>
            {mockMealPlanDetails.length} kế hoạch • {totalCaloriesInLibrary.toLocaleString('vi-VN')} kcal tổng cộng
          </p>
        </div>
        <Flex gap={8} align="center" className="meal-tab-header__legend">
          <Icon name="mdi:calendar-check" size={18} color="var(--primary)" />
          <span>Click vào từng thẻ để xem thực đơn chi tiết từng ngày.</span>
        </Flex>
      </header> */}

      <Row gutter={[16, 16]} className="meal-plan-card-grid">
        {mockMealPlanDetails.map((plan) => (
          <Col xs={24} md={12} xl={8} key={plan.id}>
            <MealPlanCard plan={plan} onViewDetails={handleViewDetails} />
          </Col>
        ))}
      </Row>

      <MealPlanDetailModal open={isModalOpen} plan={selectedPlan} onClose={handleCloseModal} />
    </div>
  );
};

export default MealTab;
