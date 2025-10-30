'use client';

import React from 'react';
import { Card, Table2 } from '@/shared/ui';

export default function ClientProgressTable() {
  const clientProgress = [
    { id: '1', client: 'Nguyễn Văn A', goal: 'Giảm 10kg', achieved: '7kg', progress: '70%', satisfaction: '4.5/5' },
    { id: '2', client: 'Trần Thị B', goal: 'Tăng cơ 5kg', achieved: '3kg', progress: '60%', satisfaction: '4.8/5' },
    { id: '3', client: 'Lê Văn C', goal: 'Tăng sức bền', achieved: 'Hoàn thành', progress: '100%', satisfaction: '5.0/5' },
    { id: '4', client: 'Phạm Thị D', goal: 'Giảm 8kg', achieved: '2kg', progress: '25%', satisfaction: '4.2/5' },
  ];

  const columns = [
    { title: 'Khách hàng', dataIndex: 'client', key: 'client' },
    { title: 'Mục tiêu', dataIndex: 'goal', key: 'goal' },
    { title: 'Đã đạt được', dataIndex: 'achieved', key: 'achieved' },
    { title: 'Tiến độ', dataIndex: 'progress', key: 'progress' },
    { title: 'Đánh giá', dataIndex: 'satisfaction', key: 'satisfaction' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Tiến độ khách hàng</h3>
      <Table2 columns={columns} dataSource={clientProgress} rowKey="id" />
    </Card>
  );
}
