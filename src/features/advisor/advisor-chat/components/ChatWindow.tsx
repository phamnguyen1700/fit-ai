'use client';

import React from 'react';
import { Card, Button } from '@/shared/ui';
import { Icon, icons } from '@/shared/ui/icon';

interface Message {
  id: string;
  sender: 'advisor' | 'client';
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  clientId: string;
}

export default function ChatWindow({ clientId }: ChatWindowProps) {
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      sender: 'client',
      content: 'Xin chào anh, em muốn hỏi về lịch tập tuần này ạ',
      timestamp: '10:00 AM',
    },
    {
      id: '2',
      sender: 'advisor',
      content: 'Chào em! Anh xem lịch của em rồi. Em có thể tập vào thứ 2, 4, 6 nhé.',
      timestamp: '10:02 AM',
    },
    {
      id: '3',
      sender: 'client',
      content: 'Dạ, vậy mỗi buổi tập bao lâu ạ?',
      timestamp: '10:05 AM',
    },
    {
      id: '4',
      sender: 'advisor',
      content: 'Mỗi buổi khoảng 1.5 tiếng, bao gồm khởi động, tập chính và giãn cơ. Em nhớ ăn uống điều độ và nghỉ ngơi đủ giấc nhé!',
      timestamp: '10:06 AM',
    },
    {
      id: '5',
      sender: 'client',
      content: 'Cảm ơn anh đã hỗ trợ!',
      timestamp: '10:08 AM',
    },
  ]);

  const clientInfo = {
    '1': { name: 'Nguyễn Văn A', plan: 'Giảm cân' },
    '2': { name: 'Trần Thị B', plan: 'Tăng cơ' },
    '3': { name: 'Lê Văn C', plan: 'Thể hình' },
    '4': { name: 'Phạm Thị D', plan: 'Giảm cân' },
  }[clientId] || { name: 'Khách hàng', plan: 'Chưa có kế hoạch' };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'advisor',
        content: message,
        timestamp: new Date().toLocaleTimeString('vi-VN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
            style={{
              background: 'var(--primary)',
              color: 'var(--text-inverse)',
            }}
          >
            {clientInfo.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{clientInfo.name}</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{clientInfo.plan}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Icon name={icons.phone} />
          </Button>
          <Button variant="ghost" size="sm">
            <Icon name="mdi:video-outline" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'advisor' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[70%] rounded-lg p-3"
              style={{
                background: msg.sender === 'advisor' ? 'var(--primary)' : 'var(--bg-secondary)',
                color: msg.sender === 'advisor' ? 'var(--text-inverse)' : 'var(--text)',
              }}
            >
              <p className="text-sm">{msg.content}</p>
              <p
                className="text-xs mt-1"
                style={{
                  color: msg.sender === 'advisor' 
                    ? 'rgba(255, 255, 255, 0.7)' 
                    : 'var(--text-secondary)',
                }}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Icon name="mdi:paperclip" />
          </Button>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)',
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          />
          <Button variant="primary" onClick={handleSendMessage}>
            <Icon name="mdi:send" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
