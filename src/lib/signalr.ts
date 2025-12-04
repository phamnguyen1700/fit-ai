import * as signalR from '@microsoft/signalr';
import type { HubConnection } from '@microsoft/signalr';

export type SignalRConnectionState = 'Connected' | 'Disconnected' | 'Connecting' | 'Reconnecting';

export interface ReceivedMessage {
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

export interface SignalREventHandlers {
  onReceiveMessage?: (message: ReceivedMessage) => void;
  onUserOnline?: (userId: string, userRole: string) => void;
  onUserOffline?: (userId: string) => void;
  onUserTyping?: (conversationId: string, userId: string, userName: string) => void;
  onUserStoppedTyping?: (conversationId: string, userId: string) => void;
  onMessagesRead?: (conversationId: string, userId: string) => void;
  onConnectionStateChange?: (state: SignalRConnectionState) => void;
}

export class ChatSignalRService {
  private connection: HubConnection | null = null;
  private handlers: SignalREventHandlers = {};
  private hubUrl: string;

  constructor(hubUrl: string) {
    this.hubUrl = hubUrl;
  }

  /**
   * Initialize and start the SignalR connection
   */
  async start(accessToken: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('[ChatSignalR] Already connected');
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => accessToken,
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext: signalR.RetryContext) => {
          // Exponential backoff: 0, 2, 10, 30 seconds
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          }
          return null; // Stop reconnecting after 1 minute
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.registerEventHandlers();
    this.registerConnectionHandlers();

    try {
      await this.connection.start();
      console.log('[ChatSignalR] Connected successfully');
      this.handlers.onConnectionStateChange?.('Connected');
    } catch (error) {
      console.error('[ChatSignalR] Connection failed:', error);
      this.handlers.onConnectionStateChange?.('Disconnected');
      throw error;
    }
  }

  /**
   * Stop the SignalR connection
   */
  async stop(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('[ChatSignalR] Disconnected');
        this.handlers.onConnectionStateChange?.('Disconnected');
      } catch (error) {
        console.error('[ChatSignalR] Error stopping connection:', error);
      }
      this.connection = null;
    }
  }

  /**
   * Register event handlers
   */
  setEventHandlers(handlers: SignalREventHandlers): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  /**
   * Send a message to a conversation
   */
  async sendMessage(conversationId: string, content: string, messageType: string = 'text'): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR connection is not active');
    }

    try {
      await this.connection.invoke('SendMessage', conversationId, content, messageType);
      console.log('[ChatSignalR] Message sent');
    } catch (error) {
      console.error('[ChatSignalR] Error sending message:', error);
      throw error;
    }
  }

  /**
   * Join a conversation room
   */
  async joinConversation(conversationId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.warn('[ChatSignalR] Cannot join conversation, not connected');
      return;
    }

    try {
      await this.connection.invoke('JoinConversation', conversationId);
      console.log(`[ChatSignalR] Joined conversation: ${conversationId}`);
    } catch (error) {
      console.error('[ChatSignalR] Error joining conversation:', error);
      throw error;
    }
  }

  /**
   * Leave a conversation room
   */
  async leaveConversation(conversationId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await this.connection.invoke('LeaveConversation', conversationId);
      console.log(`[ChatSignalR] Left conversation: ${conversationId}`);
    } catch (error) {
      console.error('[ChatSignalR] Error leaving conversation:', error);
    }
  }

  /**
   * Send typing indicator
   */
  async typing(conversationId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await this.connection.invoke('Typing', conversationId);
    } catch (error) {
      console.error('[ChatSignalR] Error sending typing indicator:', error);
    }
  }

  /**
   * Send stop typing indicator
   */
  async stopTyping(conversationId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await this.connection.invoke('StopTyping', conversationId);
    } catch (error) {
      console.error('[ChatSignalR] Error sending stop typing indicator:', error);
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(conversationId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await this.connection.invoke('MarkAsRead', conversationId);
      console.log(`[ChatSignalR] Marked messages as read: ${conversationId}`);
    } catch (error) {
      console.error('[ChatSignalR] Error marking as read:', error);
    }
  }

  /**
   * Get connection state
   */
  getState(): SignalRConnectionState {
    if (!this.connection) return 'Disconnected';

    switch (this.connection.state) {
      case signalR.HubConnectionState.Connected:
        return 'Connected';
      case signalR.HubConnectionState.Connecting:
        return 'Connecting';
      case signalR.HubConnectionState.Reconnecting:
        return 'Reconnecting';
      default:
        return 'Disconnected';
    }
  }

  /**
   * Register SignalR event handlers from the hub
   */
  private registerEventHandlers(): void {
    if (!this.connection) return;

    // Receive message event
    this.connection.on('ReceiveMessage', (message: ReceivedMessage) => {
      console.log('[ChatSignalR] Message received:', message);
      this.handlers.onReceiveMessage?.(message);
    });

    // User online event
    this.connection.on('UserOnline', (userId: string, userRole: string) => {
      console.log(`[ChatSignalR] User online: ${userId} (${userRole})`);
      this.handlers.onUserOnline?.(userId, userRole);
    });

    // User offline event
    this.connection.on('UserOffline', (userId: string) => {
      console.log(`[ChatSignalR] User offline: ${userId}`);
      this.handlers.onUserOffline?.(userId);
    });

    // User typing event
    this.connection.on('UserTyping', (conversationId: string, userId: string, userName: string) => {
      console.log(`[ChatSignalR] User typing: ${userName} in ${conversationId}`);
      this.handlers.onUserTyping?.(conversationId, userId, userName);
    });

    // User stopped typing event
    this.connection.on('UserStoppedTyping', (conversationId: string, userId: string) => {
      console.log(`[ChatSignalR] User stopped typing: ${userId} in ${conversationId}`);
      this.handlers.onUserStoppedTyping?.(conversationId, userId);
    });

    // Messages read event
    this.connection.on('MessagesRead', (conversationId: string, userId: string) => {
      console.log(`[ChatSignalR] Messages read by ${userId} in ${conversationId}`);
      this.handlers.onMessagesRead?.(conversationId, userId);
    });
  }

  /**
   * Register connection state change handlers
   */
  private registerConnectionHandlers(): void {
    if (!this.connection) return;

    this.connection.onreconnecting(() => {
      console.log('[ChatSignalR] Reconnecting...');
      this.handlers.onConnectionStateChange?.('Reconnecting');
    });

    this.connection.onreconnected(() => {
      console.log('[ChatSignalR] Reconnected');
      this.handlers.onConnectionStateChange?.('Connected');
    });

    this.connection.onclose((error?: Error) => {
      console.log('[ChatSignalR] Connection closed', error);
      this.handlers.onConnectionStateChange?.('Disconnected');
    });
  }
}

// Singleton instance
let chatSignalRInstance: ChatSignalRService | null = null;

export const getChatSignalRService = (): ChatSignalRService => {
  const hubUrl = 'https://fitness.itcreation.xyz/chathub';
  
  if (!chatSignalRInstance) {
    chatSignalRInstance = new ChatSignalRService(hubUrl);
  }
  
  return chatSignalRInstance;
};
