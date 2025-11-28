export type ParticipantType = 'advisor' | 'customer';

export interface ChatAttachment {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: ParticipantType;
  content: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  quickReaction?: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerEmail: string;
  avatarUrl?: string;
  focusPlan?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  status: 'online' | 'offline' | 'busy';
}
