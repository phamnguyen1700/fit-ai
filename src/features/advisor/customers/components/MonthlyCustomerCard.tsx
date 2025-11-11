'use client';

import React from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Avatar } from '@/shared/ui/core/Avatar';
import { Flex } from '@/shared/ui/core/Flex';
import { Progress } from '@/shared/ui/core/Progress';
import { Dropdown, Tag } from 'antd';
import type { MenuProps } from 'antd';
import { Icon } from '@/shared/ui/icon';
import type { MonthlyCustomer, CustomerStatus, CustomerEngagement } from '../types';

export interface MonthlyCustomerCardProps {
  customer: MonthlyCustomer;
  onAction?: (action: string, customer: MonthlyCustomer) => void;
}

const statusConfig: Record<CustomerStatus, { label: string; color: string; bg: string }> = {
  'on-track': {
    label: 'Đúng tiến độ',
    color: 'var(--success)',
    bg: 'rgba(82, 196, 26, 0.12)',
  },
  'at-risk': {
    label: 'Cần chú ý',
    color: '#fa8c16',
    bg: 'rgba(250, 140, 22, 0.12)',
  },
  behind: {
    label: 'Bị chậm',
    color: 'var(--error)',
    bg: 'rgba(255, 77, 79, 0.12)',
  },
};

const engagementLabel: Record<CustomerEngagement, string> = {
  high: 'Tương tác cao',
  medium: 'Ổn định',
  low: 'Thấp',
};

export const MonthlyCustomerCard: React.FC<MonthlyCustomerCardProps> = ({ customer, onAction }) => {
  const handleMenuClick = (action: string) => {
    onAction?.(action, customer);
  };

  const weightColor = (value?: string) => {
    if (!value) return 'var(--text-secondary)';
    if (value.trim().startsWith('-')) return 'var(--success)';
    if (value.trim().startsWith('+')) return 'var(--error)';
    return 'var(--text-secondary)';
  };

  const items: MenuProps['items'] = [
    { key: 'details', label: 'Xem chi tiết' },
    { key: 'message', label: 'Gửi tin nhắn' },
    { key: 'plan', label: 'Cập nhật kế hoạch' },
  ];

  const status = statusConfig[customer.status];

  return (
    <Card style={{ borderRadius: 12, border: '1px solid var(--border)' }}>
      <div className="flex flex-col gap-4">
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={12} wrap>
            <Avatar size={48} src={customer.avatarUrl}>
              {customer.name.charAt(0)}
            </Avatar>
            <div>
              <div className="text-base font-semibold text-[var(--text)]">{customer.name}</div>
              <div className="text-sm text-[var(--text-secondary)]">{customer.email}</div>
              {customer.phone && (
                <div className="text-sm text-[var(--text-secondary)]">{customer.phone}</div>
              )}
            </div>
          </Flex>

          <Flex align="center" gap={8} wrap>
            <Tag
              style={{
                color: status.color,
                background: status.bg,
                borderColor: 'transparent',
              }}
            >
              {status.label}
            </Tag>
            <Dropdown
              trigger={[ 'click' ]}
              menu={{ items, onClick: ({ key }) => handleMenuClick(key) }}
            >
              <button className="h-8 w-8 grid place-items-center rounded-md border border-[var(--border)] hover:bg-[var(--bg-tertiary)]">
                <Icon name="mdi:dots-vertical" />
              </button>
            </Dropdown>
          </Flex>
        </Flex>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-[var(--text-secondary)]">Mục tiêu</div>
            <div className="text-sm text-[var(--text)]">{customer.goal}</div>
            <div className="text-sm font-semibold text-[var(--text-secondary)]">Gói hiện tại</div>
            <div className="text-sm text-[var(--primary)] font-medium">{customer.plan}</div>
            <div className="text-sm font-semibold text-[var(--text-secondary)]">Mức độ tương tác</div>
            <div className="text-sm text-[var(--text)]">{engagementLabel[customer.engagement]}</div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
              <span>Tiến độ tháng</span>
              <span className="font-semibold text-[var(--text)]">{customer.progressPercent}%</span>
            </div>
            <Progress percent={customer.progressPercent} showInfo={false} strokeWidth={12} />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <span className="text-[var(--text-secondary)]">Buổi hoàn thành</span>
              <span className="text-right font-medium text-[var(--text)]">
                {customer.sessionsCompleted}/{customer.sessionsTarget}
              </span>
              <span className="text-[var(--text-secondary)]">Lần check-in cuối</span>
              <span className="text-right text-[var(--text)]">{customer.lastCheckIn}</span>
              <span className="text-[var(--text-secondary)]">Buổi kế tiếp</span>
              <span className="text-right text-[var(--text)]">{customer.nextSession}</span>
              {customer.weightChange && (
                <>
                  <span className="text-[var(--text-secondary)]">Biến động cân nặng</span>
                  <span className="text-right font-semibold" style={{ color: weightColor(customer.weightChange) }}>
                    {customer.weightChange}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {customer.notes && (
          <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--bg-tertiary)] p-3 text-sm text-[var(--text-secondary)]">
            {customer.notes}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MonthlyCustomerCard;
