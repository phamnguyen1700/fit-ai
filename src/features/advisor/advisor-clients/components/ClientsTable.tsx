'use client';

import React from 'react';
import { Card, Table2 } from '@/shared/ui';

export default function ClientsTable() {
  const clients = [
    { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', plan: 'Giảm cân', status: 'Hoạt động', startDate: '01/01/2024' },
    { id: '2', name: 'Trần Thị B', email: 'tranthib@example.com', plan: 'Tăng cơ', status: 'Hoạt động', startDate: '15/01/2024' },
    { id: '3', name: 'Lê Văn C', email: 'levanc@example.com', plan: 'Thể hình', status: 'Không hoạt động', startDate: '10/02/2024' },
    { id: '4', name: 'Phạm Thị D', email: 'phamthid@example.com', plan: 'Giảm cân', status: 'Hoạt động', startDate: '20/02/2024' },
  ];

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Gói tập', dataIndex: 'plan', key: 'plan' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Danh sách khách hàng</h3>
      <Table2 columns={columns} dataSource={clients} rowKey="id" />
    </Card>
  );
}
