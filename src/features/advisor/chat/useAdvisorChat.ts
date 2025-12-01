'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import type { ChatMessage, Conversation } from './types';
import { get, post } from '@/shared/api/http';

// Đường dẫn hub SignalR phía backend, chỉnh lại nếu khác
const HUB_PATH = '/hub/advisorChat';

interface UseAdvisorChatState {
  conversations: Conversation[];
  messages: ChatMessage[];
  selectedConversation: Conversation | null;
  loadingConversations: boolean;
  loadingMessages: boolean;
  sending: boolean;
}

interface UseAdvisorChatReturn extends UseAdvisorChatState {
  selectConversation: (conversation: Conversation) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
}

export const useAdvisorChat = (): UseAdvisorChatReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const selectedConversation = useMemo(
    () => conversations.find((item) => item.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId],
  );

  const ensureConnection = useCallback(async () => {
    if (connectionRef.current) return connectionRef.current;
    if (typeof window === 'undefined') return null;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      console.error('[AdvisorChat] Thiếu NEXT_PUBLIC_API_URL để tạo SignalR connection');
      return null;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}${HUB_PATH}`, {
        accessTokenFactory: () => localStorage.getItem('authToken') ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on('MessageReceived', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === message.conversationId
            ? {
                ...conv,
                lastMessage: message.content,
                lastTimestamp: message.timestamp,
                unreadCount:
                  message.conversationId === selectedConversationId ? 0 : conv.unreadCount + 1,
              }
            : conv,
        ),
      );
    });

    connection.on('ConversationUpdated', (conversation: Conversation) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversation.id);
        if (!exists) return [conversation, ...prev];
        return prev.map((c) => (c.id === conversation.id ? conversation : c));
      });
    });

    await connection.start();
    connectionRef.current = connection;
    return connection;
  }, [selectedConversationId]);

  const refreshConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const res = await get<Conversation[]>('/api/advisorchat/conversations');
      if (res.success && res.data) {
        setConversations(res.data);
        if (!selectedConversationId && res.data.length > 0) {
          setSelectedConversationId(res.data[0].id);
        }
      } else {
        console.error('[AdvisorChat] Lỗi lấy danh sách cuộc trò chuyện:', res.message);
      }
    } finally {
      setLoadingConversations(false);
    }
  }, [selectedConversationId]);

  const loadMessages = useCallback(async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const res = await get<ChatMessage[]>(
        `/api/advisorchat/conversations/${conversationId}/messages`,
        { params: { skip: 0, take: 50 } },
      );

      if (res.success && res.data) {
        setMessages(res.data);
      } else {
        console.error('[AdvisorChat] Lỗi lấy tin nhắn:', res.message);
      }

      await post<void>(`/api/advisorchat/conversations/${conversationId}/read`);

      setConversations((prev) =>
        prev.map((item) =>
          item.id === conversationId ? { ...item, unreadCount: 0 } : item,
        ),
      );
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      setSelectedConversationId(conversation.id);
      await loadMessages(conversation.id);

      const connection = await ensureConnection();
      if (!connection) return;

      try {
        await connection.invoke('JoinConversation', conversation.id);
      } catch (err) {
        console.error('[AdvisorChat] JoinConversation error:', err);
      }
    },
    [ensureConnection, loadMessages],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedConversation) return;

      setSending(true);
      const timestamp = new Date().toISOString();

      // optimistic update
      const optimistic: ChatMessage = {
        id: `tmp-${Date.now()}`,
        conversationId: selectedConversation.id,
        sender: 'advisor',
        content,
        timestamp,
      };
      setMessages((prev) => [...prev, optimistic]);
      setConversations((prev) =>
        prev.map((item) =>
          item.id === selectedConversation.id
            ? { ...item, lastMessage: content, lastTimestamp: timestamp }
            : item,
        ),
      );

      try {
        const connection = await ensureConnection();
        if (!connection) {
          console.error('[AdvisorChat] Không thể gửi tin nhắn vì SignalR chưa sẵn sàng');
          return;
        }
        await connection.invoke('SendMessage', {
          conversationId: selectedConversation.id,
          content,
        });
      } catch (err) {
        console.error('[AdvisorChat] SendMessage error:', err);
      } finally {
        setSending(false);
      }
    },
    [ensureConnection, selectedConversation],
  );

  useEffect(() => {
    void refreshConversations();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop().catch(() => undefined);
        connectionRef.current = null;
      }
    };
  }, [refreshConversations]);

  return {
    conversations,
    messages,
    selectedConversation,
    loadingConversations,
    loadingMessages,
    sending,
    selectConversation,
    sendMessage,
    refreshConversations,
  };
};

export default useAdvisorChat;


