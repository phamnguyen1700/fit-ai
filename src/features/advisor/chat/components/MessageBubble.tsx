import React from 'react';
import { Icon } from '@/shared/ui/icon';
import type { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
  isAdvisor: boolean;
  senderLabel: string;
}

const formatMessageTimestamp = (isoString: string) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isAdvisor, senderLabel }) => {
  const alignment = isAdvisor ? 'items-end' : 'items-start';
  const bubbleColor = isAdvisor 
    ? 'bg-primary text-white shadow-md' 
    : 'bg-gradient-to-br from-slate-100 to-slate-50 text-slate-900 border border-slate-200';
  
  return (
    <div className={`flex w-full flex-col gap-1.5 ${alignment} mb-3`}>
      <span className="text-xs font-medium text-[var(--text-tertiary)] px-1">{senderLabel}</span>
      <div className={`flex max-w-[75%] flex-col gap-2 rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md ${bubbleColor}`}>
        <span className={`whitespace-pre-wrap text-sm leading-relaxed ${isAdvisor ? 'text-white' : 'text-slate-800'}`}>
          {message.content}
        </span>
        <div className={`flex items-center gap-2 text-[11px] ${isAdvisor ? 'text-white/70' : 'text-slate-500'}`}>
          {isAdvisor && (
            <Icon
              name={message.isRead ? 'mdi:check-all' : 'mdi:check'}
              size={14}
              className={message.isRead ? 'text-orange-200' : 'text-white/70'}
            />
          )}
          <span className="font-medium">{formatMessageTimestamp(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
