import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CreateConversationDto,
  GetMessagesParams,
} from '@/types/advisorchat';
import {
  getConversationsService,
  getConversationByIdService,
  createConversationService,
  getConversationMessagesService,
  markMessagesAsReadService,
  getUnreadCountService,
  archiveConversationService,
} from '@/tanstack/services/advisorchat';

// Query keys
export const advisorChatKeys = {
  all: ['advisorChat'] as const,
  conversations: () => [...advisorChatKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...advisorChatKeys.all, 'conversation', id] as const,
  messages: (conversationId: string) => [...advisorChatKeys.all, 'messages', conversationId] as const,
  unreadCount: () => [...advisorChatKeys.all, 'unreadCount'] as const,
};

/**
 * Hook to fetch all conversations
 */
export const useGetConversations = () => {
  return useQuery({
    queryKey: advisorChatKeys.conversations(),
    queryFn: async () => {
      const response = await getConversationsService();
      return response.data ?? [];
    },
  });
};

/**
 * Hook to fetch a specific conversation
 */
export const useGetConversation = (conversationId: string) => {
  return useQuery({
    queryKey: advisorChatKeys.conversation(conversationId),
    queryFn: async () => {
      const response = await getConversationByIdService(conversationId);
      return response.data;
    },
    enabled: !!conversationId,
  });
};

/**
 * Hook to fetch messages for a conversation
 */
export const useGetConversationMessages = (
  conversationId: string,
  params?: GetMessagesParams
) => {
  return useQuery({
    queryKey: [...advisorChatKeys.messages(conversationId), params],
    queryFn: async () => {
      const response = await getConversationMessagesService(conversationId, params);
      return response.data ?? [];
    },
    enabled: !!conversationId,
  });
};

/**
 * Hook to get unread count
 */
export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: advisorChatKeys.unreadCount(),
    queryFn: async () => {
      const response = await getUnreadCountService();
      return response.data?.count ?? 0;
    },
  });
};

/**
 * Hook to create a new conversation
 */
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateConversationDto) => {
      const response = await createConversationService(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: advisorChatKeys.conversations() });
    },
  });
};

/**
 * Hook to mark messages as read
 */
export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await markMessagesAsReadService(conversationId);
      return response.data;
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: advisorChatKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: advisorChatKeys.conversation(conversationId) });
      queryClient.invalidateQueries({ queryKey: advisorChatKeys.unreadCount() });
    },
  });
};

/**
 * Hook to archive a conversation
 */
export const useArchiveConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await archiveConversationService(conversationId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: advisorChatKeys.conversations() });
    },
  });
};
