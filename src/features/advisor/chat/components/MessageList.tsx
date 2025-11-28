import React, { useEffect, useRef } from 'react';
import { Icon } from '@/shared/ui/icon';
import type { ChatMessage } from '../types';

interface MessageListProps {
  messages: ChatMessage[];
  advisorLabel?: string;
  customerLabel?: string;
}

const formatMessageTimestamp = (isoString: string) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const MessageBubble: React.FC<{ message: ChatMessage; isAdvisor: boolean; advisorLabel?: string; customerLabel?: string }> = ({
  message,
  isAdvisor,
  advisorLabel,
  customerLabel,
}) => {
  const alignment = isAdvisor ? 'items-end' : 'items-start';
  const bubbleColor = isAdvisor ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text)]';
  const label = isAdvisor ? advisorLabel ?? 'Bạn' : customerLabel ?? 'Khách hàng';

  return (
    <div className={`flex w-full flex-col gap-1 ${alignment}`}>
      <span className="text-xs text-[var(--text-tertiary)]">{label}</span>
      <div className={`flex max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-2 shadow ${bubbleColor}`}>
        <span className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</span>
        <div className={`flex items-center gap-2 text-[11px] ${isAdvisor ? 'text-[rgba(255,255,255,0.7)]' : 'text-[var(--text-tertiary)]'}`}>
          <Icon
            name={isAdvisor ? 'mdi:check-all' : 'mdi:message-processing-outline'}
            size={14}
            className={isAdvisor ? 'text-[rgba(255,255,255,0.7)]' : 'text-[var(--text-tertiary)]'}
          />
          <span>{formatMessageTimestamp(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export const MessageList: React.FC<MessageListProps> = ({ messages, advisorLabel, customerLabel }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);

  return (
    <div ref={containerRef} className="flex flex-1 flex-col gap-4 overflow-y-auto bg-[var(--bg)] px-6 py-6">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-[var(--text-secondary)]">
          <Icon name="mdi:message-outline" size={28} className="text-[var(--text-tertiary)]" />
          <span>Hãy chọn một khách hàng để bắt đầu trò chuyện.</span>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isAdvisor={message.sender === 'advisor'}
            advisorLabel={advisorLabel}
            customerLabel={customerLabel}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;
