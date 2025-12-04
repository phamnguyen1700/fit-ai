'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import type { ChatMessage, Conversation, TypingUser } from './types';
import type { ChatMessageDto, ConversationDto } from '@/types/advisorchat';
import { getChatSignalRService, type SignalRConnectionState, type ReceivedMessage } from '@/lib/signalr';
import { useGetConversations, useGetConversationMessages, useMarkMessagesAsRead } from '@/tanstack/hooks/advisorchat';
import { useQueryClient } from '@tanstack/react-query';
import { advisorChatKeys } from '@/tanstack/hooks/advisorchat';
import { getUserDetail } from '@/tanstack/services/users';
import { getAdvisorDetailService } from '@/tanstack/services/advisor';

interface UseAdvisorChatState {
  conversations: Conversation[];
  messages: ChatMessage[];
  selectedConversation: Conversation | null;
  loadingConversations: boolean;
  loadingMessages: boolean;
  sending: boolean;
  connectionState: SignalRConnectionState;
  typingUsers: TypingUser[];
}

interface UseAdvisorChatReturn extends UseAdvisorChatState {
  selectConversation: (conversation: Conversation) => Promise<void>;
  sendMessage: (content: string, messageType?: string) => Promise<void>;
  sendTyping: () => void;
  sendStopTyping: () => void;
}

// Helper to convert backend DTO to UI model
const convertConversationDto = (dto: ConversationDto, userName?: string, userEmail?: string): Conversation => {
  return {
    id: dto.id,
    userId: dto.userId,
    advisorId: dto.advisorId,
    customerName: userName || dto.title || 'User',
    customerEmail: userEmail,
    avatarUrl: undefined,
    focusPlan: undefined,
    title: dto.title,
    lastMessage: dto.lastMessageContent,
    lastTimestamp: dto.lastMessageAt,
    unreadCount: dto.unreadCount,
    status: dto.isOnline ? 'online' : 'offline',
    isOnline: dto.isOnline,
  };
};

const convertMessageDto = (dto: ChatMessageDto): ChatMessage => {
  return {
    id: dto.id,
    conversationId: dto.conversationId,
    senderId: dto.senderId,
    senderRole: dto.senderRole as 'advisor' | 'user',
    senderName: dto.senderName,
    content: dto.content,
    messageType: dto.messageType,
    timestamp: dto.createdAt,
    attachmentUrl: dto.attachmentUrl,
    attachmentName: dto.attachmentName,
    attachmentSize: dto.attachmentSize,
    isRead: dto.isRead,
    readAt: dto.readAt,
    isEdited: dto.isEdited,
    editedAt: dto.editedAt,
    replyToMessageId: dto.replyToMessageId,
  };
};

export const useAdvisorChat = (): UseAdvisorChatReturn => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [connectionState, setConnectionState] = useState<SignalRConnectionState>('Disconnected');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [enrichedConversations, setEnrichedConversations] = useState<Conversation[]>([]);
  
  const signalRServiceRef = useRef(getChatSignalRService());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversationsData, isLoading: loadingConversations } = useGetConversations();
  
  // Enrich conversations with user/advisor names
  useEffect(() => {
    const enrichConversations = async () => {
      if (!conversationsData || conversationsData.length === 0) {
        setEnrichedConversations([]);
        return;
      }

      const enriched = await Promise.all(
        conversationsData.map(async (dto) => {
          let userName = 'User';
          let userEmail = undefined;

          try {
            // Fetch user details
            const userResponse = await getUserDetail(dto.userId);
            if (userResponse.success && userResponse.data) {
              const user = userResponse.data;
              userName = user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}`.trim()
                : user.username || user.email || 'User';
              userEmail = user.email;
            }
          } catch (error) {
            console.error(`Failed to fetch user details for ${dto.userId}:`, error);
          }

          return convertConversationDto(dto, userName, userEmail);
        })
      );

      setEnrichedConversations(enriched);
    };

    void enrichConversations();
  }, [conversationsData]);

  const conversations = enrichedConversations;
  
  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: loadingMessages } = useGetConversationMessages(
    selectedConversationId ?? '',
    { skip: 0, take: 100 }
  );

  // Mark as read mutation
  const markAsReadMutation = useMarkMessagesAsRead();

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) ?? null;

  // Initialize SignalR connection
  useEffect(() => {
    const service = signalRServiceRef.current;
    
    const initSignalR = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') ?? '' : '';
      if (!token) {
        console.warn('[useAdvisorChat] No auth token found');
        return;
      }

      service.setEventHandlers({
        onReceiveMessage: async (message: ReceivedMessage) => {
          // Fetch sender name
          let senderName = 'User';
          try {
            if (message.senderRole === 'user') {
              const userResponse = await getUserDetail(message.senderId);
              if (userResponse.success && userResponse.data) {
                const user = userResponse.data;
                senderName = user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`.trim()
                  : user.username || user.email || 'User';
              }
            } else if (message.senderRole === 'advisor') {
              const advisorResponse = await getAdvisorDetailService(message.senderId);
              if (advisorResponse.success && advisorResponse.data) {
                const advisor = advisorResponse.data;
                senderName = advisor.firstName && advisor.lastName 
                  ? `${advisor.firstName} ${advisor.lastName}`.trim()
                  : advisor.email || 'Advisor';
              }
            }
          } catch (error) {
            console.error('Failed to fetch sender details:', error);
          }

          // Add message to local state
          const chatMessage: ChatMessage = {
            id: message.id,
            conversationId: message.conversationId,
            senderId: message.senderId,
            senderRole: message.senderRole as 'advisor' | 'user',
            senderName,
            content: message.content,
            messageType: message.messageType,
            timestamp: message.createdAt,
            attachmentUrl: message.attachmentUrl,
            isRead: message.isRead,
            readAt: undefined,
            isEdited: false,
            editedAt: undefined,
            replyToMessageId: undefined,
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === chatMessage.id)) return prev;
            return [...prev, chatMessage];
          });

          queryClient.invalidateQueries({ queryKey: advisorChatKeys.conversations() });
        },

        onUserOnline: () => {
          queryClient.invalidateQueries({ queryKey: advisorChatKeys.conversations() });
        },

        onUserOffline: () => {
          queryClient.invalidateQueries({ queryKey: advisorChatKeys.conversations() });
        },

        onUserTyping: (conversationId: string, userId: string, userName: string) => {
          setTypingUsers((prev) => {
            if (prev.some((u) => u.conversationId === conversationId && u.userId === userId)) {
              return prev;
            }
            return [...prev, { conversationId, userId, userName }];
          });
        },

        onUserStoppedTyping: (conversationId: string, userId: string) => {
          setTypingUsers((prev) =>
            prev.filter((u) => !(u.conversationId === conversationId && u.userId === userId))
          );
        },

        onMessagesRead: (conversationId: string) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.conversationId === conversationId && !m.isRead
                ? { ...m, isRead: true, readAt: new Date().toISOString() }
                : m
            )
          );
        },

        onConnectionStateChange: (state: SignalRConnectionState) => {
          setConnectionState(state);
        },
      });

      try {
        await service.start(token);
      } catch (error) {
        console.error('[useAdvisorChat] Failed to start SignalR:', error);
      }
    };

    void initSignalR();

    return () => {
      // Service is captured at the start of the effect
      void service.stop();
    };
  }, [queryClient]);

  // Update messages when data changes - enrich with sender names
  useEffect(() => {
    const enrichMessages = async () => {
      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        return;
      }

      const enriched = await Promise.all(
        messagesData.map(async (dto) => {
          let senderName = dto.senderName || 'User';
          
          // Only fetch if senderName is not already provided or is generic
          if (!dto.senderName || dto.senderName === 'User') {
            try {
              if (dto.senderRole === 'user') {
                const userResponse = await getUserDetail(dto.senderId);
                if (userResponse.success && userResponse.data) {
                  const user = userResponse.data;
                  senderName = user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`.trim()
                    : user.username || user.email || 'User';
                }
              } else if (dto.senderRole === 'advisor') {
                const advisorResponse = await getAdvisorDetailService(dto.senderId);
                if (advisorResponse.success && advisorResponse.data) {
                  const advisor = advisorResponse.data;
                  senderName = advisor.firstName && advisor.lastName 
                    ? `${advisor.firstName} ${advisor.lastName}`.trim()
                    : advisor.email || 'Advisor';
                }
              }
            } catch (error) {
              console.error(`Failed to fetch sender details for ${dto.senderId}:`, error);
            }
          }

          return {
            ...convertMessageDto(dto),
            senderName,
          };
        })
      );

      setMessages(enriched);
    };

    void enrichMessages();
  }, [messagesData]);

  // Select a conversation and join its room
  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      const service = signalRServiceRef.current;

      // Leave previous conversation
      if (selectedConversationId && selectedConversationId !== conversation.id) {
        await service.leaveConversation(selectedConversationId);
      }

      // Clear messages immediately when switching conversations
      setMessages([]);
      setSelectedConversationId(conversation.id);

      // Join new conversation
      try {
        await service.joinConversation(conversation.id);
        
        // Mark messages as read
        await markAsReadMutation.mutateAsync(conversation.id);
        await service.markAsRead(conversation.id);
      } catch (error) {
        console.error('[useAdvisorChat] Error selecting conversation:', error);
      }
    },
    [selectedConversationId, markAsReadMutation]
  );

  // Send a message
  const sendMessage = useCallback(
    async (content: string, messageType: string = 'text') => {
      if (!selectedConversation) {
        console.warn('[useAdvisorChat] No conversation selected');
        return;
      }

      if (!content.trim()) {
        return;
      }

      const service = signalRServiceRef.current;
      setSending(true);

      try {
        await service.sendMessage(selectedConversation.id, content, messageType);
        
        // Stop typing indicator after sending
        await service.stopTyping(selectedConversation.id);
      } catch (error) {
        console.error('[useAdvisorChat] Error sending message:', error);
      } finally {
        setSending(false);
      }
    },
    [selectedConversation]
  );

  // Send typing indicator
  const sendTyping = useCallback(() => {
    if (!selectedConversation) return;

    const service = signalRServiceRef.current;
    void service.typing(selectedConversation.id);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      void service.stopTyping(selectedConversation.id);
    }, 3000);
  }, [selectedConversation]);

  // Send stop typing indicator
  const sendStopTyping = useCallback(() => {
    if (!selectedConversation) return;

    const service = signalRServiceRef.current;
    void service.stopTyping(selectedConversation.id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [selectedConversation]);

  // Auto-select first conversation
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      void selectConversation(conversations[0]);
    }
  }, [conversations, selectedConversationId, selectConversation]);

  return {
    conversations,
    messages,
    selectedConversation,
    loadingConversations,
    loadingMessages,
    sending,
    connectionState,
    typingUsers,
    selectConversation,
    sendMessage,
    sendTyping,
    sendStopTyping,
  };
};

export default useAdvisorChat;


