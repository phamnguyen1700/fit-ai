'use client';

import React from 'react';
import { Icon, icons } from '@/shared/ui/icon';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: 'feedback' | 'message' | 'alert';
  clientName: string;
  message: string;
  time: string;
  isRead: boolean;
}

export default function NotificationBell() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'feedback',
      clientName: 'Nguyễn Văn A',
      message: 'đã tải lên ảnh tập luyện mới',
      time: '2 phút trước',
      isRead: false,
    },
    {
      id: '2',
      type: 'feedback',
      clientName: 'Trần Thị B',
      message: 'đã tải lên video squat',
      time: '15 phút trước',
      isRead: false,
    },
    {
      id: '3',
      type: 'message',
      clientName: 'Lê Văn C',
      message: 'đã gửi tin nhắn mới',
      time: '30 phút trước',
      isRead: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );

    // Navigate based on type
    if (notification.type === 'feedback') {
      router.push('/advisor/feedback');
    } else if (notification.type === 'message') {
      router.push('/advisor/chat');
    }

    setShowDropdown(false);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Icon name="mdi:bell-outline" size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          ></div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-20 max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="font-bold text-lg">Thông báo</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary hover:underline"
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Icon name="mdi:bell-off-outline" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Không có thông báo mới</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.type === 'feedback' ? 'bg-orange-100' : 'bg-blue-100'
                      }`}>
                        {notification.type === 'feedback' ? '📸' : '💬'}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold">{notification.clientName}</span>{' '}
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t bg-gray-50">
              <button
                onClick={() => {
                  router.push('/advisor/feedback');
                  setShowDropdown(false);
                }}
                className="w-full text-center text-sm text-primary hover:underline font-medium"
              >
                Xem tất cả thông báo
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
