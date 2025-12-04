export type ParticipantType = 'advisor' | 'user';

export interface ChatAttachment {
  type: 'image' | 'video' | 'file';
  url: string;
  name?: string;
  size?: number;
  thumbnailUrl?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: ParticipantType;
  senderName: string;
  content: string;
  messageType: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: number;
  isRead: boolean;
  readAt?: string;
  isEdited: boolean;
  editedAt?: string;
  replyToMessageId?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  advisorId: string;
  customerName: string;
  customerEmail?: string;
  avatarUrl?: string;
  focusPlan?: string;
  title: string;
  lastMessage?: string;
  lastTimestamp?: string;
  unreadCount: number;
  status: 'online' | 'offline' | 'busy';
  isOnline: boolean;
}

export interface TypingUser {
  conversationId: string;
  userId: string;
  userName: string;
}
