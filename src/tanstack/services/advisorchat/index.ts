import { get, post } from '@/shared/api/http';
import type {
  ConversationDto,
  CreateConversationDto,
  ChatMessageDto,
  GetMessagesParams,
  UnreadCountResponse,
} from '@/types/advisorchat';

const BASE_PATH = 'api/AdvisorChat';

/**
 * Get all conversations for the current advisor
 */
export const getConversationsService = () =>
  get<ConversationDto[]>(`${BASE_PATH}/conversations`);

/**
 * Get a specific conversation by ID
 */
export const getConversationByIdService = (conversationId: string) =>
  get<ConversationDto>(`${BASE_PATH}/conversations/${conversationId}`);

/**
 * Create a new conversation with a user
 */
export const createConversationService = (data: CreateConversationDto) =>
  post<ConversationDto>(`${BASE_PATH}/conversations`, data);

/**
 * Get messages for a specific conversation
 */
export const getConversationMessagesService = (
  conversationId: string,
  params?: GetMessagesParams
) =>
  get<ChatMessageDto[]>(`${BASE_PATH}/conversations/${conversationId}/messages`, { params });

/**
 * Mark messages as read in a conversation
 */
export const markMessagesAsReadService = (conversationId: string) =>
  post<{ success: boolean }>(`${BASE_PATH}/conversations/${conversationId}/read`);

/**
 * Get total unread message count for the current advisor
 */
export const getUnreadCountService = () =>
  get<UnreadCountResponse>(`${BASE_PATH}/unread-count`);

/**
 * Archive a conversation
 */
export const archiveConversationService = (conversationId: string) =>
  post<{ success: boolean }>(`${BASE_PATH}/conversations/${conversationId}/archive`);
