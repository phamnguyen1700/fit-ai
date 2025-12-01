'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export default function AIPlansStats() {
  const stats = [
    { 
      label: 'Chờ duyệt', 
      value: '18', 
      change: 'Mới hôm nay: 5',
      colorVar: 'var(--warning)',
      bgColor: 'rgba(249, 115, 22, 0.05)',
      icon: '⏳'
    },
    { 
      label: 'Đã duyệt hôm nay', 
      value: '12', 
      change: '+4 so với hôm qua',
      colorVar: 'var(--success)',
      bgColor: 'rgba(34, 197, 94, 0.05)',
      icon: '✅'
    },
    { 
      label: 'Cần chỉnh sửa', 
      value: '6', 
      change: 'Đang chờ người dùng',
      colorVar: 'var(--info)',
      bgColor: 'rgba(59, 130, 246, 0.05)',
      icon: '✏️'
    },
    { 
      label: 'Tổng plan tháng này', 
      value: '156', 
      change: '+28% so với tháng trước',
      colorVar: 'var(--primary)',
      bgColor: 'rgba(168, 85, 247, 0.05)',
      icon: '📊'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="p-6 hover:shadow-lg transition-shadow"
          style={{ background: stat.bgColor }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="text-3xl">{stat.icon}</div>
            <div 
              className="text-xs px-2 py-1 rounded-full border"
              style={{ 
                background: stat.bgColor,
                borderColor: stat.colorVar,
                color: stat.colorVar,
              }}
            >
              Mới
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
          <h3 className="text-3xl font-bold mb-1" style={{ color: stat.colorVar }}>{stat.value}</h3>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{stat.change}</p>
        </Card>
      ))}
    </div>
  );
}
