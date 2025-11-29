'use client';

import React from 'react';

import { Card, Col, Row, Segmented } from '@/shared/ui';
import { PieChart } from '@/shared/ui';
import { LineChart } from '@/shared/ui';
import { SeriesItem } from '@/shared/ui/core/LineChart';
import { useUserGrowthRate, useUserSubscriptionTierStats } from '@/tanstack/hooks/analytics';
import type { UserGrowthPeriod } from '@/types/analytics';

const donutColors = ['#FF9B3D', '#FFB476', '#FFD9B0'];
const linePalette = ['#8AA6FF', '#FFB476', '#9ED5FF', '#A78BFA'];

const loadingPieData = [
  { label: 'Free', value: 0, color: donutColors[0] },
  { label: 'Premium', value: 0, color: donutColors[1] },
  { label: 'VIP', value: 0, color: donutColors[2] },
];

const loadingLineSeries: SeriesItem[] = [
  {
    name: 'Đang tải',
    color: linePalette[0],
    data: [0, 0, 0],
  },
];

const periodOptions: Array<{ label: string; value: UserGrowthPeriod }> = [
  { label: 'Ngày', value: 'day' },
  { label: 'Tháng', value: 'month' },
  { label: 'Năm', value: 'year' },
];

export const ChartReport: React.FC = () => {
  const [period, setPeriod] = React.useState<UserGrowthPeriod>('day');

  const {
    data: subscriptionResponse,
    isLoading: isSubscriptionLoading,
    isError: isSubscriptionError,
  } = useUserSubscriptionTierStats();

  const {
    data: growthResponse,
    isLoading: isGrowthLoading,
    isError: isGrowthError,
  } = useUserGrowthRate(period);

  const stats = subscriptionResponse?.data;
  const tiers = React.useMemo(
    () => [
      { key: 'free', label: 'Free', value: stats?.free ?? 0, color: donutColors[0] },
      { key: 'premium', label: 'Premium', value: stats?.premium ?? 0, color: donutColors[1] },
      { key: 'vip', label: 'VIP', value: stats?.vip ?? 0, color: donutColors[2] },
    ],
    [stats?.free, stats?.premium, stats?.vip]
  );

  const totalUsers = stats?.total ?? tiers.reduce((acc, curr) => acc + curr.value, 0);
  const breakdown = isSubscriptionLoading || !stats ? loadingPieData : tiers;

  const growthData = growthResponse?.data ?? [];
  const hasGrowthSeries = React.useMemo(
    () => growthData.some((group) => (group.dataPoints?.length ?? 0) > 0),
    [growthData]
  );

  const lineSeries = React.useMemo<SeriesItem[]>(() => {
    if (!hasGrowthSeries) {
      return loadingLineSeries;
    }
    return growthData.map((group, index) => ({
      name: group.ageGroup,
      color: linePalette[index % linePalette.length],
      data: group.dataPoints.map((point) => point.count),
    }));
  }, [growthData, hasGrowthSeries]);

  const lineLabels = React.useMemo(() => {
    if (!hasGrowthSeries) {
      return ['1', '2', '3'];
    }
    return growthData[0]?.dataPoints.map((point) => point.label) ?? ['1', '2', '3'];
  }, [growthData, hasGrowthSeries]);

  const totalLatestGrowth = React.useMemo(() => {
    if (!hasGrowthSeries) return null;
    return growthData.reduce((sum, group) => {
      const dataPoints = group.dataPoints ?? [];
      const last = dataPoints[dataPoints.length - 1]?.count ?? 0;
      return sum + last;
    }, 0);
  }, [growthData, hasGrowthSeries]);

  return (
    <Card
      className="rounded-xl"
      title={
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <span className="text text-base sm:text-lg font-semibold">Thống kê người dùng</span>
            <span className="text-xs text-secondary">Đang theo dõi subscription & tăng trưởng</span>
          </div>
        </div>
      }
      extra={
        <Segmented
          size="small"
          value={period}
          onChange={(value) => setPeriod(value as UserGrowthPeriod)}
          options={periodOptions}
        />
      }
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={10}>
          {isSubscriptionError ? (
            <div className="py-10 text-center text-sm text-red-500">
              Không thể tải thống kê người dùng theo tier.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative flex items-center justify-center">
                <PieChart data={breakdown} size={200} innerRadius={100} />
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xs text-secondary">Tổng</span>
                  <span className="text-2xl font-semibold text-slate-900">
                    {isSubscriptionLoading && !stats ? '...' : totalUsers}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-2 text-sm text-secondary">
                {breakdown.map((item) => {
                  const percent = totalUsers > 0 ? Math.round((item.value / totalUsers) * 100) : null;
                  return (
                    <React.Fragment key={item.label}>
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.label}</span>
                      <span className="text-right text font-medium">
                        {item.value}
                        <span className="ml-1 text-xs text-secondary">
                          {percent !== null ? `(${percent}%)` : '--'}
                        </span>
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </Col>
        <Col xs={24} md={14}>
          {isGrowthError ? (
            <div className="py-10 text-center text-sm text-red-500">
              Không thể tải dữ liệu tăng trưởng người dùng.
            </div>
          ) : (
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Tăng trưởng user theo {periodOptions.find((opt) => opt.value === period)?.label.toLowerCase()}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
                {lineSeries.map((series) => (
                  <span key={series.name} className="inline-flex items-center gap-1">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: series.color }}
                    />
                    {series.name}
                  </span>
                ))}
              </div>
              <div className="flex grow items-center justify-center">
                {hasGrowthSeries || isGrowthLoading ? (
                  <LineChart height={260} series={lineSeries} labels={lineLabels} />
                ) : (
                  <div className="py-10 text-center text-sm text-secondary">
                    Không có dữ liệu cho chu kỳ đã chọn.
                  </div>
                )}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default ChartReport;