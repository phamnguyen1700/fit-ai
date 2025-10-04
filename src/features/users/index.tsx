'use client';

import React, { useState } from 'react';
import { UserTable } from './components/UserTable';
import { Card } from '@/shared/ui/core/Card';
import type { UserCardProps } from '@/shared/ui/common/UserCard';

// Fake data cho 12 users
const createFakeUsers = (): UserCardProps[] => [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'nguyen.van.an@example.com',
    datetime: '15/01/2025 – 09:30 AM',
    planLabel: '3 tháng Premium',
    amountLabel: 'đ1.200.000',
    statusLabel: 'Thành công',
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    email: 'tran.thi.binh@example.com',
    datetime: '14/01/2025 – 14:20 PM',
    planLabel: '1 tháng Cơ bản',
    amountLabel: 'đ300.000',
    statusLabel: 'Thành công',
  },
  {
    id: '3',
    name: 'Lê Hoàng Cường',
    email: 'le.hoang.cuong@example.com',
    datetime: '13/01/2025 – 11:45 AM',
    planLabel: '6 tháng VIP',
    amountLabel: 'đ3.600.000',
    statusLabel: 'Đang xử lý',
  },
  {
    id: '4',
    name: 'Phạm Thu Hương',
    email: 'pham.thu.huong@example.com',
    datetime: '12/01/2025 – 16:10 PM',
    planLabel: '1 tháng Premium',
    amountLabel: 'đ500.000',
    statusLabel: 'Thành công',
  },
  {
    id: '5',
    name: 'Hoàng Văn Đức',
    email: 'hoang.van.duc@example.com',
    datetime: '11/01/2025 – 08:15 AM',
    planLabel: '3 tháng Cơ bản',
    amountLabel: 'đ900.000',
    statusLabel: 'Thành công',
  },
  {
    id: '6',
    name: 'Vũ Thị Mai',
    email: 'vu.thi.mai@example.com',
    datetime: '10/01/2025 – 13:30 PM',
    planLabel: '1 năm VIP',
    amountLabel: 'đ6.000.000',
    statusLabel: 'Thành công',
  },
  {
    id: '7',
    name: 'Đặng Minh Tuấn',
    email: 'dang.minh.tuan@example.com',
    datetime: '09/01/2025 – 10:00 AM',
    planLabel: '1 tháng Cơ bản',
    amountLabel: 'đ300.000',
    statusLabel: 'Thất bại',
  },
  {
    id: '8',
    name: 'Bùi Thị Lan',
    email: 'bui.thi.lan@example.com',
    datetime: '08/01/2025 – 15:45 PM',
    planLabel: '3 tháng Premium',
    amountLabel: 'đ1.200.000',
    statusLabel: 'Thành công',
  },
  {
    id: '9',
    name: 'Ngô Văn Hải',
    email: 'ngo.van.hai@example.com',
    datetime: '07/01/2025 – 12:20 PM',
    planLabel: '6 tháng Cơ bản',
    amountLabel: 'đ1.800.000',
    statusLabel: 'Thành công',
  },
  {
    id: '10',
    name: 'Đinh Thị Nga',
    email: 'dinh.thi.nga@example.com',
    datetime: '06/01/2025 – 09:50 AM',
    planLabel: '1 tháng Premium',
    amountLabel: 'đ500.000',
    statusLabel: 'Đang xử lý',
  },
  {
    id: '11',
    name: 'Lý Văn Thành',
    email: 'ly.van.thanh@example.com',
    datetime: '05/01/2025 – 17:15 PM',
    planLabel: '3 tháng VIP',
    amountLabel: 'đ2.100.000',
    statusLabel: 'Thành công',
  },
  {
    id: '12',
    name: 'Cao Thị Hoa',
    email: 'cao.thi.hoa@example.com',
    datetime: '04/01/2025 – 11:30 AM',
    planLabel: '1 năm Premium',
    amountLabel: 'đ4.800.000',
    statusLabel: 'Thành công',
  },
];

export const UserPage: React.FC = () => {
  const [users] = useState<UserCardProps[]>(createFakeUsers());

  return (
    <Card title={<span className="text text-base sm:text-lg font-semibold">Thống kê nhanh</span>}
    >
      <UserTable users={users} />
    </Card>
  );
};