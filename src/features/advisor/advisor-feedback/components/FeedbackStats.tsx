'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export default function FeedbackStats() {
  const stats = [
    { 
      label: 'Chờ đánh giá', 
      value: '12', 
      change: 'Mới hôm nay',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      label: 'Đã đánh giá hôm nay', 
      value: '8', 
      change: '+3 so với hôm qua',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Trung bình thời gian phản hồi', 
      value: '2.5h', 
      change: 'Trong tuần này',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Tổng đánh giá tháng này', 
      value: '156', 
      change: '+24% so với tháng trước',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`p-6 ${stat.bgColor}`}>
          <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
          <h3 className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</h3>
          <p className="text-xs text-gray-500">{stat.change}</p>
        </Card>
      ))}
    </div>
  );
}
