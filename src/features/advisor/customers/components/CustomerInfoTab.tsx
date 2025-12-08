'use client';

import React from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Avatar } from '@/shared/ui/core/Avatar';
import { Icon } from '@/shared/ui/icon';
import { CardTable } from '@/shared/ui/core/CardTable';
import type { CustomerDetail as CustomerDetailModel, CustomerMeasurementEntry } from '@/types/advisordashboard';
import { InfoItem } from './InfoItem';
import { SectionHeader } from './SectionHeader';

interface CustomerInfoTabProps {
  customer: CustomerDetailModel;
}

const formatMeasurementValue = (value: string | number | undefined) => {
  if (value === undefined || value === null) return '--';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
  }
  return value;
};

export const CustomerInfoTab: React.FC<CustomerInfoTabProps> = ({ customer }) => {
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
    <>
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
    </>
  );
};

