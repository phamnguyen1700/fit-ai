import React from 'react';
import Avatar from '@/shared/ui/core/Avatar';
import { Icon } from '@/shared/ui/icon';
import type { Conversation } from '../types';

interface ChatHeaderProps {
  conversation: Conversation;
  isTyping?: boolean;
}

const STATUS_LABELS: Record<Conversation['status'], string> = {
  online: 'Đang hoạt động',
  offline: 'Ngoại tuyến',
  busy: 'Đang bận',
};

const STATUS_COLORS: Record<Conversation['status'], string> = {
  online: '#16a34a',
  offline: '#94a3b8',
  busy: '#f97316',
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, isTyping = false }) => {
  const { customerName, customerEmail, avatarUrl, focusPlan, status } = conversation;

  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar src={avatarUrl} size={48} className="h-12 w-12">
            {customerName?.[0] ?? '?'}
          </Avatar>
          <span
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-white"
            style={{ backgroundColor: STATUS_COLORS[status] }}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--text)]">{customerName}</span>
            {isTyping ? (
              <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-600">
                <span className="flex gap-0.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600" style={{ animationDelay: '300ms' }} />
                </span>
                <span className="font-medium">Đang nhập...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-[rgba(79,70,229,0.08)] px-2 py-0.5 text-xs text-[var(--primary)]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] }} />
                {STATUS_LABELS[status]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <Icon name="mdi:email-outline" size={14} />
              {customerEmail}
            </span>
            {focusPlan ? (
              <span className="flex items-center gap-1">
                <Icon name="mdi:target" size={14} />
                {focusPlan}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
