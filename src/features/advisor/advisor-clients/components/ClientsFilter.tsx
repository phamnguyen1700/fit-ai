'use client';

import React from 'react';
import { Card, Button } from '@/shared/ui';

export default function ClientsFilter() {
  return (
    <Card className="p-4">
      <div className="flex gap-4 items-center">
        <select className="px-4 py-2 border rounded">
          <option>Tất cả trạng thái</option>
          <option>Đang hoạt động</option>
          <option>Không hoạt động</option>
        </select>
        
        <select className="px-4 py-2 border rounded">
          <option>Tất cả gói</option>
          <option>Giảm cân</option>
          <option>Tăng cơ</option>
          <option>Thể hình</option>
        </select>
        
        <Button variant="primary">Lọc</Button>
        <Button variant="secondary">Đặt lại</Button>
      </div>
    </Card>
  );
}
