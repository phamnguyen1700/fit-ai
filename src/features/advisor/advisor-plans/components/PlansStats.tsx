'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export default function PlansStats() {
  const stats = [
    { label: 'Kế hoạch đang hoạt động', value: '124', color: 'text-green-500' },
    { label: 'Kế hoạch đã hoàn thành', value: '89', color: 'text-blue-500' },
    { label: 'Kế hoạch tạm dừng', value: '12', color: 'text-yellow-500' },
    { label: 'Tỷ lệ hoàn thành', value: '87%', color: 'text-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
          <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
        </Card>
      ))}
    </div>
  );
}
