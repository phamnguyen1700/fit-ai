'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export default function FeedbackStats() {
  const stats = [
    { 
      label: 'Chờ đánh giá', 
      value: '12', 
      change: 'Mới hôm nay',
      colorVar: 'var(--warning)',
      bgColor: 'rgba(249, 115, 22, 0.05)'
    },
    { 
      label: 'Đã đánh giá hôm nay', 
      value: '8', 
      change: '+3 so với hôm qua',
      colorVar: 'var(--success)',
      bgColor: 'rgba(34, 197, 94, 0.05)'
    },
    { 
      label: 'Trung bình thời gian phản hồi', 
      value: '2.5h', 
      change: 'Trong tuần này',
      colorVar: 'var(--info)',
      bgColor: 'rgba(59, 130, 246, 0.05)'
    },
    { 
      label: 'Tổng đánh giá tháng này', 
      value: '156', 
      change: '+24% so với tháng trước',
      colorVar: 'var(--primary)',
      bgColor: 'rgba(168, 85, 247, 0.05)'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6" style={{ background: stat.bgColor }}>
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
          <h3 className="text-3xl font-bold mb-1" style={{ color: stat.colorVar }}>{stat.value}</h3>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{stat.change}</p>
        </Card>
      ))}
    </div>
  );
}
