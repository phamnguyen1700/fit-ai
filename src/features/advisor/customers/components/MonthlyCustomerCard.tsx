'use client';

import React from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Avatar } from '@/shared/ui/core/Avatar';
import { Flex } from '@/shared/ui/core/Flex';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Icon } from '@/shared/ui/icon';
import type { MonthlyCustomer } from '@/types/advisordashboard';
import { useRouter } from 'next/navigation';

export interface MonthlyCustomerCardProps {
  customer: MonthlyCustomer;
  onAction?: (action: string, customer: MonthlyCustomer) => void;
}

export const MonthlyCustomerCard: React.FC<MonthlyCustomerCardProps> = ({ customer, onAction }) => {
  const router = useRouter();

  const handleMenuClick = (action: string) => {
    if (onAction) {
      onAction(action, customer);
      return;
    }

    if (action === 'details') {
      router.push(`/advisor/customers/${customer.id}`);
    }
  };

  const items: MenuProps['items'] = [
    { key: 'details', label: 'Xem chi tiết' },
  ];

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col gap-6 h-full">
        {/* Header Section */}
        <Flex align="center" justify="space-between" className="flex-shrink-0 pt-12 pb-6">
          <Flex align="center" gap={14} wrap>
            <Avatar size={56} src={customer.avatarUrl} className="flex-shrink-0 ring-2 ring-[var(--border)] ring-offset-2 ring-offset-white">
              {customer.name.charAt(0)}
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-semibold text-[var(--text)] mb-1">{customer.name}</div>
              <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                <Icon name="mdi:email-outline" size={14} />
                <span className="truncate">{customer.email}</span>
              </div>
            </div>
          </Flex>

          <Dropdown
            trigger={['click']}
            menu={{ items, onClick: ({ key }) => handleMenuClick(key) }}
          >
            <button className="h-9 w-9 flex-shrink-0 grid place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--primary)]/40 hover:shadow-sm transition-all duration-200">
              <Icon name="mdi:dots-vertical" size={18} />
            </button>
          </Dropdown>
        </Flex>

        {/* Content Section */}
        <div className="flex flex-col gap-5 flex-1 min-h-0">
          {/* Goal Section */}
          <div className="flex-shrink-0">
            <div className="flex items-center align-center gap-2 mb-3">
              <Icon name="mdi:target" size={16} className="text-[var(--primary)]" />
              <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Mục tiêu</div>
              <div className="text-sm text-[var(--text)] leading-relaxed pl-6">{customer.goal}</div>
            </div>
            {/* <div className="text-sm text-[var(--text)] leading-relaxed pl-6">{customer.goal}</div> */}
          </div>

          {/* Stats Section */}
          <div className="flex-shrink-0 bg-[var(--bg-tertiary)] rounded-lg p-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Icon name="mdi:check-circle-outline" size={16} />
                  <span>Buổi hoàn thành</span>
                </div>
                <span className="text-sm font-bold text-[var(--text)]">
                  {customer.sessionsCompleted}/{customer.sessionsTarget}
                </span>
              </div>
              
              <div className="h-px bg-[var(--border)]" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Icon name="mdi:calendar-check-outline" size={16} />
                  <span>Lần check-in cuối</span>
                </div>
                <span className="text-sm font-medium text-[var(--text)]">{customer.lastCheckIn}</span>
              </div>
              
              <div className="h-px bg-[var(--border)]" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Icon name="mdi:calendar-clock-outline" size={16} />
                  <span>Buổi kế tiếp</span>
                </div>
                <span className="text-sm font-medium text-[var(--text)]">{customer.nextSession}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MonthlyCustomerCard;

