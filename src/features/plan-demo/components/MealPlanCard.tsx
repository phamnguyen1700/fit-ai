import React, { useMemo } from 'react';
import { Card, Button, Flex } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { MealPlanDetail } from '@/types/plan';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

interface MealPlanCardProps {
  plan: MealPlanDetail;
  onViewDetails?: (plan: MealPlanDetail) => void;
  onUpdate?: (plan: MealPlanDetail) => void;
  onDeactivate?: (plan: MealPlanDetail) => void;
  onDelete?: (plan: MealPlanDetail) => void;
}

const formatNumber = (value: number) => value.toLocaleString('vi-VN');

export const MealPlanCard: React.FC<MealPlanCardProps> = ({
  plan,
  onViewDetails,
  onUpdate,
  onDeactivate,
  onDelete,
}) => {
  const hasDetails =
    (plan.menus ?? []).length > 0 || (plan.totalMenus ?? 0) > 0;
  const isDeleted = plan.isDeleted ?? false;

  const statusConfig = useMemo(
    () => ({
      label: isDeleted ? 'Không hoạt động' : 'Đang hoạt động',
      icon: isDeleted ? 'mdi:close-circle-outline' : 'mdi:check-circle-outline',
      color: isDeleted ? 'var(--danger)' : 'var(--success)',
      background: isDeleted ? 'rgba(255, 71, 87, 0.12)' : 'rgba(34, 197, 94, 0.12)',
    }),
    [isDeleted]
  );

  const menuItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: 'update',
        label: 'Cập nhật meal plan',
      },
      {
        key: 'deactivate',
        label: 'Vô hiệu hoá meal plan',
      },
      {
        key: 'delete',
        label: 'Xoá meal plan',
        danger: true,
      },
    ],
    []
  );

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'update':
        onUpdate?.(plan);
        break;
      case 'deactivate':
        onDeactivate?.(plan);
        break;
      case 'delete':
        onDelete?.(plan);
        break;
      default:
        break;
    }
  };

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
      <Flex justify="space-between" align="flex-start" style={{ marginBottom: 16 }}>
        {/* Plan Name */}
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--text)',
            maxWidth: 'calc(100% - 48px)',
          }}
        >
          {plan.planName}
        </h2>
        <Dropdown
          trigger={['click']}
          menu={{ items: menuItems, onClick: handleMenuClick }}
        >
          <button
            type="button"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid var(--border)',
              display: 'grid',
              placeItems: 'center',
              background: 'var(--bg-secondary)',
              cursor: 'pointer',
            }}
            aria-label="Thao tác với meal plan"
          >
            <Icon name="mdi:dots-vertical" size={18} color="var(--text-secondary)" />
          </button>
        </Dropdown>
      </Flex>

      <Flex gap={6} align="center" style={{ marginBottom: 20 }}>
        <Icon name={statusConfig.icon} size={18} color={statusConfig.color} />
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: statusConfig.color,
            backgroundColor: statusConfig.background,
            padding: '4px 10px',
            borderRadius: 999,
          }}
        >
          {statusConfig.label}
        </span>
      </Flex>

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
        disabled={!hasDetails}
        icon={<Icon name="mdi:eye" size={18} />}
      >
        Xem chi tiết
      </Button>
    </Card>
  );
};

export default MealPlanCard;
