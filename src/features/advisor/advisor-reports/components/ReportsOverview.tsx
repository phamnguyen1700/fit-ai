'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export default function ReportsOverview() {
  const reports = [
    { label: 'Tổng số phiên tập', value: '1,234', period: 'Tháng này' },
    { label: 'Khách hàng đạt mục tiêu', value: '45', period: 'Tháng này' },
    { label: 'Tỷ lệ hoàn thành', value: '87%', period: 'Tháng này' },
    { label: 'Đánh giá trung bình', value: '4.8/5', period: 'Tháng này' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {reports.map((report, index) => (
        <Card key={index} className="p-6">
          <div className="text-sm text-gray-500 mb-2">{report.label}</div>
          <div className="text-3xl font-bold mb-1">{report.value}</div>
          <div className="text-sm text-gray-400">{report.period}</div>
        </Card>
      ))}
    </div>
  );
}
