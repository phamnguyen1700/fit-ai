import React from 'react';

import LineChart, { SeriesItem } from '@/shared/ui/core/LineChart';
import PieChart from '@/shared/ui/core/PieChart';
import MultiCircleChart from '@/shared/ui/core/MultiCircleChart';
import AreaChart, { AreaSeriesItem } from '@/shared/ui/core/AreaChart';
import {
  useRevenueTrend,
  useUserGrowthRate,
  useUserSubscriptionStatusStats,
  useUserSubscriptionTierStats,
} from '@/tanstack/hooks/analytics';
import { RevenueTrendPeriod, UserGrowthPeriod } from '@/types/analytics';

// Card component for reusability
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[var(--bg)] rounded-xl ${className}`}>
    {children}
  </div>
);

// Chart header component
const ChartHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-[var(--primay-extralight)] w-full">
    <div className="text text-base sm:text-lg font-semibold inline-block px-3 py-1 rounded-t-md text-[var(--text)]">
      {title}
    </div>
    <div className="h-[2px] w-full bg-[var(--primary)] mt-1" />
  </div>
);

// Legend component for charts
const Legend: React.FC<{ items: Array<{ color: string; label: string; value?: number }> }> = ({ items }) => (
  <div className="mt-6 w-full flex flex-col items-center">
    {items.map((item) => (
      <div key={item.label} className="flex items-center gap-3 mb-2 w-56 justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full" style={{ background: item.color }}></span>
          <span className="text-secondary text-base text-[var(--text)]">{item.label}</span>
        </div>
        {item.value && (
          <span className="text-secondary text-base font-medium text-[var(--text)]">{item.value}</span>
        )}
      </div>
    ))}
  </div>
);

const growthColors = ['#7C3AED', '#FBBF24', '#60A5FA', '#34D399', '#F97316'];
const pieColors = ['#2563EB', '#A5B4FC', '#7C3AED'];
const statusColors = ['#2563EB', '#FACC15', '#A855F7', '#EF4444'];

const ChartReport: React.FC = () => {
  const [period, setPeriod] = React.useState<UserGrowthPeriod>('day');
  const [revenuePeriod, setRevenuePeriod] = React.useState<RevenueTrendPeriod>('month');

  const growthQuery = useUserGrowthRate(period);
  const tierQuery = useUserSubscriptionTierStats();
  const statusQuery = useUserSubscriptionStatusStats();
  const revenueTrendQuery = useRevenueTrend(revenuePeriod);

  const growthResponse = growthQuery.data;
  const growthLoading = growthQuery.isLoading;
  const growthError = growthQuery.isError;

  const tierResponse = tierQuery.data;
  const tierLoading = tierQuery.isLoading;
  const tierError = tierQuery.isError;

  const statusResponse = statusQuery.data;
  const statusLoading = statusQuery.isLoading;
  const statusError = statusQuery.isError;

  const revenueTrendResponse = revenueTrendQuery.data;
  const revenueTrendLoading = revenueTrendQuery.isLoading;
  const revenueTrendError = revenueTrendQuery.isError;

  const formatGrowthLabel = React.useCallback(
    (label: string) => {
      if (period === 'day') {
        const [month, day] = label.split('-');
        if (month && day) return `${day.padStart(2, '0')}/${month.padStart(2, '0')}`;
      }
      if (period === 'month') {
        const [year, month] = label.split('-');
        if (year && month) return `${month.padStart(2, '0')}/${year}`;
      }
      return label;
    },
    [period]
  );

  const normalizedGrowthData = React.useMemo(
    () =>
      (growthResponse?.data ?? []).map((group) => ({
        ...group,
        dataPoints: (group.dataPoints ?? []).map((point) => ({
          ...point,
          count: Number(point.count ?? 0),
          formattedLabel: formatGrowthLabel(point.label),
        })),
      })),
    [growthResponse?.data, formatGrowthLabel]
  );

  const hasGrowthData = React.useMemo(
    () => normalizedGrowthData.some((group) => (group.dataPoints?.length ?? 0) > 0),
    [normalizedGrowthData]
  );

  const growthSeries = React.useMemo<SeriesItem[]>(() => {
    if (!hasGrowthData) {
      return [
        {
          name: 'Đang tải',
          color: growthColors[0],
          data: [0, 0, 0],
        },
      ];
    }

    return normalizedGrowthData.map((group, index) => ({
      name: group.ageGroup,
      color: growthColors[index % growthColors.length],
      data: group.dataPoints.map((point) => point.count),
    }));
  }, [hasGrowthData, normalizedGrowthData]);

  const growthLabels = React.useMemo(() => {
    if (!hasGrowthData) return ['1', '2', '3'];
    return (
      normalizedGrowthData[0]?.dataPoints.map((point) => point.formattedLabel ?? point.label) ?? [
        '1',
        '2',
        '3',
      ]
    );
  }, [hasGrowthData, normalizedGrowthData]);

  const pieData = React.useMemo(() => {
    const tiers = tierResponse?.data;
    if (!tiers) {
      return [
        { label: 'Free', value: 0, color: pieColors[0] },
        { label: 'Premium', value: 0, color: pieColors[1] },
        { label: 'VIP', value: 0, color: pieColors[2] },
      ];
    }

    return [
      { label: 'Free', value: tiers.free ?? 0, color: pieColors[0] },
      { label: 'Premium', value: tiers.premium ?? 0, color: pieColors[1] },
      { label: 'VIP', value: tiers.vip ?? 0, color: pieColors[2] },
    ];
  }, [tierResponse?.data]);

  const statusStats = statusResponse?.data;
  const totalStatus =
    statusStats?.total ??
    ((statusStats?.approved ?? 0) +
      (statusStats?.pending ?? 0) +
      (statusStats?.underReview ?? 0) +
      (statusStats?.rejected ?? 0));

  const multiCircleData = React.useMemo(() => {
    if (!statusStats || totalStatus === 0) {
      return [0, 0, 0, 0];
    }
    return [
      (statusStats.approved ?? 0) / totalStatus,
      (statusStats.pending ?? 0) / totalStatus,
      (statusStats.underReview ?? 0) / totalStatus,
      (statusStats.rejected ?? 0) / totalStatus,
    ];
  }, [statusStats, totalStatus]);

  const multiCircleLegend = React.useMemo(
    () => [
      { color: statusColors[0], label: 'Approved', value: statusStats?.approved ?? 0 },
      { color: statusColors[1], label: 'Pending', value: statusStats?.pending ?? 0 },
      { color: statusColors[2], label: 'Under review', value: statusStats?.underReview ?? 0 },
      { color: statusColors[3], label: 'Rejected', value: statusStats?.rejected ?? 0 },
    ],
    [statusStats?.approved, statusStats?.pending, statusStats?.rejected, statusStats?.underReview]
  );

  const revenueTrend = revenueTrendResponse?.data ?? [];
  const hasRevenueTrend = revenueTrend.length > 0;

  const areaSeries = React.useMemo<AreaSeriesItem[]>(() => {
    if (!hasRevenueTrend) {
      return [
        {
          name: 'Doanh thu',
          color: '#2563EB',
          data: [0, 0, 0],
          fillOpacity: 0.25,
        },
      ];
    }

    return [
      {
        name: 'Doanh thu',
        color: '#2563EB',
        data: revenueTrend.map((point) => point.revenue ?? 0),
        fillOpacity: 0.35,
      },
      {
        name: 'Số giao dịch',
        color: '#A5B4FC',
        data: revenueTrend.map((point) => point.paymentCount ?? 0),
        fillOpacity: 0.2,
      },
    ];
  }, [hasRevenueTrend, revenueTrend]);

  const areaLabels = React.useMemo(
    () => (hasRevenueTrend ? revenueTrend.map((point) => point.label) : ['1', '2', '3']),
    [hasRevenueTrend, revenueTrend]
  );

  return (
    <Card className="w-full border border-[var(--primary)] p-4">
      {/* Line Chart Section */}
      <div className="mb-4">
        <div className="text-xl font-semibold mb-2 text-[var(--text)]">Phân tích</div>
        <Card className="p-4 mt-2">
          <div className="mb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <ChartHeader title="Tỷ lệ tăng trưởng user" />
              <div className="flex items-center gap-2 text-xs text-secondary">
                {(['day', 'month', 'year'] as UserGrowthPeriod[]).map((option) => (
                  <button
                    key={option}
                    className={`rounded-md px-3 py-1 font-medium ${
                      period === option
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text)]'
                    }`}
                    onClick={() => setPeriod(option)}
                  >
                    {option === 'day' ? 'Ngày' : option === 'month' ? 'Tháng' : 'Năm'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 mb-4 text-sm text-secondary">
            {growthSeries.map(({ name, color }) => (
              <span key={name} className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }}></span>
                {name}
              </span>
            ))}
          </div>
          {growthError ? (
            <div className="py-10 text-center text-sm text-red-500">Không thể tải dữ liệu tăng trưởng.</div>
          ) : hasGrowthData || growthLoading ? (
            <div className="mt-4">
              <LineChart
                series={growthSeries}
                labels={growthLabels}
                height={220}
                dashed
                className="bg-transparent"
              />
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-secondary">Chưa có dữ liệu cho chu kỳ này.</div>
          )}
        </Card>
      </div>

      {/* Pie Chart and Multi Circle Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Pie Chart */}
        <Card className="p-6 flex flex-col items-center mt-2">
          <ChartHeader title="Người dùng hiện tại" />
          {tierError ? (
            <div className="py-10 text-sm text-red-500">Không thể tải dữ liệu subscription theo tier.</div>
          ) : tierLoading && !tierResponse?.data ? (
            <div className="py-10 text-sm text-secondary">Đang tải dữ liệu...</div>
          ) : (
            <>
              <PieChart data={pieData} size={220} innerRadius={70} className="mt-5" />
              <Legend items={pieData} />
            </>
          )}
        </Card>

        {/* Multi Circle Chart */}
        <Card className="p-6 flex flex-col items-center mt-2">
          <ChartHeader title="Gói đăng ký" />
          {statusError ? (
            <div className="py-10 text-sm text-red-500">Không thể tải thống kê trạng thái subscription.</div>
          ) : statusLoading && !statusStats ? (
            <div className="py-10 text-sm text-secondary">Đang tải dữ liệu...</div>
          ) : (
            <>
              <div className="mt-5">
                <MultiCircleChart
                  values={multiCircleData}
                  colors={statusColors}
                  size={220}
                  strokeWidth={14}
                  legend={multiCircleLegend}
                />
              </div>
              <Legend items={multiCircleLegend} />
            </>
          )}
        </Card>
      </div>

      {/* Area Chart */}
      <div className="mt-10">
        <ChartHeader title="Tỷ lệ doanh thu theo thời gian" />
        <Card className="p-6 mt-2">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-secondary">Tổng doanh thu</span>
              <span className="text-3xl font-semibold text-[var(--text)]">
                {hasRevenueTrend
                  ? new Intl.NumberFormat('vi-VN').format(
                      revenueTrend.reduce((sum, point) => sum + (point.revenue ?? 0), 0)
                    )
                  : revenueTrendLoading
                  ? 'Đang tải...'
                  : '0'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {(['day', 'month', 'year'] as RevenueTrendPeriod[]).map((option) => (
                <button
                  key={option}
                  className={`px-3 py-1 rounded font-semibold text-sm ${
                    revenuePeriod === option
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--bg-secondary)] text-[var(--text)]'
                  }`}
                  onClick={() => setRevenuePeriod(option)}
                >
                  {option === 'day' ? 'Ngày' : option === 'month' ? 'Tháng' : 'Năm'}
                </button>
              ))}
            </div>
          </div>
          {revenueTrendError ? (
            <div className="py-10 text-center text-sm text-red-500">Không thể tải dữ liệu doanh thu.</div>
          ) : hasRevenueTrend || revenueTrendLoading ? (
            <div className="mt-4">
              <AreaChart series={areaSeries} labels={areaLabels} height={260} />
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-secondary">
              Chưa có doanh thu trong chu kỳ này.
            </div>
          )}
        </Card>
      </div>
    </Card>
  );
};

export default ChartReport;