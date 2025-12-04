import React from 'react';
import { Input } from '@/shared/ui/core/Input';
import { Icon } from '@/shared/ui/icon';
import Avatar from '@/shared/ui/core/Avatar';
import type { Conversation } from '../types';

interface ConversationListProps {
  items: Conversation[];
  selectedId?: string;
  searchTerm: string;
  onSearch: (value: string) => void;
  onSelect: (conversation: Conversation) => void;
}

const STATUS_COLORS: Record<Conversation['status'], string> = {
  online: '#16a34a',
  offline: '#94a3b8',
  busy: '#f97316',
};

const formatTimestamp = (isoString?: string) => {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

const ConversationListItem: React.FC<{
  conversation: Conversation;
  isActive: boolean;
  onSelect: (conversation: Conversation) => void;
}> = ({ conversation, isActive, onSelect }) => {
  const { customerName, lastMessage, lastTimestamp, status, unreadCount, avatarUrl, focusPlan } = conversation;

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={`flex w-full gap-3 px-4 py-3.5 text-left transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-[rgba(79,70,229,0.12)] to-[rgba(79,70,229,0.06)] border-l-4 border-[var(--primary)] shadow-sm' 
          : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent'
      }`}
    >
      <div className="relative h-12 w-12 flex-shrink-0">
        <Avatar src={avatarUrl} size={48} className="h-12 w-12 ring-2 ring-white shadow-sm">
          {customerName?.[0] ?? '?'}
        </Avatar>
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: STATUS_COLORS[status] }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-[var(--text)]">{customerName}</span>
          <span className="ml-auto text-xs font-medium text-[var(--text-secondary)] whitespace-nowrap">
            {formatTimestamp(lastTimestamp)}
          </span>
        </div>
        {focusPlan ? (
          <span className="truncate text-xs font-medium text-[var(--primary)] bg-[rgba(79,70,229,0.08)] px-2 py-0.5 rounded-full inline-block w-fit">
            {focusPlan}
          </span>
        ) : null}
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Icon name="mdi:message-outline" size={14} className="text-[var(--text-tertiary)] flex-shrink-0" />
          <span className="truncate flex-1">{lastMessage || 'Chưa có tin nhắn'}</span>
          {unreadCount > 0 ? (
            <span className="ml-auto inline-flex min-w-[22px] items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)] to-[#6366f1] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
};

export const ConversationList: React.FC<ConversationListProps> = ({ items, selectedId, onSelect, searchTerm, onSearch }) => {
  return (
    <div className="flex h-full flex-col border-r border-[var(--border)] bg-gradient-to-b from-white to-slate-50/30">
      <div className="border-b border-[var(--border)] bg-white/80 backdrop-blur-sm p-4 shadow-sm">
        <Input.Search
          placeholder="Tìm kiếm khách hàng..."
          value={searchTerm}
          onChange={(event) => onSearch(event.target.value)}
          onSearch={onSearch}
          className="themed-input w-full text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 py-12 text-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Icon name="mdi:account-search-outline" size={28} className="text-slate-400" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[var(--text)]">Không có cuộc trò chuyện nào</span>
              <span className="text-xs text-[var(--text-secondary)]">Hãy đợi khách hàng liên hệ</span>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
