'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Flex } from '@/shared/ui/core/Flex';
import { Icon } from '@/shared/ui/icon';
import type { Conversation } from './types';
import ConversationList from './components/ConversationList';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatComposer from './components/ChatComposer';
import { useAdvisorChat } from './useAdvisorChat';

const computeSummary = (conversations: Conversation[]) => {
  const total = conversations.length;
  const unread = conversations.reduce((sum, item) => sum + item.unreadCount, 0);
  const online = conversations.filter((item) => item.status === 'online').length;
  const busy = conversations.filter((item) => item.status === 'busy').length;
  return {
    total,
    unread,
    online,
    busy,
  };
};

const SummaryTile: React.FC<{ icon: string; label: string; value: React.ReactNode; helper?: React.ReactNode }> = ({ icon, label, value, helper }) => (
  <div className="flex flex-1 min-w-[160px] items-center gap-3 rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[rgba(79,70,229,0.12)]">
      <Icon name={icon} size={20} color="var(--primary)" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <span className="text-lg font-semibold text-[var(--text)]">{value}</span>
      {helper ? <span className="text-xs text-[var(--text-secondary)]">{helper}</span> : null}
    </div>
  </div>
);

export const AdvisorChat: React.FC = () => {
  const {
    conversations,
    messages,
    selectedConversation,
    loadingMessages,
    sending,
    selectConversation,
    sendMessage,
  } = useAdvisorChat();

  const [searchTerm, setSearchTerm] = useState('');

  const summary = useMemo(() => computeSummary(conversations), [conversations]);

  const filteredConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return conversations;

    return conversations.filter((conversation) => {
      const haystack = [conversation.customerName, conversation.customerEmail, conversation.focusPlan].join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }, [conversations, searchTerm]);

  const conversationMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return messages.filter((message) => message.conversationId === selectedConversation.id);
  }, [messages, selectedConversation]);

  const handleSelectConversation = (conversation: Conversation) => {
    void selectConversation(conversation);
  };

  const handleSendMessage = (content: string) => {
    void sendMessage(content);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <Flex wrap="wrap" gap={16} className="md:flex-nowrap">
          <SummaryTile icon="mdi:message-processing-outline" label="Cuộc trò chuyện" value={summary.total} helper={`${summary.online} khách đang online`} />
          <SummaryTile icon="mdi:email-badge-outline" label="Tin nhắn chưa đọc" value={summary.unread} helper={`${summary.busy} khách bận hoặc offline`} />
          <SummaryTile icon="mdi:account-heart-outline" label="Khách hàng ưu tiên" value={summary.online + summary.busy > 0 ? summary.online + summary.busy : '0'} helper="Trạng thái online/bận" />
        </Flex>
      </Card>

      <div className="flex h-[calc(100vh-280px)] min-h-[540px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
        <div className="flex h-full flex-1 overflow-hidden">
          <div className="w-full max-w-[320px] flex-shrink-0 border-r border-[var(--border)]">
            <ConversationList
              items={filteredConversations}
              selectedId={selectedConversation?.id}
              onSelect={handleSelectConversation}
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
            />
          </div>

          <div className="flex flex-1 flex-col">
            {selectedConversation ? (
              <>
                <ChatHeader conversation={selectedConversation} />
                <MessageList
                  messages={conversationMessages}
                  advisorLabel="Bạn"
                  customerLabel={selectedConversation.customerName}
                />
                <ChatComposer onSend={handleSendMessage} disabled={sending || loadingMessages} />
              </>
            ) : (
              <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-[var(--text-secondary)]">
                <Icon name="mdi:message-text-outline" size={48} className="text-[var(--text-tertiary)]" />
                <div className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-[var(--text)]">Chưa chọn cuộc trò chuyện</span>
                  <span>Chọn một khách hàng ở danh sách bên trái để bắt đầu trao đổi.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorChat;
