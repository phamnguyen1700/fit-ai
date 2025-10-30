'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export default function PerformanceChart() {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Biểu đồ hiệu suất</h3>
      <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
        <p className="text-gray-500">Biểu đồ hiệu suất sẽ được hiển thị ở đây</p>
      </div>
    </Card>
  );
}
