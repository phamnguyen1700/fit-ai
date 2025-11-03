'use client';

import React from 'react';
import { Card, SearchInput } from '@/shared/ui';

interface Client {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
  online: boolean;
}

interface ChatListProps {
  selectedClient: string | null;
  onSelectClient: (clientId: string) => void;
}

export default function ChatList({ selectedClient, onSelectClient }: ChatListProps) {
  const clients: Client[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      lastMessage: 'Cảm ơn anh đã hỗ trợ!',
      timestamp: '2 phút trước',
      unread: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Trần Thị B',
      lastMessage: 'Lịch tập mai có thay đổi không ạ?',
      timestamp: '10 phút trước',
      unread: 0,
      online: true,
    },
    {
      id: '3',
      name: 'Lê Văn C',
      lastMessage: 'OK, em sẽ thử làm theo',
      timestamp: '1 giờ trước',
      unread: 0,
      online: false,
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      lastMessage: 'Khi nào có lịch mới?',
      timestamp: '3 giờ trước',
      unread: 1,
      online: false,
    },
  ];

  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-4 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>Tin nhắn</h3>
      
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)',
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => onSelectClient(client.id)}
            className="p-3 rounded-lg cursor-pointer transition-colors border-l-4"
            style={{
              background: selectedClient === client.id ? 'rgba(255, 140, 0, 0.1)' : 'transparent',
              borderLeftColor: selectedClient === client.id ? 'var(--primary)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (selectedClient !== client.id) {
                e.currentTarget.style.background = 'var(--bg-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedClient !== client.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
                  style={{
                    background: 'var(--primary)',
                    color: 'var(--text-inverse)',
                  }}
                >
                  {client.name.charAt(0)}
                </div>
                {client.online && (
                  <div 
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                    style={{
                      background: 'var(--success)',
                      borderColor: 'var(--bg)',
                    }}
                  ></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{client.name}</h4>
                  <span className="text-xs whitespace-nowrap ml-2" style={{ color: 'var(--text-tertiary)' }}>
                    {client.timestamp}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{client.lastMessage}</p>
                  {client.unread > 0 && (
                    <span 
                      className="ml-2 text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      style={{
                        background: 'var(--primary)',
                        color: 'var(--text-inverse)',
                      }}
                    >
                      {client.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
