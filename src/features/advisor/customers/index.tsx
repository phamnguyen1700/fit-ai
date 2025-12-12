'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Icon } from '@/shared/ui/icon';
import { MonthlyCustomerFilter } from './components/MonthlyCustomerFilter';
import { MonthlyCustomerTable } from './components/MonthlyCustomerTable';
import { useRouter } from 'next/navigation';
import { useAdvisorDashboardCustomers } from '@/tanstack/hooks/advisordashboard';
import type { AdvisorDashboardCustomer, MonthlyCustomer } from '@/types/advisordashboard';

const MONTH_OPTIONS_COUNT = 6;

const formatMonthLabel = (value: string) => {
  if (!value) return 'Tất cả tháng';
  const [year, month] = value.split('-');
  const monthNumber = Number(month);
  return `Tháng ${monthNumber}/${year}`;
};

const buildRecentMonthOptions = (count: number): { value: string; label: string }[] => {
  const options: { value: string; label: string }[] = [];
  const today = new Date();

  for (let i = 0; i < count; i += 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    options.push({
      value,
      label: formatMonthLabel(value),
    });
  }

  return options;
};

const parseMonthValue = (value: string) => {
  const [year, month] = value.split('-');

  return {
    year: Number(year),
    month: Number(month),
  };
};

const ensureStatus = (value?: string): MonthlyCustomer['status'] => {
  if (value === 'on-track' || value === 'at-risk' || value === 'behind') {
    return value;
  }
  return 'on-track';
};

const ensureEngagement = (value?: string): MonthlyCustomer['engagement'] => {
  if (value === 'high' || value === 'medium' || value === 'low') {
    return value;
  }
  return 'medium';
};

type ExtendedAdvisorCustomer = AdvisorDashboardCustomer & {
  completedSessions?: number;
  totalSessions?: number;
  targetSessions?: number;
  userId?: string;
  contactEmail?: string;
  contactPhone?: string;
  profilePictureUrl?: string;
  coachingGoal?: string;
  planName?: string;
  monthlyProgress?: number;
  lastCheckin?: string;
  month?: string;
};
const normalizeCustomer = (customer: ExtendedAdvisorCustomer, fallbackMonth: string, index: number): MonthlyCustomer => {
  const sessionsCompleted = Number(customer?.sessionsCompleted ?? customer?.completedSessions ?? 0);
  const sessionsTarget = Number(customer?.totalSessions ?? customer?.sessionsTarget ?? customer?.targetSessions ?? 0) || 1;
  const derivedProgress = Math.round(Math.min(100, Math.max(0, (sessionsCompleted / sessionsTarget) * 100)));

  const name =
    customer?.name ||
    [customer?.firstName, customer?.lastName].filter(Boolean).join(' ').trim() ||
    'Chưa cập nhật';

  return {
    id: customer?.userId || customer?.id || customer?.customerId || `customer-${fallbackMonth}-${index}`,
    name,
    email: customer?.email || customer?.contactEmail || 'Không có email',
    phone: customer?.phone || customer?.contactPhone,
    avatarUrl: customer?.avatarUrl || customer?.profilePictureUrl,
    month: customer?.month || fallbackMonth,
    goal: customer?.goal || customer?.coachingGoal || 'Chưa cập nhật mục tiêu',
    plan: customer?.plan || customer?.planName || 'Chưa có kế hoạch',
    status: ensureStatus(customer?.status),
    engagement: ensureEngagement(customer?.engagement),
    sessionsCompleted,
    sessionsTarget,
    progressPercent: Number(customer?.monthlyProgress ?? customer?.progressPercent ?? derivedProgress),
    lastCheckIn: customer?.lastCheckIn || customer?.lastCheckin || 'Chưa cập nhật',
    nextSession: customer?.nextSession || 'Chưa sắp lịch',
    weightChange: customer?.weightChange,
    notes: customer?.notes,
  };
};

const computeSummary = (data: MonthlyCustomer[]) => {
  const monthCustomers = data;
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
  const monthOptions = useMemo(() => buildRecentMonthOptions(MONTH_OPTIONS_COUNT), []);
  const fallbackMonthValue = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);
  const defaultMonth = monthOptions[0]?.value ?? fallbackMonthValue;
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);

  const { month, year } = useMemo(() => parseMonthValue(selectedMonth), [selectedMonth]);

  const { data, isLoading, isFetching } = useAdvisorDashboardCustomers({
    month,
    year,
    page: 1,
    pageSize: 50,
  });

  const normalizedCustomers = useMemo(() => {
    console.log('📊 [Component] Raw data:', data);
    console.log('📊 [Component] Data.data:', data?.data);
    console.log('📊 [Component] Customers array:', data?.data?.customers);
    
    if (!data?.data?.customers?.length) {
      console.log('⚠️ [Component] No customers found');
      return [] as MonthlyCustomer[];
    }

    const normalized = data.data.customers.map((customer: AdvisorDashboardCustomer, index: number) => {
      const normalizedCustomer = normalizeCustomer(customer, selectedMonth, index);
      console.log(`📝 [Component] Customer ${index}:`, customer, '→', normalizedCustomer);
      return normalizedCustomer;
    });
    
    console.log('✅ [Component] Normalized customers:', normalized);
    return normalized;
  }, [data, selectedMonth]);

  const filteredCustomers = useMemo(() => {
    return normalizedCustomers
      .sort((a, b) => b.progressPercent - a.progressPercent);
  }, [normalizedCustomers]);

  const summary = useMemo(() => {
    if (data?.data) {
      return {
        total: data.data.totalCustomersThisMonth ?? normalizedCustomers.length,
        needFeedback: normalizedCustomers.filter((item) => item.status === 'at-risk' || item.status === 'behind').length,
      };
    }
    return computeSummary(normalizedCustomers);
  }, [data, normalizedCustomers]);

  const handleCustomerAction = (action: string, customer: MonthlyCustomer) => {
    if (action === 'details') {
      router.push(`/advisor/customers/${customer.id}`);
      return;
    }

    console.log('Advisor action', action, customer.id);
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
          />

          {isLoading && (
            <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-tertiary)]/40 p-6 text-center text-sm text-[var(--text-secondary)]">
              Đang tải dữ liệu khách hàng...
            </div>
          )}

          {!isLoading && filteredCustomers.length === 0 && (
            <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-tertiary)]/60 p-6 text-center text-sm text-[var(--text-secondary)]">
              Không có khách hàng nào trong tháng đã chọn.
            </div>
          )}

          {!isLoading && filteredCustomers.length > 0 && (
            <MonthlyCustomerTable customers={filteredCustomers} onAction={handleCustomerAction} />
          )}

          {isFetching && !isLoading && (
            <div className="text-xs text-center text-[var(--text-secondary)]">
              Đang cập nhật dữ liệu...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdvisorMonthlyCustomers;
