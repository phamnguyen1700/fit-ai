'use client';

import React, { useState } from 'react';
import { AdvisorTable } from './components/AdvisorTable';
import { Card } from '@/shared/ui/core/Card';
import type { AdvisorCardProps } from '@/shared/ui/common/AdvisorCard';

// Fake data for 12 advisors
const createFakeAdvisors = (): AdvisorCardProps[] => [
  {
    id: '1',
    name: 'Nguyễn Văn Mạnh',
    email: 'nguyen.van.manh@fitai.com',
    phone: '0901234567',
    specialty: 'Thể hình',
    experience: '8 năm',
    clients: 145,
    rating: 4.8,
    statusLabel: 'Hoạt động',
  },
  {
    id: '2',
    name: 'Trần Thị Hương',
    email: 'tran.thi.huong@fitai.com',
    phone: '0902345678',
    specialty: 'Yoga',
    experience: '5 năm',
    clients: 98,
    rating: 4.9,
    statusLabel: 'Hoạt động',
  },
  {
    id: '3',
    name: 'Lê Hoàng Nam',
    email: 'le.hoang.nam@fitai.com',
    phone: '0903456789',
    specialty: 'Dinh dưỡng',
    experience: '6 năm',
    clients: 120,
    rating: 4.7,
    statusLabel: 'Hoạt động',
  },
  {
    id: '4',
    name: 'Phạm Thu Thảo',
    email: 'pham.thu.thao@fitai.com',
    phone: '0904567890',
    specialty: 'Giảm cân',
    experience: '4 năm',
    clients: 87,
    rating: 4.6,
    statusLabel: 'Tạm nghỉ',
  },
  {
    id: '5',
    name: 'Hoàng Văn Tuấn',
    email: 'hoang.van.tuan@fitai.com',
    phone: '0905678901',
    specialty: 'Tim mạch',
    experience: '10 năm',
    clients: 200,
    rating: 4.9,
    statusLabel: 'Hoạt động',
  },
  {
    id: '6',
    name: 'Vũ Thị Lan',
    email: 'vu.thi.lan@fitai.com',
    phone: '0906789012',
    specialty: 'Yoga',
    experience: '7 năm',
    clients: 156,
    rating: 4.8,
    statusLabel: 'Hoạt động',
  },
  {
    id: '7',
    name: 'Đặng Minh Quân',
    email: 'dang.minh.quan@fitai.com',
    phone: '0907890123',
    specialty: 'Thể hình',
    experience: '3 năm',
    clients: 65,
    rating: 4.5,
    statusLabel: 'Hoạt động',
  },
  {
    id: '8',
    name: 'Bùi Thị Nga',
    email: 'bui.thi.nga@fitai.com',
    phone: '0908901234',
    specialty: 'Dinh dưỡng',
    experience: '5 năm',
    clients: 110,
    rating: 4.7,
    statusLabel: 'Hoạt động',
  },
  {
    id: '9',
    name: 'Ngô Văn Đức',
    email: 'ngo.van.duc@fitai.com',
    phone: '0909012345',
    specialty: 'Tim mạch',
    experience: '9 năm',
    clients: 178,
    rating: 4.8,
    statusLabel: 'Hoạt động',
  },
  {
    id: '10',
    name: 'Đinh Thị Mai',
    email: 'dinh.thi.mai@fitai.com',
    phone: '0910123456',
    specialty: 'Giảm cân',
    experience: '4 năm',
    clients: 92,
    rating: 4.6,
    statusLabel: 'Tạm nghỉ',
  },
  {
    id: '11',
    name: 'Lý Văn Hùng',
    email: 'ly.van.hung@fitai.com',
    phone: '0911234567',
    specialty: 'Thể hình',
    experience: '12 năm',
    clients: 230,
    rating: 5.0,
    statusLabel: 'Hoạt động',
  },
  {
    id: '12',
    name: 'Cao Thị Hoa',
    email: 'cao.thi.hoa@fitai.com',
    phone: '0912345678',
    specialty: 'Yoga',
    experience: '6 năm',
    clients: 134,
    rating: 4.7,
    statusLabel: 'Ngưng hoạt động',
  },
];

export const AdvisorPage: React.FC = () => {
  const [advisors] = useState<AdvisorCardProps[]>(createFakeAdvisors());

  return (
    <Card 
      title={<span className="text text-base sm:text-lg font-semibold">Danh sách Advisor</span>}
    >
      <AdvisorTable advisors={advisors} />
    </Card>
  );
};
