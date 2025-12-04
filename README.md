# Fit AI - Next.js Project

## Cấu trúc Project

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Route group cho admin
│   │   ├── admin/         # Admin routes
│   │   │   ├── dashboard/ # /admin/dashboard
│   │   │   ├── plans/     # /admin/plans
│   │   │   ├── users/     # /admin/users
│   │   │   └── settings/  # /admin/settings
│   │   └── layout.tsx     # Admin layout
│   ├── (marketing)/       # Route group cho marketing
│   │   ├── home/          # /home
│   │   ├── features/      # /features
│   │   ├── pricing/       # /pricing
│   │   ├── download/      # /download
│   │   ├── feedback/      # /feedback
│   │   └── layout.tsx     # Marketing layout
│   └── page.tsx           # Root page (redirect to /home)
├── features/              # Feature-based architecture
│   ├── plans/             # Plans feature
│   │   ├── components/    # UI components
│   │   └── index.tsx      # Page component
│   ├── users/             # Users feature
│   │   ├── components/    # UI components
│   │   └── index.tsx      # Page component
│   ├── home/              # Home feature
│   │   ├── components/    # UI components
│   │   └── index.tsx      # Page component
│   └── feedback/          # Feedback feature
│       ├── components/    # UI components
│       └── index.tsx      # Page component
├── tanstack/              # TanStack Query (React Query)
│   ├── services/          # API Services
│   │   ├── plans/         # Plan service
│   │   ├── users/         # User service
│   │   ├── home/          # Home service
│   │   └── feedback/      # Feedback service
│   ├── hooks/             # React Query Hooks
│   │   ├── plans/         # Plan hooks + query keys
│   │   ├── users/         # User hooks + query keys
│   │   ├── home/          # Home hooks + query keys
│   │   └── feedback/      # Feedback hooks + query keys
│   └── index.ts           # Export tất cả
├── stores/                # Zustand stores
│   ├── app.store.ts       # Main app store
│   ├── modal.store.ts     # Modal state
│   ├── filter.store.ts    # Filter state
│   ├── plans.ts           # Plans store
│   ├── users.ts           # Users store
│   ├── home.ts            # Home store
│   ├── feedback.ts        # Feedback store
│   └── index.ts           # Export tất cả
├── shared/                # Shared utilities
│   ├── api/               # HTTP client
│   ├── ui/                # UI components
│   └── lib/                # Utility functions
└── lib/                   # Library configurations
    └── queryClient.ts     # TanStack Query client
