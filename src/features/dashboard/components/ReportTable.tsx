import React from 'react';

import ReportCard, { ReportCardItem } from '@/shared/ui/common/ReportCard';
import { useRevenueStats } from '@/tanstack/hooks/analytics';

const formatCurrency = (value: number, currency: string) => {
  const normalizedCurrency = currency?.toLowerCase();
  if (normalizedCurrency === 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }

  return `${new Intl.NumberFormat('vi-VN').format(value)} đ`;
};

const fallbackReportItems: ReportCardItem[] = [
  { label: 'Doanh thu', value: '--', unit: '' },
  { label: 'Người dùng hiện tại', value: '--', unit: '' },
  { label: 'Số bài tập', value: '--', unit: '' },
  { label: 'Feedback mới', value: '--', unit: '' },
  { label: 'Số thực đơn', value: '--', unit: '' },
  { label: 'Số gói đã tạo', value: '--', unit: '' },
];

const ReportTable: React.FC = () => {
  const { data, isLoading, isError } = useRevenueStats();
  const revenueStats = data?.data;

  const revenueItems: ReportCardItem[] = [
    {
      label: 'Tổng doanh thu',
      value: revenueStats ? formatCurrency(revenueStats.totalRevenue ?? 0, revenueStats.currency ?? 'VND') : '--',
      unit: '',
    },
    {
      label: 'Doanh thu tháng này',
      value: revenueStats ? formatCurrency(revenueStats.revenueThisMonth ?? 0, revenueStats.currency ?? 'VND') : '--',
      unit: '',
    },
    {
      label: 'Thanh toán tháng này',
      value: revenueStats?.paymentsThisMonth ?? '--',
      unit: 'giao dịch',
    },
    {
      label: 'Trung bình mỗi giao dịch',
      value: revenueStats ? formatCurrency(revenueStats.averagePayment ?? 0, revenueStats.currency ?? 'VND') : '--',
      unit: '',
    },
    {
      label: 'Tổng giao dịch',
      value: revenueStats?.totalPayments ?? '--',
      unit: 'giao dịch',
    },
    {
      label: 'Doanh thu hôm nay',
      value: revenueStats ? formatCurrency(revenueStats.revenueToday ?? 0, revenueStats.currency ?? 'VND') : '--',
      unit: '',
    },
  ];

  const displayItems = isError
    ? fallbackReportItems
    : revenueStats
      ? revenueItems
      : fallbackReportItems.map((item) => ({
        ...item,
        value: isLoading ? 'Đang tải...' : item.value,
      }));

  return (
    <div className="w-full rounded-2xl bg p-6 shadow [bg-[var(--bg)]]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text font-semibold text-xl">Tổng quan thống kê</h2>
      </div>
      <ReportCard items={displayItems} />
    </div>
  );
};

export default ReportTable;
