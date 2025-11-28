'use client';

import React from 'react';
import { Progress, Card, Segmented, Row, Col, Select, useBreakpoint } from '@/shared/ui';

type Period = 'day' | 'month' | 'year';

interface ReportItem {
  key: string;
  label: string;
  percent: number;
  color: string;
  valueLabel: string;
}

const fakeDataByPeriod: Record<Period, ReportItem[]> = {
  day: [
    { key: 'ex', label: 'Số bài tập', percent: 72, color: '#9EE37D', valueLabel: '10 bài' },
    { key: 'menu', label: 'Số thực đơn', percent: 48, color: '#86B6FF', valueLabel: '20 thực đơn' },
    { key: 'revenue', label: 'Doanh thu', percent: 64, color: '#FF8E8E', valueLabel: '20.000.000đ' },
    { key: 'feedback', label: 'Feedback mới chưa duyệt', percent: 22, color: '#FFD07F', valueLabel: '2 feedback' },
  ],
  month: [
    { key: 'ex', label: 'Số bài tập', percent: 56, color: '#9EE37D', valueLabel: '213 bài' },
    { key: 'menu', label: 'Số thực đơn', percent: 62, color: '#86B6FF', valueLabel: '54 thực đơn' },
    { key: 'revenue', label: 'Doanh thu', percent: 71, color: '#FF8E8E', valueLabel: '240.000.000đ' },
    { key: 'feedback', label: 'Feedback mới chưa duyệt', percent: 18, color: '#FFD07F', valueLabel: '12 feedback' },
  ],
  year: [
    { key: 'ex', label: 'Số bài tập', percent: 68, color: '#9EE37D', valueLabel: '2.413 bài' },
    { key: 'menu', label: 'Số thực đơn', percent: 44, color: '#86B6FF', valueLabel: '612 thực đơn' },
    { key: 'revenue', label: 'Doanh thu', percent: 83, color: '#FF8E8E', valueLabel: '2.4 tỷ' },
    { key: 'feedback', label: 'Feedback mới chưa duyệt', percent: 26, color: '#FFD07F', valueLabel: '87 feedback' },
  ],
};

export const QuickReportTable: React.FC = () => {
  const [period, setPeriod] = React.useState<Period>('day');
  const items = fakeDataByPeriod[period];
  const screens = useBreakpoint();

  return (
    <Card
      className="rounded-xl"
      title={<span className="text text-base sm:text-lg font-semibold">Thống kê nhanh</span>}
      extra={ screens.md ? (
        <Segmented
          size="small"
          value={period}
          onChange={(val) => setPeriod(val as Period)}
          options={[
            { label: 'Ngày', value: 'day' },
            { label: 'Tháng', value: 'month' },
            { label: 'Năm', value: 'year' },
          ]}
        />
      ) : (
        <Select
          size="small"
          value={period}
          onChange={(val) => setPeriod(val as Period)}
          options={[
            { label: 'Ngày', value: 'day' },
            { label: 'Tháng', value: 'month' },
            { label: 'Năm', value: 'year' },
          ]}
          style={{ width: 75}}
        />
      )}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <div className="flex flex-col gap-2">
          {items.map((it) => (
            <div key={it.key} className="w-full">
              <Progress percent={it.percent} showInfo={false} strokeColor={it.color} trailColor="var(--border)" />
            </div>
          ))}
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="grid grid-cols-[1fr_auto] gap-y-2.5 text-[10px] sm:text-xs">
          {items.map((it) => (
            <React.Fragment key={it.key}>
              <div className="flex items-center gap-2 text-tertiary">
                <span className="inline-block h-1 w-1 rounded-full" style={{ backgroundColor: it.color }} />
                {it.label}
              </div>
              <div className="text-right text-secondary font-medium">{it.valueLabel}</div>
            </React.Fragment>
          ))}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default QuickReportTable;


