import React from 'react';
import { Card, Button, Flex } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { MealPlanDetail } from '@/types/plan';

interface MealPlanCardProps {
  plan: MealPlanDetail;
  onViewDetails?: (plan: MealPlanDetail) => void;
}

const formatNumber = (value: number) => value.toLocaleString('vi-VN');

const calculatePlanCalories = (plan: MealPlanDetail) =>
  (plan.menus ?? []).reduce(
    (acc, menu) =>
      acc +
      (menu.meals ?? []).reduce(
        (menuTotal, meal) => menuTotal + (meal?.totalCalories ?? 0),
        0,
      ),
    0,
  );

export const MealPlanCard: React.FC<MealPlanCardProps> = ({ plan, onViewDetails }) => {
  const totalPlanCalories = Math.round(calculatePlanCalories(plan));

  return (
    <Card
      className="meal-plan-card"
      style={{
        width: '100%',
        height: '100%',
      }}
      styles={{
        body: { padding: 24 },
      }}
    >
      {/* Plan Name */}
      <h2 style={{ 
        margin: '0 0 20px 0', 
        fontSize: 20, 
        fontWeight: 600, 
        color: 'var(--text)' 
      }}>
        {plan.planName}
      </h2>

      {/* Goal */}
      {plan.goal && (
        <Flex gap={8} align="center" style={{ marginBottom: 20 }}>
          <Icon name="mdi:target" size={18} color="var(--primary)" />
          <span style={{ fontSize: 14, color: 'var(--text)' }}>
            {plan.goal}
          </span>
        </Flex>
      )}

      {/* Summary Stats */}
      <Flex gap={16} style={{ marginBottom: 20, flexWrap: 'wrap' }}>
        <Flex gap={8} align="center">
          <Icon name="mdi:fire" size={20} color="var(--warning)" />
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {formatNumber(plan.totalCaloriesPerDay)} kcal/ngày
          </span>
        </Flex>
        <Flex gap={8} align="center">
          <Icon name="mdi:calendar-multiple" size={20} color="var(--primary)" />
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {plan.totalMenus} thực đơn
          </span>
        </Flex>
      </Flex>

      {/* View Details Button */}
      <Button
        variant="primary"
        block
        onClick={() => onViewDetails?.(plan)}
        icon={<Icon name="mdi:eye" size={18} />}
      >
        Xem chi tiết
      </Button>
    </Card>
  );
};

export default MealPlanCard;
