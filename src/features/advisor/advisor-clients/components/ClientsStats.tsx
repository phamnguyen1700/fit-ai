'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export default function ClientsStats() {
  const stats = [
    { 
      label: 'Khách hàng tháng này', 
      value: '24', 
      change: '+3 so với tháng trước',
      colorVar: 'var(--info)'
    },
    { 
      label: 'Đang tập luyện', 
      value: '18', 
      change: '75% tổng số',
      colorVar: 'var(--success)'
    },
    { 
      label: 'Cần feedback', 
      value: '12', 
      change: 'Upload mới hôm nay',
      colorVar: 'var(--warning)'
    },
    { 
      label: 'Tin nhắn chưa đọc', 
      value: '7', 
      change: 'Từ 5 khách hàng',
      colorVar: 'var(--primary)'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              <h3 className="text-3xl font-bold mb-1" style={{ color: stat.colorVar }}>{stat.value}</h3>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{stat.change}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
