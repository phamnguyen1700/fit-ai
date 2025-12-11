import React from 'react';
import { Flex, Button, Tabs } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { TabsProps } from 'antd';

interface PlanHeaderProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  onExport?: () => void;
  onCreatePlan?: () => void;
}

export const PlanHeader: React.FC<PlanHeaderProps> = ({
  activeTab,
  onTabChange,
  onCreatePlan,
}) => {
  const tabs: TabsProps['items'] = [
    {
      key: 'workout',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="mdi:dumbbell" size={18} />
          Kế hoạch tập luyện
        </span>
      ),
    },
    {
      key: 'meal',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="mdi:food-apple-outline" size={18} />
          Kế hoạch dinh dưỡng
        </span>
      ),
    },
    // {
    //   key: 'feedback',
    //   label: (
    //     <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    //       <Icon name="mdi:star-outline" size={18} />
    //       Các plan có feedback tốt
    //     </span>
    //   ),
    // },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
          Kế hoạch định hướng
        </h1>
        <Flex gap={12}>
          {onCreatePlan && (
            <Button
              variant="primary"
              size="md"
              icon={<Icon name="mdi:plus" size={18} />}
              onClick={onCreatePlan}
            >
              Tạo kế hoạch mới
            </Button>
          )}
        </Flex>
      </Flex>

      <Tabs
        activeKey={activeTab}
        items={tabs}
        onChange={onTabChange}
        size="large"
      />
    </div>
  );
};

export default PlanHeader;
