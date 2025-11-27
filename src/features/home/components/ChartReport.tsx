'use client';

import React from 'react';
import { Card, Row, Col, Segmented } from '@/shared/ui';
import { PieChart } from '@/shared/ui';
import { LineChart } from '@/shared/ui';
import { SeriesItem } from '@/shared/ui/core/LineChart';

type Period = 'day' | 'month' | 'year';

const donutColors = ['#FFB476', '#FFD9B0', '#FFEAD1', '#FF9B3D'];

const lineColors = {
  a: '#8AA6FF',
  b: '#FFB476',
  c: '#9ED5FF',
};

export const ChartReport: React.FC = () => {
  const [period, setPeriod] = React.useState<Period>('day');

  // Fake pie data
  const pieData = [
    { label: 'Approved', value: 310, color: donutColors[3] },
    { label: 'Pending', value: 142, color: donutColors[0] },
    { label: 'Under review', value: 340, color: donutColors[1] },
    { label: 'Rejected', value: 59, color: donutColors[2] },
  ];

  // Fake line data by period
  const lineSeries = {
    day: [
      { name: '18-20', color: lineColors.a, data: [5, 30, 20, 60, 25, 40, 70, 55] },
      { name: '20-25', color: lineColors.b, data: [10, 25, 50, 35, 30, 15, 45, 20] },
      { name: '>30', color: lineColors.c, data: [0, 15, 35, 10, 20, 50, 65, 5] },
    ],
    month: [
      { name: '18-20', color: lineColors.a, data: [15, 45, 30, 50, 35, 55, 60, 70] },
      { name: '20-25', color: lineColors.b, data: [25, 30, 40, 25, 15, 30, 45, 25] },
      { name: '>30', color: lineColors.c, data: [10, 25, 30, 20, 40, 60, 50, 35] },
    ],
    year: [
      { name: '18-20', color: lineColors.a, data: [20, 35, 55, 30, 40, 45, 80, 35] },
      { name: '20-25', color: lineColors.b, data: [15, 25, 35, 20, 30, 25, 50, 15] },
      { name: '>30', color: lineColors.c, data: [5, 15, 25, 30, 35, 45, 65, 30] },
    ],
  } as Record<Period, SeriesItem[]>;

  return (
    <Card
      className="rounded-xl"
      title={
        <div className="flex items-center justify-between">
          <span className="text text-base sm:text-lg font-semibold">Người dùng hiện tại</span>
        </div>
      }
    //   extra={
    //     <Segmented
    //       size="small"
    //       value={period}
    //       onChange={(v) => setPeriod(v as Period)}
    //       options={[{ label: 'Ngày', value: 'day' }, { label: 'Tháng', value: 'month' }, { label: 'Năm', value: 'year' }]}
    //     />
    //   }
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={10}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center">
              <PieChart data={pieData} size={150} innerRadius={80} showCenterLabel />
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-2 text-sm text-secondary">
              {pieData.map((d) => (
                <React.Fragment key={d.label}>
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.label}</span>
                  <span className="text-right text font-medium">
                    {d.value}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Col>
        <Col xs={24} md={14}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 justify-end text-xs">
              {lineSeries.day.map((s) => (
                <span key={s.name} className="inline-flex items-center gap-1 text-secondary">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
              ))}
            </div>
            <LineChart height={270} series={[...lineSeries[period]]} />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ChartReport;


