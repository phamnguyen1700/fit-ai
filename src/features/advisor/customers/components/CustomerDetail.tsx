'use client';

import React, { useMemo } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Avatar } from '@/shared/ui/core/Avatar';
import { Icon } from '@/shared/ui/icon';
import { Breadcrumb } from '@/shared/ui/core/Breadcrumb';
import { CardTable } from '@/shared/ui/core/CardTable';
import type { CustomerDetail as CustomerDetailModel, CustomerMeasurementEntry } from '@/types/advisordashboard';
import { useRouter, useParams } from 'next/navigation';
import { useCustomerDetail } from '@/tanstack/hooks/advisordashboard';

interface InfoItemProps {
  label: string;
  value?: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className="flex flex-col gap-1 rounded-lg border border-[var(--border)] p-3">
    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{label}</span>
    <span className="text-sm font-medium text-[var(--text)]">{value ?? '--'}</span>
  </div>
);

interface SectionHeaderProps {
  icon: string;
  title: string;
  helper?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, helper }) => (
  <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
    <div className="flex items-center gap-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-tertiary)]">
        <Icon name={icon} size={18} className="text-[var(--primary)]" />
      </span>
      <div className="flex flex-col">
        <span className="text-base font-semibold text-[var(--text)]">{title}</span>
        {helper && <span className="text-xs font-medium text-[var(--text-secondary)]">{helper}</span>}
      </div>
    </div>
  </div>
);

export interface CustomerDetailProps {
  customer?: CustomerDetailModel; // Optional để có thể fetch trực tiếp
}

const normalizeCustomerDetail = (data: any): CustomerDetailModel => {
  const sessionsCompleted = Number(data?.sessionsCompleted ?? 0);
  const sessionsTarget = Number(data?.totalSessions ?? data?.sessionsTarget ?? 0) || 1;
  const derivedProgress = Math.round(Math.min(100, Math.max(0, (sessionsCompleted / sessionsTarget) * 100)));

  const now = new Date();
  const fallbackMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return {
    id: data?.userId || data?.id || '',
    name: data?.name || 'Chưa cập nhật',
    email: data?.email || 'Không có email',
    phone: data?.phone,
    avatarUrl: data?.avatarUrl,
    month: fallbackMonth,
    goal: data?.goal || 'Chưa cập nhật mục tiêu',
    plan: data?.plan || 'Chưa có kế hoạch',
    status: data?.status === 'on-track' || data?.status === 'at-risk' || data?.status === 'behind' 
      ? data.status 
      : 'on-track',
    engagement: data?.engagement === 'high' || data?.engagement === 'medium' || data?.engagement === 'low'
      ? data.engagement
      : 'medium',
    sessionsCompleted,
    sessionsTarget,
    progressPercent: Number(data?.monthlyProgress ?? data?.progressPercent ?? derivedProgress),
    lastCheckIn: data?.lastCheckIn || 'Chưa cập nhật',
    nextSession: data?.nextSession || 'Chưa sắp lịch',
    weightChange: data?.weightChange,
    notes: data?.notes,
    age: data?.age,
    gender: data?.gender,
    joinedDate: data?.joinedDate,
    packageName: data?.packageName,
    height: data?.height,
    currentWeight: data?.currentWeight,
    bmi: data?.bmi,
    medicalHistory: data?.medicalHistory,
    remarks: data?.remarks,
    measurements: data?.measurements,
  };
};