```

## Tính năng

- ✅ **Next.js 15** với App Router
- ✅ **Route Groups** cho admin và marketing
- ✅ **Feature-based Architecture** 
- ✅ **TanStack Query** cho data fetching
- ✅ **Zustand** cho state management
- ✅ **TypeScript** cho type safety
- ✅ **Tailwind CSS** cho styling
- ✅ **Responsive Design**

## Cách sử dụng

### Chạy development
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Chạy production
```bash
npm start
```

## Cấu trúc trang

Tất cả các trang hiện tại chỉ hiển thị tên trang đơn giản để bạn có thể tự phát triển nội dung:

- **Admin**: Dashboard, Plans, Users, Settings
- **Marketing**: Home, Features, Pricing, Download, Feedback

## Lưu ý

- Tất cả component phức tạp đã được xóa, chỉ giữ lại khung sườn
- TanStack Query hooks đã được setup sẵn trong `src/tanstack/`
- Zustand stores đã được setup sẵn trong `src/stores/`
- Types đã được định nghĩa trong `src/features/*/types/`

## Luồng Fetch API Chat (Advisor Chat)

Hệ thống chat sử dụng kết hợp **TanStack Query (React Query)** cho REST API và **SignalR** cho real-time messaging.

### Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                    AdvisorChat Component                     │
│              (src/features/advisor/chat/index.tsx)          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  useAdvisorChat Hook                        │
│          (src/features/advisor/chat/useAdvisorChat.ts)       │
│                                                              │
│  ┌────────────────────┐      ┌──────────────────────┐       │
│  │  TanStack Query   │      │   SignalR Service    │       │
│  │  (REST API)       │      │   (Real-time)        │       │
│  └────────────────────┘      └──────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌────────────────────┐      ┌──────────────────────┐
│  React Query Hooks │      │  SignalR Hub         │
│  (tanstack/hooks/  │      │  (lib/signalr.ts)     │
│   advisorchat/)    │      │                      │
└────────────────────┘      └──────────────────────┘
         │
         ▼
┌────────────────────┐
│  API Services      │
│  (tanstack/        │
│   services/        │
│   advisorchat/)    │
└────────────────────┘
```

### 1. Khởi tạo và Fetch Conversations

**Luồng:**
1. Component `AdvisorChat` gọi hook `useAdvisorChat()`
2. Hook sử dụng `useGetConversations()` (TanStack Query) để fetch danh sách conversations
3. API call: `GET /fitness/api/AdvisorChat/conversations`
4. Sau khi có data, hook tự động enrich conversations bằng cách:
   - Fetch thông tin user details cho mỗi conversation
   - Convert DTO từ backend sang UI model
   - Set vào state `enrichedConversations`

**Code:**
```typescript
// useAdvisorChat.ts
const { data: conversationsData, isLoading: loadingConversations } = useGetConversations();

useEffect(() => {
  // Enrich với user names
  const enriched = await Promise.all(
    conversationsData.map(async (dto) => {
      const userResponse = await getUserDetail(dto.userId);
      return convertConversationDto(dto, userName, userEmail);
    })
  );
  setEnrichedConversations(enriched);
}, [conversationsData]);
```

### 2. Khởi tạo SignalR Connection

**Luồng:**
1. Khi component mount, `useAdvisorChat` tự động khởi tạo SignalR connection
2. Lấy auth token từ `localStorage.getItem('authToken')`
3. Tạo connection đến SignalR Hub: `https://fitness.itcreation.xyz/chathub`
4. Đăng ký các event handlers:
   - `ReceiveMessage`: Nhận tin nhắn mới
   - `UserOnline/UserOffline`: Cập nhật trạng thái user
   - `UserTyping/UserStoppedTyping`: Typing indicators
   - `MessagesRead`: Cập nhật trạng thái đã đọc

**Code:**
```typescript
// useAdvisorChat.ts
useEffect(() => {
  const service = signalRServiceRef.current;
  const token = localStorage.getItem('authToken') ?? '';
  
  service.setEventHandlers({
    onReceiveMessage: async (message) => {
      // Thêm message vào local state
      setMessages((prev) => [...prev, chatMessage]);
      // Invalidate conversations để cập nhật unread count
      queryClient.invalidateQueries({ queryKey: advisorChatKeys.conversations() });
    },
    // ... other handlers
  });
  
  await service.start(token);
}, []);
```

### 3. Chọn Conversation và Fetch Messages

**Luồng:**
1. User click vào một conversation trong `ConversationList`
2. Gọi `selectConversation(conversation)`
3. Hook thực hiện:
   - Leave conversation cũ (nếu có): `service.leaveConversation(oldId)`
   - Clear messages hiện tại
   - Set conversation mới làm selected
   - Join conversation room qua SignalR: `service.joinConversation(newId)`
   - Fetch messages qua REST API: `useGetConversationMessages(conversationId)`
   - Mark messages as read: `markAsReadMutation.mutateAsync(conversationId)`

**Code:**
```typescript
// useAdvisorChat.ts
const selectConversation = async (conversation: Conversation) => {
  // Leave previous
  if (selectedConversationId) {
    await service.leaveConversation(selectedConversationId);
  }
  
  setMessages([]);
  setSelectedConversationId(conversation.id);
  
  // Join new conversation room
  await service.joinConversation(conversation.id);
  
  // Mark as read
  await markAsReadMutation.mutateAsync(conversation.id);
  await service.markAsRead(conversation.id);
};

// TanStack Query tự động fetch messages khi conversationId thay đổi
const { data: messagesData } = useGetConversationMessages(
  selectedConversationId ?? '',
  { skip: 0, take: 100 }
);
```

### 4. Gửi Tin Nhắn

**Luồng:**
1. User nhập tin nhắn và click "Gửi" hoặc nhấn Enter
2. `ChatComposer` gọi `onSend(message)`
3. Hook `sendMessage()` thực hiện:
   - Validate message không rỗng
   - Gửi qua SignalR: `service.sendMessage(conversationId, content, messageType)`
   - Tự động stop typing indicator
   - SignalR hub broadcast message đến tất cả clients trong conversation room
   - Event `ReceiveMessage` được trigger, message được thêm vào local state

**Code:**
```typescript
// useAdvisorChat.ts
const sendMessage = async (content: string, messageType: string = 'text') => {
  const service = signalRServiceRef.current;
  await service.sendMessage(selectedConversation.id, content, messageType);
  await service.stopTyping(selectedConversation.id);
};

// SignalR hub sẽ broadcast message
// onReceiveMessage handler sẽ nhận và cập nhật UI
```

### 5. Real-time Updates qua SignalR

**Các events được xử lý:**

| Event | Mô tả | Hành động |
|-------|-------|-----------|
| `ReceiveMessage` | Nhận tin nhắn mới | Thêm vào `messages` state, invalidate conversations |
| `UserOnline` | User online | Invalidate conversations để cập nhật status |
| `UserOffline` | User offline | Invalidate conversations để cập nhật status |
| `UserTyping` | User đang gõ | Thêm vào `typingUsers` state |
| `UserStoppedTyping` | User dừng gõ | Xóa khỏi `typingUsers` state |
| `MessagesRead` | Tin nhắn đã được đọc | Cập nhật `isRead` trong messages |

### 6. Typing Indicators

**Luồng:**
1. User bắt đầu gõ trong `ChatComposer`
2. `onTyping()` được gọi → `sendTyping()`
3. Gửi typing indicator qua SignalR: `service.typing(conversationId)`
4. Tự động stop sau 3 giây nếu không có input mới
5. Khi user gửi message, tự động stop typing

**Code:**
```typescript
// useAdvisorChat.ts
const sendTyping = () => {
  service.typing(selectedConversation.id);
  
  // Auto-stop sau 3 giây
  typingTimeoutRef.current = setTimeout(() => {
    service.stopTyping(selectedConversation.id);
  }, 3000);
};
```

### 7. Enrichment với User/Advisor Details

**Luồng:**
- Khi fetch conversations hoặc messages, backend có thể chỉ trả về `userId`/`senderId`
- Hook tự động fetch thông tin chi tiết để hiển thị tên đầy đủ:
  - Với user: `getUserDetail(userId)` → lấy `firstName`, `lastName`
  - Với advisor: `getAdvisorDetailService(advisorId)` → lấy `firstName`, `lastName`

### API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/fitness/api/AdvisorChat/conversations` | Lấy danh sách conversations |
| `GET` | `/fitness/api/AdvisorChat/conversations/{id}` | Lấy chi tiết conversation |
| `GET` | `/fitness/api/AdvisorChat/conversations/{id}/messages` | Lấy messages của conversation |
| `POST` | `/fitness/api/AdvisorChat/conversations/{id}/read` | Đánh dấu đã đọc |
| `GET` | `/fitness/api/AdvisorChat/unread-count` | Lấy số tin nhắn chưa đọc |

### SignalR Hub Methods

| Method | Mô tả |
|--------|-------|
| `SendMessage(conversationId, content, messageType)` | Gửi tin nhắn |
| `JoinConversation(conversationId)` | Tham gia conversation room |
| `LeaveConversation(conversationId)` | Rời conversation room |
| `Typing(conversationId)` | Gửi typing indicator |
| `StopTyping(conversationId)` | Dừng typing indicator |
| `MarkAsRead(conversationId)` | Đánh dấu đã đọc |

### File Structure

```
src/features/advisor/chat/
├── index.tsx                    # Main component
├── useAdvisorChat.ts            # Custom hook (orchestrates API + SignalR)
├── types.ts                     # TypeScript types
└── components/
    ├── ConversationList.tsx     # Danh sách conversations
    ├── MessageList.tsx          # Danh sách messages
    ├── MessageBubble.tsx       # Component hiển thị 1 message
    ├── ChatComposer.tsx         # Input để gửi message
    └── ChatHeader.tsx           # Header của conversation

src/tanstack/
├── hooks/advisorchat/
│   └── index.ts                 # React Query hooks
└── services/advisorchat/
    └── index.ts                 # API service functions

src/lib/
└── signalr.ts                   # SignalR service class
```

### Best Practices

1. **Caching**: TanStack Query tự động cache conversations và messages
2. **Optimistic Updates**: Messages được thêm vào local state ngay khi gửi qua SignalR
3. **Auto-refetch**: Khi SignalR nhận event, tự động invalidate queries để sync với server
4. **Error Handling**: Tất cả API calls và SignalR operations đều có try-catch
5. **Connection Management**: SignalR tự động reconnect với exponential backoff
6. **Memory Management**: Cleanup SignalR connection khi component unmount