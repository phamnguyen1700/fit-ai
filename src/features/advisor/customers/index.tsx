'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Flex } from '@/shared/ui/core/Flex';
import { Icon } from '@/shared/ui/icon';
import { MonthlyCustomerFilter } from './components/MonthlyCustomerFilter';
import { MonthlyCustomerTable } from './components/MonthlyCustomerTable';
import type { MonthlyCustomer } from './types';
import { MONTHLY_CUSTOMERS } from './data';
import { useRouter } from 'next/navigation';

const formatMonthLabel = (value: string) => {
  if (!value) return 'Tất cả tháng';
  const [year, month] = value.split('-');
  const monthNumber = Number(month);
  return `Tháng ${monthNumber}/${year}`;
};

const getMonthOptions = (data: MonthlyCustomer[]) => {
  const uniqueMonths = Array.from(new Set(data.map((item) => item.month))).sort((a, b) => (a < b ? 1 : -1));
  return uniqueMonths.map((value) => ({ value, label: formatMonthLabel(value) }));
};

const DEFAULT_MONTH = getMonthOptions(MONTHLY_CUSTOMERS)[0]?.value ?? '';

const computeSummary = (data: MonthlyCustomer[], month: string) => {
  const monthCustomers = data.filter((item) => (month ? item.month === month : true));
  const total = monthCustomers.length;
  const needFeedback = monthCustomers.filter((item) => item.status === 'at-risk' || item.status === 'behind').length;

  return {
    total,
    needFeedback,
  };
};

const SummaryTile: React.FC<{ icon: string; label: string; value: React.ReactNode; helper?: React.ReactNode; accent?: string; iconColor?: string }> = ({ icon, label, value, helper, accent, iconColor }) => (
  <div className="group relative flex flex-1 min-w-[200px] items-center gap-4 rounded-lg bg-white p-4 transition-all duration-200 hover:shadow-sm">
    <div
      className="flex h-14 w-14 items-center justify-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-110"
      style={{
        background: accent ?? 'rgba(56, 189, 248, 0.12)'
      }}
    >
      <Icon name={icon} size={24} color={iconColor ?? 'var(--primary)'} />
    </div>
    <div className="flex flex-1 flex-col gap-1">
      <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
      <span className="text-2xl font-bold text-[var(--text)]">{value}</span>
      {helper && <span className="mt-1 text-xs font-medium text-[var(--text-secondary)]">{helper}</span>}
    </div>
  </div>
);

export const AdvisorMonthlyCustomers: React.FC = () => {
  const router = useRouter();
  const [customers] = useState<MonthlyCustomer[]>(MONTHLY_CUSTOMERS);
  const [selectedMonth, setSelectedMonth] = useState<string>(DEFAULT_MONTH);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const monthOptions = useMemo(() => getMonthOptions(customers), [customers]);

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((item) => (selectedMonth ? item.month === selectedMonth : true))
      .filter((item) => (selectedStatus === 'all' ? true : item.status === selectedStatus))
      .sort((a, b) => b.progressPercent - a.progressPercent);
  }, [customers, selectedMonth, selectedStatus]);

  const summary = useMemo(() => computeSummary(customers, selectedMonth), [customers, selectedMonth]);

  const handleCustomerAction = (action: string, customer: MonthlyCustomer) => {
    if (action === 'details') {
      router.push(`/advisor/customers/${customer.id}`);
      return;
    }

    console.log('Advisor action', action, customer.id);
  };

  const handleCreatePlan = () => {
    console.log('Create new coaching plan');
  };

  const handleMoreAction = (action: string) => {
    console.log('Advisor bulk action', action);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SummaryTile
            icon="mdi:account-group-outline"
            label="Khách hàng tháng này"
            value={summary.total}
            accent="rgba(56, 189, 248, 0.12)"
            iconColor="var(--primary)"
          />
          <SummaryTile
            icon="mdi:alert-circle-outline"
            label="Cần feedback"
            value={summary.needFeedback}
            helper="Ưu tiên liên hệ"
            accent="rgba(250, 140, 22, 0.12)"
            iconColor="#fa8c16"
          />
        </div>
      </Card>

      <Card
        title={<span className="text-base font-semibold text-[var(--text)]">Quản lý khách hàng tháng {formatMonthLabel(selectedMonth).replace('Tháng ', '')}</span>}
      >
        <div className="flex flex-col gap-4">
          <MonthlyCustomerFilter
            months={monthOptions}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onCreatePlan={handleCreatePlan}
            onMoreAction={handleMoreAction}
          />

          <MonthlyCustomerTable customers={filteredCustomers} onAction={handleCustomerAction} />
        </div>
      </Card>
    </div>
  );
};

export default AdvisorMonthlyCustomers;
