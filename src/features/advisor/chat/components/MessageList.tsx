import React, { useEffect, useRef } from 'react';
import { Icon } from '@/shared/ui/icon';
import type { ChatMessage } from '../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
  advisorLabel?: string;
  customerLabel?: string;
  loading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, advisorLabel, customerLabel, loading = false }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);

  return (
    <div 
      ref={containerRef} 
      className="flex flex-1 flex-col overflow-y-auto bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 px-6 py-6 scroll-smooth"
      style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)'
      }}
    >
      {loading ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[var(--primary)] absolute top-0 left-0"></div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--text)]">Đang tải tin nhắn...</span>
            <span className="text-xs text-[var(--text-secondary)]">Vui lòng đợi trong giây lát</span>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
            <Icon name="mdi:message-outline" size={32} className="text-slate-400" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--text)]">Chưa có tin nhắn nào</span>
            <span className="text-xs text-[var(--text-secondary)]">Hãy bắt đầu cuộc trò chuyện!</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isAdvisor={message.senderRole === 'advisor'}
              senderLabel={message.senderRole === 'advisor' ? (advisorLabel ?? 'Bạn') : (customerLabel ?? 'Khách hàng')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;
