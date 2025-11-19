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

const formatTimestamp = (isoString: string) => {
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
      className={`flex w-full gap-3 border-b border-[var(--border)] px-4 py-3 text-left transition-colors ${
        isActive ? 'bg-[rgba(79,70,229,0.08)]' : 'hover:bg-[rgba(79,70,229,0.05)]'
      }`}
    >
      <div className="relative h-11 w-11 flex-shrink-0">
        <Avatar src={avatarUrl} size={44} className="h-11 w-11">
          {customerName?.[0] ?? '?'}
        </Avatar>
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-white"
          style={{ backgroundColor: STATUS_COLORS[status] }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-[var(--text)]">{customerName}</span>
          <span className="ml-auto text-xs text-[var(--text-secondary)]">{formatTimestamp(lastTimestamp)}</span>
        </div>
        {focusPlan ? (
          <span className="truncate text-xs text-[var(--text-secondary)]">{focusPlan}</span>
        ) : null}
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Icon name="mdi:message-outline" size={14} className="text-[var(--text-tertiary)]" />
          <span className="truncate">{lastMessage}</span>
          {unreadCount > 0 ? (
            <span className="ml-auto inline-flex min-w-[22px] items-center justify-center rounded-full bg-[var(--primary)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
};

export const ConversationList: React.FC<ConversationListProps> = ({ items, selectedId, onSelect, searchTerm, onSearch }) => {
  return (
    <div className="flex h-full flex-col border-r border-[var(--border)] bg-white">
      <div className="border-b border-[var(--border)] p-4">
        <Input.Search
          placeholder="Tìm kiếm khách hàng..."
          value={searchTerm}
          onChange={(event) => onSearch(event.target.value)}
          onSearch={onSearch}
          className="themed-input w-full text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
            Không có cuộc trò chuyện nào.
          </div>
        ) : (
          items.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === selectedId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
