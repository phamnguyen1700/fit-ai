'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export default function UpcomingSessions() {
  const sessions = [
    { id: '1', client: 'Nguyễn Văn A', time: '10:00 AM', date: 'Hôm nay', type: 'Tư vấn' },
    { id: '2', client: 'Trần Thị B', time: '2:00 PM', date: 'Hôm nay', type: 'Kiểm tra' },
    { id: '3', client: 'Lê Văn C', time: '9:00 AM', date: 'Ngày mai', type: 'Tư vấn' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Lịch hẹn sắp tới</h3>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium">{session.client}</div>
              <div className="text-sm text-gray-500">{session.type}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{session.time}</div>
              <div className="text-sm text-gray-400">{session.date}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
