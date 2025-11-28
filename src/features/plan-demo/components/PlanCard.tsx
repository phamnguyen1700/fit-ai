import React from 'react';
import { Card, Avatar, Flex } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { PlanCardProps } from '@/types/plan';

export const PlanCard: React.FC<PlanCardProps> = ({
  userName,
  userAvatar,
  userGender,
  planName,
  planType,
  goal,
  duration,
  totalDays,
  completedDays,
  startWeight,
  targetWeight,
}) => {
  // Plan type icons
  const getPlanTypeIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return '💪';
      case 'meal':
        return '🍽️';
      case 'combined':
        return '🎯';
      default:
        return '📋';
    }
  };

  // Gender display
  const getGenderDisplay = (gender?: string) => {
    switch (gender) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      default:
        return 'Nam';
    }
  };

  return (
    <Card
      className="plan-card"
      styles={{
        body: { padding: 20 }
      }}
    >
      {/* Header with user info - removed email and status badge */}
      <Flex gap={12} align="center" style={{ marginBottom: 16 }}>
        <Avatar
          size={48}
          src={userAvatar}
          style={{ backgroundColor: '#f0f0f0' }}
        >
          {!userAvatar && userName?.charAt(0).toUpperCase()}
        </Avatar>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
            {userName}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {getGenderDisplay(userGender)}
          </div>
        </div>
      </Flex>

      {/* Plan Name with icon */}
      <Flex gap={8} align="center" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{getPlanTypeIcon(planType)}</span>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
          {planName}
        </h3>
      </Flex>

      {/* Goal with target icon AND advisor icon */}
      {goal && (
        <Flex gap={6} align="center" style={{ marginBottom: 12 }}>
          <Icon name="mdi:target" size={16} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {goal}
          </span>
        </Flex>
      )}

      {/* Duration with clock icon */}
      <Flex gap={6} align="center" style={{ marginBottom: 16 }}>
        <Icon name="mdi:clock-outline" size={16} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {duration}
        </span>
        <span style={{ margin: '0 4px', color: 'var(--text-secondary)' }}>•</span>
        <Icon name="mdi:account-tie" size={16} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Advisor</span>
        <span style={{ margin: '0 4px', color: 'var(--text-secondary)' }}>•</span>
        <Icon name="mdi:robot-outline" size={16} color="var(--text-secondary)" />
        <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>AI</span>
      </Flex>


      {/* Stats Section - Tổng ngày tập và Mục tiêu */}
      <Flex 
        justify="space-between" 
        style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          padding: '12px 16px', 
          borderRadius: '8px' 
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
            Tổng ngày tập
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
            {totalDays} ngày
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
            Mục tiêu
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
            {startWeight && targetWeight ? `${startWeight}kg → ${targetWeight}kg` : `${completedDays || 0} ngày`}
          </div>
        </div>
      </Flex>
    </Card>
  );
};

export default PlanCard;
