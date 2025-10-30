'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export default function RecentClients() {
  const clients = [
    { id: '1', name: 'Nguyễn Văn A', plan: 'Giảm cân', lastActivity: '2 giờ trước' },
    { id: '2', name: 'Trần Thị B', plan: 'Tăng cơ', lastActivity: '5 giờ trước' },
    { id: '3', name: 'Lê Văn C', plan: 'Thể hình', lastActivity: '1 ngày trước' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Khách hàng gần đây</h3>
      <div className="space-y-3">
        {clients.map((client) => (
          <div key={client.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium">{client.name}</div>
              <div className="text-sm text-gray-500">{client.plan}</div>
            </div>
            <div className="text-sm text-gray-400">{client.lastActivity}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
