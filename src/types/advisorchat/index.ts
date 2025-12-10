// DTOs matching the backend AdvisorChat types

export interface CreateConversationDto {
    advisorId: string;
    title?: string;
    initialMessage?: string;
  }
  
  export interface ConversationDto {
    id: string;
    userId: string;
    advisorId: string;
    title: string;
    lastMessageContent?: string;
    lastMessageAt?: string;
    isOnline: boolean;
    unreadCount: number;
    createdAt: string;
  }
  
  export interface ChatMessageDto {
    id: string;
    conversationId: string;
    senderId: string;
    senderRole: string;
    senderName: string;
    content: string;
    messageType: string;
    planData?: string | null; // Stringified JSON from API
    planType?: number | null;
    checkpointNumber?: number | null;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentSize?: number;
    isRead: boolean;
    readAt?: string;
    isEdited: boolean;
    editedAt?: string;
    createdAt: string;
    replyToMessageId?: string;
  }
  
  export interface GetMessagesParams {
    skip?: number;
    take?: number;
  }
  
  export interface UnreadCountResponse {
    count: number;
  }
  
  // SignalR event types
  export interface SignalRMessageReceived {
    id: string;
    conversationId: string;
    senderId: string;
    senderRole: string;
    content: string;
    messageType: string;
    attachmentUrl?: string;
    createdAt: string;
    isRead: boolean;
  }
  
  export interface SignalRUserTyping {
    conversationId: string;
    userId: string;
    userName: string;
  }
  
  export interface SignalRUserStatus {
    userId: string;
    userRole?: string;
  }
  