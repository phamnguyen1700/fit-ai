'use client';

import React, { useState } from 'react';
import { Card, Input, Table2, Segmented } from '@/shared/ui';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  registrationTime: string;
  expirationDate: string;
  planType: 'free' | 'premium';
}

interface NewUserTableProps {
  users: User[];
}

const NewUserTable: React.FC<NewUserTableProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'free' | 'premium'>('free');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Ensure users is always an array and filter users based on active tab
  const safeUsers = users || [];
  const filteredUsers = safeUsers.filter(user => {
    if (!user) return false;
    const matchesTab = user.planType === activeTab;
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  // Paginate the filtered users
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Table columns
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, user: User) => (
        <div className="text-left font-medium">{user.name}</div>
      ),
      align: 'left' as const,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string, user: User) => (
        <div className="text-left">{user.email}</div>
      ),
      align: 'left' as const,
    },
    {
      title: 'Thời gian đăng ký',
      dataIndex: 'registrationTime',
      key: 'registrationTime',
      render: (text: string, user: User) => (
        <div className="text-center">{user.registrationTime}</div>
      ),
      align: 'center' as const,
    },
    {
      title: 'Thời hạn',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      render: (text: string, user: User) => (
        <div className="text-center">{user.expirationDate}</div>
      ),
      align: 'center' as const,
    },
  ];

  // Card layout for mobile
  const renderUserCard = (user: User) => (
    <div className="user-card bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-600">
            {user.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        
        {/* User Info */}
        <div className="flex-1">
          <div className="font-medium text-gray-900 mb-1">{user.name}</div>
          <div className="text-sm text-gray-500 mb-1">
            <span className="text-gray-400">Email:</span> {user.email}
          </div>
          <div className="text-sm text-gray-500">
            <span className="text-gray-400">Ngày/Giờ:</span> {user.expirationDate}
          </div>
        </div>
        
        {/* Plan Badge */}
        <div className="flex flex-col items-end">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
            user.planType === 'free' 
              ? 'bg-gray-50 text-gray-700 border-gray-200' 
              : 'bg-orange-50 text-orange-700 border-orange-200'
          }`}>
            {user.planType === 'free' ? 'Free Trial' : 'Premium'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-secondary">User mới đăng ký</h2>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Tabs */}
          <Segmented
            options={[
              { label: 'Free Trial', value: 'free' },
              { label: 'Premium', value: 'premium' },
            ]}
            value={activeTab}
            onChange={(value) => setActiveTab(value as 'free' | 'premium')}
            className="themed-segmented"
          />

          {/* Search */}
          <div className="flex items-center gap-2">
            <Input.Search
              placeholder="Tìm kiếm gói, tên ứng viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="w-64"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <Table2
          columns={columns}
          dataSource={paginatedUsers}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredUsers.length,
            showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} items`,
            showSizeChanger: false,
          }}
        />
      </div>
    </Card>
  );
};

export default NewUserTable;
