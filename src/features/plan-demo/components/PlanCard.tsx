import React from 'react';
import { Card, Avatar, Badge, Progress, Button, Flex } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { PlanCardProps } from '@/types/plan';

export const PlanCard: React.FC<PlanCardProps> = ({
  id,
  userName,
  userEmail,
  userAvatar,
  planName,
  planType,
  goal,
  duration,
  status,
  totalDays,
  completedDays,
  progress,
  generatedBy,
  onView,
  onEdit,
  onDelete,
}) => {
  // Status badge colors
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'Đang hoạt động', color: 'success' };
      case 'completed':
        return { text: 'Hoàn thành', color: 'default' };
      case 'pending':
        return { text: 'Đang chờ', color: 'warning' };
      case 'cancelled':
        return { text: 'Định dưỡng', color: 'error' };
      default:
        return { text: status, color: 'default' };
    }
  };

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

  const statusConfig = getStatusConfig(status);

  return (
    <Card
      className="plan-card"
      styles={{
        body: { padding: 20 }
      }}
    >
      {/* Header with user info and status */}
      <Flex justify="space-between" align="flex-start" style={{ marginBottom: 16 }}>
        <Flex gap={12} align="center">
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
              {userEmail}
            </div>
          </div>
        </Flex>
        <Badge 
          status={statusConfig.color as any} 
          text={statusConfig.text}
        />
      </Flex>

      {/* Plan info */}
      <div style={{ marginBottom: 16 }}>
        <Flex gap={8} align="center" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>{getPlanTypeIcon(planType)}</span>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            {planName}
          </h3>
        </Flex>
        
        {goal && (
          <Flex gap={6} align="center" style={{ marginBottom: 6 }}>
            <Icon name="mdi:target" size={16} color="var(--text-secondary)" />
            <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {goal}
            </span>
          </Flex>
        )}

        <Flex gap={6} align="center">
          <Icon name="mdi:clock-outline" size={16} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {duration}
          </span>
          <span style={{ margin: '0 4px', color: 'var(--text-secondary)' }}>•</span>
          <Icon name="mdi:robot-outline" size={16} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {generatedBy === 'ai' ? 'AI' : 'Manual'}
          </span>
        </Flex>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Tiến độ</span>
          <span style={{ float: 'right', fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>
            {progress}%
          </span>
        </div>
        <Progress percent={progress} showInfo={false} />
      </div>

      {/* Stats */}
      <Flex justify="space-between" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
            Tổng ngày {planType === 'workout' ? 'tập' : 'ăn'}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {totalDays} ngày
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
            Đã hoàn thành
          </div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {completedDays} ngày
          </div>
        </div>
      </Flex>

      {/* Actions */}
      <Flex gap={8} justify="flex-end">
        <Button
          variant="ghost"
          size="sm"
          icon={<Icon name="mdi:eye-outline" size={16} />}
          onClick={() => onView?.(id)}
        >
          Xem chi tiết
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit?.(id)}
        >
          <Icon name="mdi:pencil-outline" size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          danger
          onClick={() => onDelete?.(id)}
        >
          <Icon name="mdi:delete-outline" size={16} />
        </Button>
      </Flex>
    </Card>
  );
};

export default PlanCard;
