'use client';

import React from 'react';
import { Card, Table2 } from '@/shared/ui';

export default function PlansTable() {
  const plans = [
    { id: '1', client: 'Nguyễn Văn A', planType: 'Giảm cân', startDate: '01/01/2024', endDate: '01/06/2024', progress: '65%', status: 'Đang thực hiện' },
    { id: '2', client: 'Trần Thị B', planType: 'Tăng cơ', startDate: '15/01/2024', endDate: '15/07/2024', progress: '45%', status: 'Đang thực hiện' },
    { id: '3', client: 'Lê Văn C', planType: 'Thể hình', startDate: '10/12/2023', endDate: '10/06/2024', progress: '100%', status: 'Hoàn thành' },
    { id: '4', client: 'Phạm Thị D', planType: 'Giảm cân', startDate: '20/02/2024', endDate: '20/08/2024', progress: '30%', status: 'Tạm dừng' },
  ];

  const columns = [
    { title: 'Khách hàng', dataIndex: 'client', key: 'client' },
    { title: 'Loại kế hoạch', dataIndex: 'planType', key: 'planType' },
    { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate' },
    { title: 'Ngày kết thúc', dataIndex: 'endDate', key: 'endDate' },
    { title: 'Tiến độ', dataIndex: 'progress', key: 'progress' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Danh sách kế hoạch</h3>
      <Table2 columns={columns} dataSource={plans} rowKey="id" />
    </Card>
  );
}
