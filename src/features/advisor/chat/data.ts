import { Conversation, ChatMessage } from './types';

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    customerName: 'Truong Anh Tu',
    customerEmail: 'tu.anh@example.com',
    avatarUrl: '/img/feature1.png',
    focusPlan: 'Giảm cân 6 tuần',
    lastMessage: 'Cảm ơn coach, em sẽ làm theo hướng dẫn',
    lastTimestamp: '2024-07-19T09:30:00Z',
    unreadCount: 2,
    status: 'online',
  },
  {
    id: 'conv-2',
    customerName: 'Hoang Van Nam',
    customerEmail: 'nam.hoang@example.com',
    avatarUrl: '/img/feature2.png',
    focusPlan: 'Tăng cơ 12 tuần',
    lastMessage: 'Dạ, em sẽ cập nhật kết quả đo cuối tuần này.',
    lastTimestamp: '2024-07-18T17:45:00Z',
    unreadCount: 0,
    status: 'busy',
  },
  {
    id: 'conv-3',
    customerName: 'Phan Thu Ha',
    customerEmail: 'ha.phan@example.com',
    avatarUrl: '/img/feature3.png',
    focusPlan: 'Dinh dưỡng cân bằng',
    lastMessage: 'Coach ơi, em thấy hơi mệt sau buổi tập hôm qua.',
    lastTimestamp: '2024-07-18T08:15:00Z',
    unreadCount: 5,
    status: 'offline',
  },
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    sender: 'customer',
    content: 'Coach ơi, em muốn xin thực đơn cho tuần tới.',
    timestamp: '2024-07-19T08:45:00Z',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    sender: 'advisor',
    content: 'Tuần này em tập trung vào protein nạc và rau xanh nhé.',
    timestamp: '2024-07-19T09:00:00Z',
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    sender: 'advisor',
    content: 'Nếu có thời gian, nhớ đi bộ nhẹ 30 phút mỗi tối.',
    timestamp: '2024-07-19T09:05:00Z',
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    sender: 'customer',
    content: 'Cảm ơn coach, em sẽ làm theo hướng dẫn.',
    timestamp: '2024-07-19T09:30:00Z',
  },
  {
    id: 'msg-5',
    conversationId: 'conv-2',
    sender: 'customer',
    content: 'Dạ, em sẽ cập nhật kết quả đo cuối tuần này.',
    timestamp: '2024-07-18T17:45:00Z',
  },
  {
    id: 'msg-6',
    conversationId: 'conv-3',
    sender: 'customer',
    content: 'Coach ơi, em thấy hơi mệt sau buổi tập hôm qua.',
    timestamp: '2024-07-18T08:15:00Z',
  },
];
