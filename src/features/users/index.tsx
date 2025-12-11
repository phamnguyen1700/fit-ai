'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { UserTable } from './components/UserTable';
import { Card } from '@/shared/ui/core/Card';
import type { UserCardProps } from '@/shared/ui/common/UserCard';
import { useGetUsers } from '@/tanstack/hooks/users';
import { User } from '@/types/users';

// Helper function để convert API user data sang UserCardProps format
const convertApiUserToUserCard = (user: User, index: number): UserCardProps => {
  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.username || user.email.split('@')[0] || `User ${index + 1}`;

  return {
    id: user.id,
    name: displayName,
    email: user.email,
    datetime: new Date().toLocaleDateString('vi-VN') + ' – ' + new Date().toLocaleTimeString('vi-VN'),
    planLabel: '1 tháng Cơ bản', // Default plan - có thể customize sau
    amountLabel: 'đ300.000', // Default amount - có thể customize sau
    statusLabel: 'Thành công', // Default status - có thể customize sau
    isActive: user.isActive, // Map isActive từ API response
  };
};

export const UserPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Debounce search query để tránh gọi API quá nhiều
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Gọi useQuery để fetch real data với search
  const { data: usersResponse } = useGetUsers({ 
    page: 1, 
    pageSize: 20,
    search: debouncedSearch || undefined
  });

  // Map API data hoặc fallback sang fake data
  const users = useMemo(() => {
    const mappedUsers = usersResponse?.data?.items 
      ? usersResponse.data.items.map(convertApiUserToUserCard)
      : [];
    
    // Client-side filtering để đảm bảo chỉ hiển thị users phù hợp với search query
    if (debouncedSearch && debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase().trim();
      return mappedUsers.filter(user => {
        const nameMatch = user.name?.toLowerCase().includes(searchLower);
        const emailMatch = user.email?.toLowerCase().includes(searchLower);
        return nameMatch || emailMatch;
      });
    }
    
    return mappedUsers;
  }, [usersResponse, debouncedSearch]);

  // Console log dữ liệu từ API
  // useEffect(() => {
  //   console.log('Users API Response:', usersResponse);
  //   console.log('Converted Users:', users);
  // }, [usersResponse, users]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <Card title={<span className="text text-base sm:text-lg font-semibold">Thống kê nhanh</span>}
    >
      <UserTable users={users} onSearchChange={handleSearchChange} />
    </Card>
  );
};