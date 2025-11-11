'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Flex } from '@/shared/ui/core/Flex';
import { Icon } from '@/shared/ui/icon';
import { MonthlyCustomerFilter } from './components/MonthlyCustomerFilter';
import { MonthlyCustomerTable } from './components/MonthlyCustomerTable';
import type { MonthlyCustomer } from './types';

const FAKE_CUSTOMERS: MonthlyCustomer[] = [
  {
    id: 'cus-001',
    name: 'Trần Hoàng Minh',
    email: 'minh.th@fitai.com',
    phone: '0901 234 567',
    month: '2025-11',
    goal: 'Giảm 3kg và cải thiện sức bền',
  plan: 'Gói Premium 3 tháng',
    status: 'on-track',
    engagement: 'high',
    sessionsCompleted: 7,
    sessionsTarget: 12,
    progressPercent: 64,
    lastCheckIn: '10/11/2025',
    nextSession: '14/11/2025',
    weightChange: '-1.2kg',
    notes: 'Rất chủ động ghi chép bài tập và phản hồi sau mỗi buổi.',
  },
  {
    id: 'cus-002',
    name: 'Nguyễn Thị Hạnh',
    email: 'hanh.nt@fitai.com',
    phone: '0907 888 123',
    month: '2025-11',
    goal: 'Cân bằng dinh dưỡng và giảm mỡ bụng',
  plan: 'Gói Dinh dưỡng 1-1',
    status: 'at-risk',
    engagement: 'medium',
    sessionsCompleted: 5,
    sessionsTarget: 10,
    progressPercent: 48,
    lastCheckIn: '08/11/2025',
    nextSession: '13/11/2025',
    weightChange: '-0.4kg',
    notes: 'Cần nhắc lịch ăn và ngủ đều đặn hơn trong tuần này.',
  },
  {
    id: 'cus-003',
    name: 'Phạm Quốc Toàn',
    email: 'toan.pq@fitai.com',
    phone: '0912 456 789',
    month: '2025-11',
    goal: 'Tăng cơ tay và ngực',
  plan: 'Training Plan 12 buổi',
    status: 'on-track',
    engagement: 'high',
    sessionsCompleted: 8,
    sessionsTarget: 12,
    progressPercent: 72,
    lastCheckIn: '11/11/2025',
    nextSession: '15/11/2025',
    weightChange: '+0.8kg',
  },
  {
    id: 'cus-004',
    name: 'Lê Thanh Ngọc',
    email: 'ngoc.lt@fitai.com',
    month: '2025-11',
    goal: 'Cải thiện chất lượng giấc ngủ',
  plan: 'Wellness Coaching',
    status: 'behind',
    engagement: 'low',
    sessionsCompleted: 3,
    sessionsTarget: 8,
    progressPercent: 30,
    lastCheckIn: '03/11/2025',
    nextSession: '17/11/2025',
    notes: 'Khó duy trì lịch trình do công việc tăng cao.',
  },
  {
    id: 'cus-005',
    name: 'Đỗ Tấn Phát',
    email: 'phat.dt@fitai.com',
    phone: '0933 222 456',
    month: '2025-11',
    goal: 'Giảm 5% mỡ cơ thể',
  plan: 'Hybrid Nutrition & Training',
    status: 'on-track',
    engagement: 'medium',
    sessionsCompleted: 6,
    sessionsTarget: 12,
    progressPercent: 58,
    lastCheckIn: '09/11/2025',
    nextSession: '16/11/2025',
    weightChange: '-1.0kg',
  },
  {
    id: 'cus-006',
    name: 'Vũ Hoài Nam',
    email: 'nam.vh@fitai.com',
    phone: '0915 678 910',
    month: '2025-11',
    goal: 'Tăng sức bền tim mạch',
  plan: 'Endurance Advance',
    status: 'at-risk',
    engagement: 'medium',
    sessionsCompleted: 4,
    sessionsTarget: 10,
    progressPercent: 42,
    lastCheckIn: '06/11/2025',
    nextSession: '14/11/2025',
    notes: 'Cần điều chỉnh cường độ bài tập để phù hợp thể trạng.',
  },
  {
    id: 'cus-007',
    name: 'Huỳnh Mỹ Duyên',
    email: 'duyen.hm@fitai.com',
    month: '2025-11',
    goal: 'Tăng năng lượng và cân bằng hormone',
  plan: 'Wellness+ 1 năm',
    status: 'on-track',
    engagement: 'high',
    sessionsCompleted: 9,
    sessionsTarget: 12,
    progressPercent: 78,
    lastCheckIn: '12/11/2025',
    nextSession: '18/11/2025',
  },
  {
    id: 'cus-008',
    name: 'Bùi Văn Hải',
    email: 'hai.bv@fitai.com',
    month: '2025-11',
    goal: 'Chuẩn bị giải chạy 10km',
  plan: 'Race Builder 8 tuần',
    status: 'behind',
    engagement: 'medium',
    sessionsCompleted: 2,
    sessionsTarget: 8,
    progressPercent: 25,
    lastCheckIn: '02/11/2025',
    nextSession: '13/11/2025',
    notes: 'Đề xuất chuyển sang lịch tập buổi sáng.',
  },
  {
    id: 'cus-009',
    name: 'Ngô Thảo Vy',
    email: 'vy.nt@fitai.com',
    phone: '0977 123 999',
    month: '2025-11',
    goal: 'Cải thiện dáng và săn cơ',
  plan: 'Coaching PT 24 buổi',
    status: 'on-track',
    engagement: 'high',
    sessionsCompleted: 10,
    sessionsTarget: 16,
    progressPercent: 68,
    lastCheckIn: '09/11/2025',
    nextSession: '13/11/2025',
  },
  {
    id: 'cus-010',
    name: 'Lý Đức Anh',
    email: 'anh.ld@fitai.com',
    month: '2025-10',
    goal: 'Tăng cân lành mạnh',
  plan: 'Nutrition Coaching 3 tháng',
    status: 'on-track',
    engagement: 'medium',
    sessionsCompleted: 10,
    sessionsTarget: 12,
    progressPercent: 82,
    lastCheckIn: '26/10/2025',
    nextSession: '31/10/2025',
    weightChange: '+2.2kg',
  },
  {
    id: 'cus-011',
    name: 'Phan Thanh Bình',
    email: 'binh.pt@fitai.com',
    month: '2025-10',
    goal: 'Giảm đau lưng và cải thiện tư thế',
  plan: 'Physio Mobility',
    status: 'at-risk',
    engagement: 'low',
    sessionsCompleted: 4,
    sessionsTarget: 10,
    progressPercent: 40,
    lastCheckIn: '18/10/2025',
    nextSession: '25/10/2025',
    notes: 'Chưa sắp xếp được lịch cố định, cần trao đổi thêm.',
  },
  {
    id: 'cus-012',
    name: 'Đinh Thị Mai',
    email: 'mai.dt@fitai.com',
    month: '2025-10',
    goal: 'Duy trì vóc dáng và kiểm soát stress',
  plan: 'Wellness Coaching',
    status: 'on-track',
    engagement: 'high',
    sessionsCompleted: 11,
    sessionsTarget: 12,
    progressPercent: 90,
    lastCheckIn: '28/10/2025',
    nextSession: '01/11/2025',
  },
];

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

