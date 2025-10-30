'use client';

import React from 'react';
import { Card } from '@/shared/ui';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  age: number;
  goal: string;
  joinDate: string;
  progress: number;
  avatar?: string;
  status: 'active' | 'inactive';
  lastActivity: string;
  sessionsThisMonth: number;
  needsFeedback: number;
  unreadMessages: number;
}

export default function ClientsMonthView() {
  const router = useRouter();
  const [filter, setFilter] = React.useState<'all' | 'active' | 'needs-feedback'>('all');

  const clients: Client[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      age: 28,
      goal: 'Giảm cân',
      joinDate: '01/10/2024',
      progress: 65,
      status: 'active',
      lastActivity: '2 giờ trước',
      sessionsThisMonth: 12,
      needsFeedback: 3,
      unreadMessages: 2,
    },
    {
      id: '2',
      name: 'Trần Thị B',
      age: 25,
      goal: 'Tăng cơ',
      joinDate: '05/10/2024',
      progress: 45,
      status: 'active',
      lastActivity: '5 giờ trước',
      sessionsThisMonth: 10,
      needsFeedback: 1,
      unreadMessages: 0,
    },
    {
      id: '3',
      name: 'Lê Văn C',
      age: 32,
      goal: 'Thể hình',
      joinDate: '10/10/2024',
      progress: 80,
      status: 'active',
      lastActivity: '1 ngày trước',
      sessionsThisMonth: 15,
      needsFeedback: 0,
      unreadMessages: 1,
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      age: 30,
      goal: 'Giảm cân',
      joinDate: '15/10/2024',
      progress: 30,
      status: 'inactive',
      lastActivity: '3 ngày trước',
      sessionsThisMonth: 5,
      needsFeedback: 2,
      unreadMessages: 0,
    },
    {
      id: '5',
      name: 'Hoàng Văn E',
      age: 27,
      goal: 'Tăng sức bền',
      joinDate: '18/10/2024',
      progress: 55,
      status: 'active',
      lastActivity: '30 phút trước',
      sessionsThisMonth: 8,
      needsFeedback: 4,
      unreadMessages: 1,
    },
    {
      id: '6',
      name: 'Đặng Thị F',
      age: 24,
      goal: 'Giảm mỡ',
      joinDate: '20/10/2024',
      progress: 40,
      status: 'active',
      lastActivity: '1 giờ trước',
      sessionsThisMonth: 9,
      needsFeedback: 1,
      unreadMessages: 3,
    },
  ];

  const filteredClients = clients.filter((client) => {
    if (filter === 'all') return true;
    if (filter === 'active') return client.status === 'active';
    if (filter === 'needs-feedback') return client.needsFeedback > 0;
    return true;
  });

  const handleClientClick = (clientId: string) => {
    router.push(`/advisor/clients/${clientId}`);
  };

  return (
    <Card className="p-6">
      {/* Header with Filters */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Khách hàng tháng {new Date().getMonth() + 1}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tất cả ({clients.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'active'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đang hoạt động ({clients.filter(c => c.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('needs-feedback')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'needs-feedback'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Cần feedback ({clients.filter(c => c.needsFeedback > 0).length})
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => handleClientClick(client.id)}
            className="bg-white border rounded-lg p-5 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
          >
            {/* Header with Avatar and Status */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {client.name.charAt(0)}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      client.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{client.name}</h3>
                  <p className="text-xs text-gray-500">{client.age} tuổi • {client.goal}</p>
                </div>
              </div>
              
              {/* Badges */}
              <div className="flex flex-col gap-1">
                {client.needsFeedback > 0 && (
                  <span className="px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full font-medium">
                    {client.needsFeedback} feedback
                  </span>
                )}
                {client.unreadMessages > 0 && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full font-medium">
                    {client.unreadMessages} tin nhắn
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Tiến độ tháng này</span>
                <span className="font-semibold text-primary">{client.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${client.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              <div>
                <p className="text-xs text-gray-500">Buổi tập</p>
                <p className="font-semibold text-sm">{client.sessionsThisMonth} buổi</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Hoạt động</p>
                <p className="font-semibold text-sm">{client.lastActivity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
