'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export default function DashboardStats() {
  const stats = [
    { label: 'Tổng khách hàng', value: '156', change: '+12%' },
    { label: 'Khách hàng hoạt động', value: '89', change: '+8%' },
    { label: 'Kế hoạch đang thực hiện', value: '124', change: '+15%' },
    { label: 'Phiên tập tuần này', value: '45', change: '+5%' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
          <div className="text-3xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm text-green-500">{stat.change}</div>
        </Card>
      ))}
    </div>
  );
}