const DEFAULT_MONTH = getMonthOptions(FAKE_CUSTOMERS)[0]?.value ?? '';

const computeSummary = (data: MonthlyCustomer[], month: string) => {
  const monthCustomers = data.filter((item) => (month ? item.month === month : true));
  const total = monthCustomers.length;
  const onTrack = monthCustomers.filter((item) => item.status === 'on-track').length;
  const atRisk = monthCustomers.filter((item) => item.status === 'at-risk').length;
  const behind = monthCustomers.filter((item) => item.status === 'behind').length;
  const avgProgress = monthCustomers.reduce((sum, item) => sum + item.progressPercent, 0) / (total || 1);
  const completionRate = monthCustomers.reduce((sum, item) => sum + item.sessionsCompleted, 0) /
    (monthCustomers.reduce((sum, item) => sum + item.sessionsTarget, 0) || 1);

  return {
    total,
    onTrack,
    atRisk,
    behind,
    avgProgress: Math.round(avgProgress),
    completionRate: Math.round(completionRate * 100),
  };
};

const SummaryTile: React.FC<{ icon: string; label: string; value: React.ReactNode; helper?: React.ReactNode; accent?: string; iconColor?: string }> = ({ icon, label, value, helper, accent, iconColor }) => (
  <div className="flex flex-1 min-w-[160px] items-center gap-3 rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
    <div className="flex h-10 w-10 items-center justify-center rounded-md" style={{ background: accent ?? 'rgba(56, 189, 248, 0.12)' }}>
      <Icon name={icon} size={20} color={iconColor ?? 'var(--primary)'} />
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <span className="text-lg font-semibold text-[var(--text)]">{value}</span>
      {helper && <span className="text-xs text-[var(--text-secondary)]">{helper}</span>}
    </div>
  </div>
);

export const AdvisorMonthlyCustomers: React.FC = () => {
  const [customers] = useState<MonthlyCustomer[]>(FAKE_CUSTOMERS);
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
        <Flex wrap="wrap" gap={16} className="md:flex-nowrap">
          <SummaryTile icon="mdi:account-group-outline" label="Tổng khách hàng" value={summary.total} helper={`${summary.behind} chậm tiến độ`} />
          <SummaryTile icon="mdi:check-circle-outline" label="Đúng tiến độ" value={summary.onTrack} accent="rgba(82,196,26,0.12)" iconColor="var(--success)" />
          <SummaryTile icon="mdi:alert-circle-outline" label="Cần chú ý" value={summary.atRisk} helper="Ưu tiên liên hệ" accent="rgba(250,140,22,0.12)" iconColor="#fa8c16" />
          <SummaryTile icon="mdi:progress-check" label="Tiến độ trung bình" value={`${summary.avgProgress}%`} helper={`Hoàn thành buổi ${summary.completionRate}%`} accent="rgba(56,189,248,0.12)" />
        </Flex>
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
