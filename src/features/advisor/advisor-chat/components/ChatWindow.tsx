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
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            {clientInfo.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold">{clientInfo.name}</h3>
            <p className="text-sm text-gray-500">{clientInfo.plan}</p>
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
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.sender === 'advisor'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === 'advisor' ? 'text-white text-opacity-70' : 'text-gray-500'
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Icon name="mdi:paperclip" />
          </Button>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button variant="primary" onClick={handleSendMessage}>
            <Icon name="mdi:send" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
