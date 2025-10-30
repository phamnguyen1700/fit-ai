'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export default function ClientsStats() {
  const stats = [
    { 
      label: 'Khách hàng tháng này', 
      value: '24', 
      change: '+3 so với tháng trước',
      color: 'text-blue-600'
    },
    { 
      label: 'Đang tập luyện', 
      value: '18', 
      change: '75% tổng số',
      color: 'text-green-600'
    },
    { 
      label: 'Cần feedback', 
      value: '12', 
      change: 'Upload mới hôm nay',
      color: 'text-orange-600'
    },
    { 
      label: 'Tin nhắn chưa đọc', 
      value: '7', 
      change: 'Từ 5 khách hàng',
      color: 'text-purple-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
              <h3 className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</h3>
              <p className="text-xs text-gray-400">{stat.change}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