const formatMeasurementValue = (value: string | number | undefined) => {
  if (value === undefined || value === null) return '--';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
  }
  return value;
};

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer: customerProp }) => {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  // Fetch từ API nếu không có customer prop (backward compatible)
  const { data: apiData, isLoading, error } = useCustomerDetail(customerProp ? undefined : userId);

  const customer = useMemo(() => {
    // Nếu có customer prop, dùng prop (backward compatible)
    if (customerProp) {
      return customerProp;
    }

    // Nếu không có prop, fetch từ API
    if (!apiData?.data) {
      return null;
    }

    console.log('📊 [CustomerDetail] Raw data:', apiData.data);
    const normalized = normalizeCustomerDetail(apiData.data);
    console.log('✅ [CustomerDetail] Normalized customer:', normalized);
    return normalized;
  }, [customerProp, apiData]);

  // Loading state
  if (!customerProp && isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-[var(--text-secondary)]">Đang tải thông tin khách hàng...</div>
      </div>
    );
  }

  // Error state
  if (!customerProp && (error || !customer)) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <div className="text-sm font-medium text-red-600">
          {error ? 'Không thể tải thông tin khách hàng' : 'Không tìm thấy khách hàng'}
        </div>
        <div className="text-xs text-[var(--text-secondary)]">
          {error instanceof Error ? error.message : 'Vui lòng thử lại sau'}
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const {
    name,
    email,
    phone,
    plan,
    goal,
    age,
    gender,
    joinedDate,
    packageName,
    height,
    currentWeight,
    medicalHistory,
    remarks,
    measurements,
  } = customer;

  const measurementColumns: Array<{ header: string; accessor: keyof CustomerMeasurementEntry }> = [
    { header: 'Ngày', accessor: 'date' },
    { header: 'Cân nặng (kg)', accessor: 'weight' },
    { header: 'Mỡ cơ thể (%)', accessor: 'bodyFat' },
    { header: 'Khối lượng cơ xương', accessor: 'boneMass' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb
        items={[
          { title: 'Trang chủ', href: '/advisor' },
          { title: 'Quản lý khách hàng', href: '/advisor/customers' },
          { title: 'Thông tin khách hàng' },
        ]}
        className="text-sm text-[var(--text-secondary)]"
      />
      <Card>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar size={72} src={customer.avatarUrl} className="text-2xl font-semibold">
              {name.charAt(0)}
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold text-[var(--text)]">{name}</span>
              <span className="text-sm text-[var(--text-secondary)]">{plan}</span>
              <span className="text-sm font-medium text-[var(--text-secondary)]">Mục tiêu: {goal}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <Icon name="mdi:email-outline" size={16} />
              <span>{email}</span>
            </div>
            {phone && (
              <div className="flex items-center gap-2">
                <Icon name="mdi:phone-outline" size={16} />
                <span>{phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <InfoItem label="Tuổi" value={age ? `${age} tuổi` : undefined} />
          <InfoItem label="Giới tính" value={gender ? (gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : 'Khác') : '--'} />
          <InfoItem label="Ngày tham gia" value={joinedDate} />
          <InfoItem label="Gói tập" value={packageName ?? plan} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeader icon="mdi:chart-bubble" title="Chỉ số cơ thể" helper="Cập nhật thủ công qua mỗi buổi đo" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <InfoItem label="Chiều cao" value={height ? `${height} cm` : '--'} />
            <InfoItem label="Cân nặng hiện tại" value={currentWeight ? `${currentWeight} kg` : '--'} />
          </div>
        </Card>

        <Card>
          <SectionHeader icon="mdi:clipboard-text-outline" title="Ghi chú & Lịch sử bệnh lý" />
          <div className="mt-4 flex flex-col gap-3 text-sm text-[var(--text)]">
            <div>
              <span className="text-[var(--text-secondary)]">Tiền sử bệnh lý</span>
              <p className="mt-1 rounded-lg bg-[var(--bg-tertiary)] p-3 text-sm leading-relaxed">{medicalHistory ?? 'Chưa cập nhật'}</p>
            </div>
            <div>
              <span className="text-[var(--text-secondary)]">Ghi chú</span>
              <p className="mt-1 rounded-lg bg-[var(--bg-tertiary)] p-3 text-sm leading-relaxed">{remarks ?? 'Chưa có ghi chú'}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader icon="mdi:calendar-clock-outline" title="Lịch sử đo lường" helper="Theo dõi cân nặng, mỡ cơ thể và cơ xương" />
        {measurements?.length ? (
          <CardTable
            items={measurements}
            pageSize={4}
            className="mt-4"
            gridClassName="md:grid-cols-2 lg:grid-cols-3"
            renderItem={(entry) => (
              <div className="h-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)]/60 p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-dashed border-[var(--border)] pb-2">
                  <span className="text-sm font-semibold text-[var(--text)]">{entry.date}</span>
                  <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">Check-in</span>
                </div>
                <div className="mt-3 flex flex-col gap-3 text-sm text-[var(--text)]">
                  {measurementColumns.map(({ header, accessor }) => (
                    <div key={accessor as string} className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">{header}</span>
                      <span className="font-semibold">{formatMeasurementValue(entry[accessor])}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--text-secondary)]">
            Chưa có dữ liệu đo lường
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerDetail;

