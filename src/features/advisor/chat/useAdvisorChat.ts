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
  // Validate lastMessage: only set if both content and timestamp exist
  let lastMessage: string | undefined = undefined;
  let lastTimestamp: string | undefined = undefined;
  
  if (dto.lastMessageContent && dto.lastMessageContent.trim() !== '' && 
      dto.lastMessageAt && dto.lastMessageAt.trim() !== '') {
    lastMessage = dto.lastMessageContent;
    lastTimestamp = dto.lastMessageAt;
  }
  
  return {
    id: dto.id,
    userId: dto.userId,
    advisorId: dto.advisorId,
    customerName: userName || dto.title || 'User',
    customerEmail: userEmail,
    avatarUrl: undefined,
    focusPlan: undefined,
    title: dto.title,
    lastMessage,
    lastTimestamp,
    unreadCount: dto.unreadCount,
    status: dto.isOnline ? 'online' : 'offline',
    isOnline: dto.isOnline,
  };
};

const convertMessageDto = (dto: ChatMessageDto): ChatMessage => {
  // Parse planData if it exists and is a string
  let parsedPlanData: ChatMessage['planData'] = undefined;
  if (dto.planData) {
    try {
      if (typeof dto.planData === 'string') {
        parsedPlanData = JSON.parse(dto.planData);
      } else {
        parsedPlanData = dto.planData;
      }
    } catch (error) {
      console.error('[useAdvisorChat] Failed to parse planData:', error, dto.planData);
      parsedPlanData = undefined;
    }
  }

  return {
    id: dto.id,
    conversationId: dto.conversationId,
    senderId: dto.senderId,
    senderRole: dto.senderRole as 'advisor' | 'user',
    senderName: dto.senderName,
    content: dto.content,
    messageType: dto.messageType,
    timestamp: dto.createdAt,
    planData: parsedPlanData,
    planType: dto.planType ?? undefined,
    checkpointNumber: dto.checkpointNumber ?? undefined,
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
  
  // Helper function to get user name from cache or fetch
  const getUserName = useCallback(async (userId: string): Promise<{ name: string; email?: string }> => {
    try {
      // Check cache first
      const cached = queryClient.getQueryData<{ success: boolean; data?: { firstName?: string; lastName?: string; username?: string; email?: string } }>(['userDetail', userId]);
      if (cached?.success && cached.data) {
        const user = cached.data;
        return {
          name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`.trim()
            : user.username || user.email || 'User',
          email: user.email,
        };
      }

      // Fetch and cache using React Query
      const userResponse = await queryClient.fetchQuery({
        queryKey: ['userDetail', userId],
        queryFn: () => getUserDetail(userId),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      });

      if (userResponse.success && userResponse.data) {
        const user = userResponse.data;
        return {
          name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`.trim()
            : user.username || user.email || 'User',
          email: user.email,
        };
      }
    } catch (error) {
      console.error(`Failed to fetch user details for ${userId}:`, error);
    }
    return { name: 'User' };
  }, [queryClient]);

  // Helper function to get advisor name from cache or fetch
  const getAdvisorName = useCallback(async (advisorId: string): Promise<string> => {
    try {
      // Check cache first
      const cached = queryClient.getQueryData<{ success: boolean; data?: { firstName?: string; lastName?: string; email?: string } }>(['advisor-detail', advisorId]);
      if (cached?.success && cached.data) {
        const advisor = cached.data;
        return advisor.firstName && advisor.lastName 
          ? `${advisor.firstName} ${advisor.lastName}`.trim()
          : advisor.email || 'Advisor';
      }

      // Fetch and cache using React Query
      const advisorResponse = await queryClient.fetchQuery({
        queryKey: ['advisor-detail', advisorId],
        queryFn: () => getAdvisorDetailService(advisorId),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      });

      if (advisorResponse.success && advisorResponse.data) {
        const advisor = advisorResponse.data;
        return advisor.firstName && advisor.lastName 
          ? `${advisor.firstName} ${advisor.lastName}`.trim()
          : advisor.email || 'Advisor';
      }
    } catch (error) {
      console.error(`Failed to fetch advisor details for ${advisorId}:`, error);
    }
    return 'Advisor';
  }, [queryClient]);

  // Enrich conversations with user/advisor names - optimized with caching and batch fetching
  useEffect(() => {
    const enrichConversations = async () => {
      if (!conversationsData || conversationsData.length === 0) {
        setEnrichedConversations([]);
        return;
      }

      // Get unique user IDs to batch fetch
      const uniqueUserIds = Array.from(new Set(conversationsData.map(dto => dto.userId)));
      
      // Prefetch all user details in parallel (React Query will cache them)
      const userDetailsPromises = uniqueUserIds.map(userId =>
        queryClient.fetchQuery({
          queryKey: ['userDetail', userId],
          queryFn: () => getUserDetail(userId),
          staleTime: 5 * 60 * 1000,
        }).catch(() => null)
      );

      // Wait for all prefetches to complete
      await Promise.all(userDetailsPromises);

      // Now enrich conversations using cached data
      // Also verify lastMessage by checking if conversation actually has messages
      const enriched = await Promise.all(
        conversationsData.map(async (dto) => {
          const { name: userName, email: userEmail } = await getUserName(dto.userId);
          let conversation = convertConversationDto(dto, userName, userEmail);
          
          // Validate lastMessage: if lastMessageContent exists but lastMessageAt is missing, it's invalid
          if (dto.lastMessageContent && (!dto.lastMessageAt || dto.lastMessageAt.trim() === '')) {
            // Invalid: has content but no timestamp - clear it
            conversation = {
              ...conversation,
              lastMessage: undefined,
              lastTimestamp: undefined,
            };
          }
          
          // If lastMessageContent is empty or just whitespace, clear it
          if (!dto.lastMessageContent || dto.lastMessageContent.trim() === '') {
            conversation = {
              ...conversation,
              lastMessage: undefined,
              lastTimestamp: undefined,
            };
          }
          
          // If lastMessage exists, verify by checking cache first (don't fetch to avoid performance issues)
          // We'll verify when user actually selects the conversation
          if (conversation.lastMessage && conversation.lastMessage.trim() !== '') {
            try {
              // Only check cache - don't fetch to avoid performance issues
              const cachedMessages = queryClient.getQueryData<ChatMessageDto[]>(
                [...advisorChatKeys.messages(dto.id), { skip: 0, take: 1 }]
              );
              
              // If cached and empty, clear lastMessage
              if (cachedMessages && cachedMessages.length === 0) {
                console.log(`[useAdvisorChat] Conversation ${dto.id} has lastMessage but cached messages are empty, clearing it`);
                conversation = {
                  ...conversation,
                  lastMessage: undefined,
                  lastTimestamp: undefined,
                };
              }
              // If not cached, we'll verify when user selects this conversation (lazy verification)
            } catch (error) {
              console.warn(`[useAdvisorChat] Error checking cache for conversation ${dto.id}:`, error);
            }
          }
          
          return conversation;
        })
      );

      setEnrichedConversations(enriched);
    };

    void enrichConversations();
  }, [conversationsData, queryClient, getUserName]);

  const conversations = enrichedConversations;
  
  // Fetch messages for selected conversation - increased limit to load more messages
  const { data: messagesData, isLoading: loadingMessages, error: messagesError } = useGetConversationMessages(
    selectedConversationId ?? '',
    { skip: 0, take: 1000 } // Increased from 100 to 1000 to load more messages
  );

  // Log when messagesData changes
  useEffect(() => {
    if (selectedConversationId) {
      console.log(`[useAdvisorChat] Messages data changed for conversation ${selectedConversationId}:`, {
        hasData: !!messagesData,
        count: messagesData?.length ?? 0,
        isLoading: loadingMessages,
        hasError: !!messagesError
      });
      if (messagesError) {
        console.error(`[useAdvisorChat] Error loading messages for conversation ${selectedConversationId}:`, messagesError);
      }
    }
  }, [messagesData, selectedConversationId, loadingMessages, messagesError]);

  // Log all messages for selected conversation when they change
  useEffect(() => {
    if (selectedConversationId && messages.length > 0) {
      const conversationMessages = messages.filter(m => m.conversationId === selectedConversationId);
      if (conversationMessages.length > 0) {
        console.group(`📨 [useAdvisorChat] Tất cả tin nhắn cho conversation ${selectedConversationId} (${conversationMessages.length} tin nhắn)`);
        console.log('Conversation ID:', selectedConversationId);
        console.log('Tổng số tin nhắn:', conversationMessages.length);
        console.log('---');
        
        // Sort by timestamp
        const sortedMessages = [...conversationMessages].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        sortedMessages.forEach((msg, index) => {
          const time = new Date(msg.timestamp).toLocaleString('vi-VN');
          const logData: any = {
            id: msg.id,
            content: msg.content,
            timestamp: time,
            messageType: msg.messageType,
            isRead: msg.isRead,
            attachmentUrl: msg.attachmentUrl
          };
          
          // Add planData info if exists
          if (msg.planData) {
            logData.hasPlanData = true;
            logData.planType = msg.planType;
            if (typeof msg.planData === 'object') {
              if ('Name' in msg.planData) {
                logData.exerciseName = (msg.planData as any).Name;
              } else if ('MealType' in msg.planData) {
                logData.mealType = (msg.planData as any).MealType;
                logData.dayNumber = (msg.planData as any).DayNumber;
              }
            }
          }
          
          console.log(`[${index + 1}] ${msg.senderName} (${msg.senderRole}):`, logData);
        });
        
        console.log('---');
        console.log('📊 Tóm tắt:');
        console.log(`- Tổng số: ${sortedMessages.length}`);
        console.log(`- Từ user: ${sortedMessages.filter(m => m.senderRole === 'user').length}`);
        console.log(`- Từ advisor: ${sortedMessages.filter(m => m.senderRole === 'advisor').length}`);
        console.log(`- Đã đọc: ${sortedMessages.filter(m => m.isRead).length}`);
        console.log(`- Chưa đọc: ${sortedMessages.filter(m => !m.isRead).length}`);
        console.log(`- Có attachment: ${sortedMessages.filter(m => m.attachmentUrl).length}`);
        console.groupEnd();
      }
    }
  }, [messages, selectedConversationId]);

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
          // Fetch sender name using cached queries
          let senderName = 'User';
          try {
            if (message.senderRole === 'user') {
              const { name } = await getUserName(message.senderId);
              senderName = name;
            } else if (message.senderRole === 'advisor') {
              senderName = await getAdvisorName(message.senderId);
            }
          } catch (error) {
            console.error('Failed to fetch sender details:', error);
          }

          // Parse planData if it exists
          let parsedPlanData: ChatMessage['planData'] = undefined;
          if (message.planData) {
            try {
              if (typeof message.planData === 'string') {
                parsedPlanData = JSON.parse(message.planData);
              } else {
                parsedPlanData = message.planData;
              }
            } catch (error) {
              console.error('[useAdvisorChat] Failed to parse planData from SignalR:', error, message.planData);
              parsedPlanData = undefined;
            }
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
            planData: parsedPlanData,
            planType: message.planType ?? undefined,
            checkpointNumber: message.checkpointNumber ?? undefined,
            attachmentUrl: message.attachmentUrl,
            isRead: message.isRead,
            readAt: undefined,
            isEdited: false,
            editedAt: undefined,
            replyToMessageId: undefined,
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === chatMessage.id)) return prev;
            const updated = [...prev, chatMessage];
            
            // Update conversation's lastMessage when new message arrives
            setEnrichedConversations((prevConvs) =>
              prevConvs.map((conv) =>
                conv.id === chatMessage.conversationId
                  ? {
                      ...conv,
                      lastMessage: chatMessage.content,
                      lastTimestamp: chatMessage.timestamp,
                    }
                  : conv
              )
            );
            
            return updated;
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
  }, [queryClient, getUserName, getAdvisorName]);

  // Update messages when data changes - enrich with sender names - optimized with caching
  useEffect(() => {
    const enrichMessages = async () => {
      // Only process if we have a selected conversation
      if (!selectedConversationId) {
        console.log('[useAdvisorChat] No selected conversation ID, clearing messages');
        setMessages([]);
        return;
      }

      if (!messagesData || messagesData.length === 0) {
        console.log(`[useAdvisorChat] No messages data for conversation ${selectedConversationId}`);
        // Don't clear messages if we're still loading - might be a race condition
        if (!loadingMessages) {
          setMessages([]);
          
          // Update conversation to clear lastMessage since there are no actual messages
          setEnrichedConversations((prev) => {
            const updated = prev.map((conv) =>
              conv.id === selectedConversationId
                ? { ...conv, lastMessage: undefined, lastTimestamp: undefined }
                : conv
            );
            console.log(`[useAdvisorChat] Updated conversation ${selectedConversationId} to clear lastMessage`);
            return updated;
          });
        }
        return;
      }

      // Log all message conversationIds for debugging
      const conversationIds = Array.from(new Set(messagesData.map(dto => dto.conversationId)));
      console.log(`[useAdvisorChat] Messages from API: ${messagesData.length} total, conversation IDs:`, conversationIds);

      // Filter messages to only include those for the current conversation (safety check)
      // Note: API should only return messages for the requested conversation, but we filter anyway for safety
      const conversationMessages = messagesData.filter(dto => {
        const matches = dto.conversationId === selectedConversationId;
        if (!matches) {
          console.warn(`[useAdvisorChat] Message ${dto.id} has conversationId ${dto.conversationId} but expected ${selectedConversationId}`);
        }
        return matches;
      });
      
      console.log(`[useAdvisorChat] Processing ${conversationMessages.length} messages for conversation ${selectedConversationId} (total from API: ${messagesData.length})`);
      
      if (conversationMessages.length === 0) {
        console.warn(`[useAdvisorChat] No messages found for conversation ${selectedConversationId} after filtering. Available conversation IDs:`, conversationIds);
        console.warn(`[useAdvisorChat] Selected conversation ID: ${selectedConversationId}, Loading: ${loadingMessages}`);
        
        // Only clear if we're sure there are no messages (not loading and not empty array from API)
        if (!loadingMessages && messagesData.length === 0) {
          console.log(`[useAdvisorChat] Confirmed no messages for conversation ${selectedConversationId}, clearing state and updating conversation`);
          setMessages([]);
          
          // Update conversation to clear lastMessage since there are no actual messages
          setEnrichedConversations((prev) =>
            prev.map((conv) =>
              conv.id === selectedConversationId
                ? { ...conv, lastMessage: undefined, lastTimestamp: undefined }
                : conv
            )
          );
        } else if (!loadingMessages && messagesData.length > 0) {
          // API returned messages but none match - this is a problem
          console.error(`[useAdvisorChat] API returned ${messagesData.length} messages but none match conversation ${selectedConversationId}`);
        }
        return;
      }

      try {
        // Get unique sender IDs that need fetching (only if senderName is missing or generic)
        const needsFetching = conversationMessages.filter(dto => !dto.senderName || dto.senderName === 'User');
        const uniqueUserIds = Array.from(new Set(
          needsFetching.filter(dto => dto.senderRole === 'user').map(dto => dto.senderId)
        ));
        const uniqueAdvisorIds = Array.from(new Set(
          needsFetching.filter(dto => dto.senderRole === 'advisor').map(dto => dto.senderId)
        ));

        // Prefetch all user and advisor details in parallel
        const userDetailsPromises = uniqueUserIds.map(userId =>
          queryClient.fetchQuery({
            queryKey: ['userDetail', userId],
            queryFn: () => getUserDetail(userId),
            staleTime: 5 * 60 * 1000,
          }).catch(() => null)
        );

        const advisorDetailsPromises = uniqueAdvisorIds.map(advisorId =>
          queryClient.fetchQuery({
            queryKey: ['advisor-detail', advisorId],
            queryFn: () => getAdvisorDetailService(advisorId),
            staleTime: 5 * 60 * 1000,
          }).catch(() => null)
        );

        // Wait for all prefetches to complete
        await Promise.all([...userDetailsPromises, ...advisorDetailsPromises]);

        // Now enrich messages using cached data - with error handling for each message
        const enriched = await Promise.allSettled(
          conversationMessages.map(async (dto) => {
            let senderName = dto.senderName || 'User';
            
            // Only fetch if senderName is not already provided or is generic
            if (!dto.senderName || dto.senderName === 'User') {
              try {
                if (dto.senderRole === 'user') {
                  const { name } = await getUserName(dto.senderId);
                  senderName = name;
                } else if (dto.senderRole === 'advisor') {
                  senderName = await getAdvisorName(dto.senderId);
                }
              } catch (error) {
                console.error(`Failed to fetch sender details for ${dto.senderId}:`, error);
                // Keep the default senderName if fetch fails
              }
            }

            return {
              ...convertMessageDto(dto),
              senderName,
            };
          })
        );

        // Extract successful results, fallback to original DTO if enrichment failed
        const finalMessages = enriched.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            // If enrichment failed, use the original DTO with default senderName
            console.error(`Failed to enrich message ${conversationMessages[index]?.id}:`, result.reason);
            return {
              ...convertMessageDto(conversationMessages[index]),
              senderName: conversationMessages[index].senderName || 'User',
            };
          }
        });

        // Update messages - always set for current conversation, merge with SignalR updates
        setMessages((prev) => {
          // Double-check: only update if this is still the selected conversation
          // This prevents race conditions when switching conversations quickly
          const currentSelectedId = selectedConversationId;
          if (!currentSelectedId) {
            console.warn('[useAdvisorChat] No selected conversation ID when trying to set messages');
            return prev;
          }
          
          // Filter out messages from other conversations first
          const currentConversationMessages = prev.filter(m => m.conversationId === currentSelectedId);
          
          // Create a map to merge messages
          const messageMap = new Map<string, ChatMessage>();
          
          // First, add all enriched messages from API (these are the source of truth)
          finalMessages.forEach(msg => {
            // Double-check conversationId matches
            if (msg.conversationId === currentSelectedId) {
              messageMap.set(msg.id, msg);
            } else {
              console.warn(`[useAdvisorChat] Skipping message ${msg.id} with conversationId ${msg.conversationId}, expected ${currentSelectedId}`);
            }
          });
          
          // Then, merge with any SignalR messages that might have arrived (real-time updates)
          currentConversationMessages.forEach(msg => {
            const existing = messageMap.get(msg.id);
            if (!existing) {
              // Add new SignalR message that's not in API response yet
              messageMap.set(msg.id, msg);
            } else {
              // If message exists, keep the one with newer timestamp
              const existingTime = new Date(existing.timestamp).getTime();
              const signalRTime = new Date(msg.timestamp).getTime();
              if (signalRTime > existingTime) {
                messageMap.set(msg.id, msg);
              }
            }
          });
          
          const mergedMessages = Array.from(messageMap.values());
          
          // Log for debugging
          console.log(`[useAdvisorChat] Setting ${mergedMessages.length} messages for conversation ${currentSelectedId}`, {
            fromAPI: finalMessages.length,
            fromSignalR: currentConversationMessages.length,
            merged: mergedMessages.length,
            conversationId: currentSelectedId
          });
          
          // Final safety check: ensure all messages belong to the current conversation
          const invalidMessages = mergedMessages.filter(m => m.conversationId !== currentSelectedId);
          if (invalidMessages.length > 0) {
            console.error(`[useAdvisorChat] Found ${invalidMessages.length} messages with wrong conversationId!`, invalidMessages);
            return mergedMessages.filter(m => m.conversationId === currentSelectedId);
          }
          
          // Update conversation's lastMessage if we have messages
          if (mergedMessages.length > 0) {
            // Sort by timestamp to get the latest message
            const sortedMessages = [...mergedMessages].sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            const latestMessage = sortedMessages[0];
            
            // Update conversation with latest message
            setEnrichedConversations((prev) =>
              prev.map((conv) =>
                conv.id === currentSelectedId
                  ? {
                      ...conv,
                      lastMessage: latestMessage.content,
                      lastTimestamp: latestMessage.timestamp,
                    }
                  : conv
              )
            );
          }
          
          return mergedMessages;
        });
      } catch (error) {
        console.error('[useAdvisorChat] Error enriching messages:', error);
        // Fallback: set messages without enrichment if enrichment completely fails
        const fallbackMessages = conversationMessages.map(dto => ({
          ...convertMessageDto(dto),
          senderName: dto.senderName || 'User',
        }));
        setMessages(fallbackMessages);
        
        // Update conversation's lastMessage even in fallback case
        if (fallbackMessages.length > 0) {
          const sortedMessages = [...fallbackMessages].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          const latestMessage = sortedMessages[0];
          
          setEnrichedConversations((prev) =>
            prev.map((conv) =>
              conv.id === selectedConversationId
                ? {
                    ...conv,
                    lastMessage: latestMessage.content,
                    lastTimestamp: latestMessage.timestamp,
                  }
                : conv
            )
          );
        }
      }
    };

    void enrichMessages();
  }, [messagesData, selectedConversationId, queryClient, getUserName, getAdvisorName]);

  // Auto-update conversations: update lastMessage when messages are loaded, or clear if no messages
  useEffect(() => {
    if (!selectedConversationId || loadingMessages) return;
    
    const conversationMessages = messages.filter(m => m.conversationId === selectedConversationId);
    const conversation = enrichedConversations.find(c => c.id === selectedConversationId);
    
    if (!conversation) return;
    
    if (conversationMessages.length > 0) {
      // Has messages - update lastMessage with the latest one
      const sortedMessages = [...conversationMessages].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      const latestMessage = sortedMessages[0];
      
      // Only update if different to avoid unnecessary re-renders
      if (conversation.lastMessage !== latestMessage.content || 
          conversation.lastTimestamp !== latestMessage.timestamp) {
        console.log(`[useAdvisorChat] Auto-updating conversation ${selectedConversationId}: updating lastMessage from messages`);
        setEnrichedConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversationId
              ? {
                  ...conv,
                  lastMessage: latestMessage.content,
                  lastTimestamp: latestMessage.timestamp,
                }
              : conv
          )
        );
      }
    } else if (messages.length === 0 && conversation.lastMessage) {
      // No messages at all and conversation has lastMessage - clear it
      console.log(`[useAdvisorChat] Auto-updating conversation ${selectedConversationId}: clearing lastMessage (no actual messages)`);
      setEnrichedConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversationId
            ? { ...conv, lastMessage: undefined, lastTimestamp: undefined }
            : conv
        )
      );
    }
  }, [messages, selectedConversationId, loadingMessages, enrichedConversations]);

  // Select a conversation and join its room
  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      const service = signalRServiceRef.current;

      console.log(`[useAdvisorChat] Selecting conversation ${conversation.id} (previous: ${selectedConversationId})`);

      // If switching to a different conversation, clear messages first
      if (selectedConversationId && selectedConversationId !== conversation.id) {
        await service.leaveConversation(selectedConversationId);
        console.log(`[useAdvisorChat] Clearing messages for previous conversation ${selectedConversationId}`);
        setMessages([]);
        
        // Invalidate and refetch messages for the new conversation
        queryClient.invalidateQueries({ 
          queryKey: advisorChatKeys.messages(conversation.id) 
        });
      }

      // Update selected conversation ID (this will trigger message fetch via useGetConversationMessages)
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


