'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export default function AIPlansStats() {
  const stats = [
    { 
      label: 'Chờ duyệt', 
      value: '18', 
      change: 'Mới hôm nay: 5',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: '⏳'
    },
    { 
      label: 'Đã duyệt hôm nay', 
      value: '12', 
      change: '+4 so với hôm qua',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '✅'
    },
    { 
      label: 'Cần chỉnh sửa', 
      value: '6', 
      change: 'Đang chờ người dùng',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: '✏️'
    },
    { 
      label: 'Tổng plan tháng này', 
      value: '156', 
      change: '+28% so với tháng trước',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: '📊'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`p-6 ${stat.bgColor} hover:shadow-lg transition-shadow`}>
          <div className="flex items-start justify-between mb-3">
            <div className="text-3xl">{stat.icon}</div>
            <div className={`text-xs px-2 py-1 rounded-full ${stat.bgColor} border border-current ${stat.color}`}>
              Mới
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
          <h3 className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</h3>
          <p className="text-xs text-gray-500">{stat.change}</p>
        </Card>
      ))}
    </div>
  );
}
