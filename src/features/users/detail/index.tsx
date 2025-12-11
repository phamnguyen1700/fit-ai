'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Breadcrumb, Avatar, Button, Badge, Flex } from '@/shared/ui';
import { Tag } from 'antd';
import { Icon } from '@/shared/ui/icon';
import { useUserDetail } from '@/tanstack/hooks/users';

interface UserDetailPageProps {
    userId: string; // Make it required to avoid empty string issues
}

export const UserDetailPage: React.FC<UserDetailPageProps> = ({ userId }) => {
    const router = useRouter();

    // Fetch user details - hook is now always called with valid userId
    const { data: userDetailResponse, isLoading, error } = useUserDetail(userId);
    
    // Memoize breadcrumb items to avoid recreation
    const breadcrumbItems = useMemo(() => [
        { title: 'Trang chủ', href: '/admin/dashboard' },
        { title: 'Quản lý người dùng', href: '/admin/users' },
        { title: 'Thông tin người dùng' }
    ], []);


    // Transform API data to display format - memoized to avoid recalculation
    const userData = useMemo(() => {
        if (!userDetailResponse?.data) return null;
        
        const apiUserData = userDetailResponse.data;
        
        return {
            id: apiUserData.id,
            name: apiUserData.firstName && apiUserData.lastName 
                ? `${apiUserData.firstName} ${apiUserData.lastName}` 
                : apiUserData.username || 'N/A',
            email: apiUserData.email,
            avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c',
            // plan: 'Free Trial',
            birthDate: apiUserData.dateOfBirth ? new Date(apiUserData.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A',
            gender: apiUserData.gender === 'M' ? 'Nam' : apiUserData.gender === 'F' ? 'Nữ' : 'Khác',
            height: apiUserData.height ? `${apiUserData.height}cm` : 'N/A',
            weight: apiUserData.weight ? `${apiUserData.weight}kg` : 'N/A',
            goal: apiUserData.goal ? apiUserData.goal.replace(/_/g, ' ') : 'Chưa có mục tiêu',
            isActive: apiUserData.isActive,
            diet: {
                likes: 'Chưa cập nhật',
                avoids: 'Chưa cập nhật',
                mealsPerDay: 3
            },
            bodyFat: 0,
            mealPlan: {
                morning: { food: 'Chưa có kế hoạch', calories: '0/500 kcal' },
                noon: { food: 'Chưa có kế hoạch', calories: '0/500 kcal' },
                snack: { food: 'Chưa có kế hoạch', calories: '0/500 kcal' }
            }
        };
    }, [userDetailResponse]);

    const handleEdit = useCallback(() => {
        if (userData?.id) {
            console.log('Edit user:', userData.id);
        }
    }, [userData?.id]);
    
    // Handle loading state
    if (isLoading) {
        return (
            <Card>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p>Đang tải thông tin người dùng...</p>
                    </div>
                </div>
            </Card>
        );
    }
    
    // Handle error state
    if (error || !userDetailResponse?.success || !userData) {
        return (
            <Card>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Icon name="mdi:alert-circle" className="text-red-500 text-4xl mb-2" />
                        <p className="text-red-500">Không thể tải thông tin người dùng</p>
                        <Button onClick={() => router.back()} className="mt-2">
                            Quay lại
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)', marginBottom: '4px' }}>
                        Chi tiết người dùng
                    </h1>
                    <Breadcrumb items={breadcrumbItems} />
                </div>
                <Button 
                    variant="solid" 
                    size="md" 
                    onClick={handleEdit}
                    style={{
                        backgroundColor: 'var(--primary)',
                        borderColor: 'var(--primary)',
                        color: 'white',
                    }}
                >
                    <Icon name="mdi:pencil" />
                    Cập nhật thông tin
                </Button>
            </div>

            {/* User Profile Card */}
            <Card 
                title="Hồ sơ người dùng"
                style={{
                    borderRadius: 12,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
                    border: '1px solid var(--border)',
                }}
            >
                <div className="space-y-6">
                    {/* User Info Header */}
                    <Flex align="flex-start" gap={20}>
                        <Avatar 
                            size={100} 
                            src={userData.avatar}
                            style={{
                                border: '3px solid var(--border)',
                                flexShrink: 0,
                            }}
                        />
                        <Flex vertical flex={1} gap={12}>
                            <div>
                                <div style={{ 
                                    fontSize: '20px', 
                                    fontWeight: 600,
                                    color: 'var(--text)',
                                    marginBottom: '4px'
                                }}>
                                    {userData.name}
                                </div>
                                <div style={{ 
                                    fontSize: '14px',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '8px'
                                }}>
                                    {userData.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    
                                    {userData.isActive !== undefined && (
                                        <Tag
                                            color={userData.isActive ? "success" : "default"}
                                            style={{
                                                fontSize: '12px',
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                margin: 0,
                                            }}
                                        >
                                            {userData.isActive ? "Active" : "Inactive"}
                                        </Tag>
                                    )}
                                </div>
                            </div>
                        </Flex>
                    </Flex>

                    {/* Divider */}
                    <div style={{ 
                        height: '1px', 
                        backgroundColor: 'var(--border)',
                        margin: '24px 0'
                    }} />

                    {/* User Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <div style={{ 
                                fontSize: '13px',
                                color: 'var(--text-tertiary)',
                                marginBottom: '4px'
                            }}>
                                Ngày sinh
                            </div>
                            <div style={{ 
                                fontSize: '15px',
                                color: 'var(--text)',
                                fontWeight: 500
                            }}>
                                {userData.birthDate}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div style={{ 
                                fontSize: '13px',
                                color: 'var(--text-tertiary)',
                                marginBottom: '4px'
                            }}>
                                Giới tính
                            </div>
                            <div style={{ 
                                fontSize: '15px',
                                color: 'var(--text)',
                                fontWeight: 500
                            }}>
                                {userData.gender}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div style={{ 
                                fontSize: '13px',
                                color: 'var(--text-tertiary)',
                                marginBottom: '4px'
                            }}>
                                Chiều cao
                            </div>
                            <div style={{ 
                                fontSize: '15px',
                                color: 'var(--text)',
                                fontWeight: 500
                            }}>
                                {userData.height}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div style={{ 
                                fontSize: '13px',
                                color: 'var(--text-tertiary)',
                                marginBottom: '4px'
                            }}>
                                Cân nặng
                            </div>
                            <div style={{ 
                                fontSize: '15px',
                                color: 'var(--text)',
                                fontWeight: 500
                            }}>
                                {userData.weight}
                            </div>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <div style={{ 
                                fontSize: '13px',
                                color: 'var(--text-tertiary)',
                                marginBottom: '4px'
                            }}>
                                Mục tiêu
                            </div>
                            <div style={{ 
                                fontSize: '15px',
                                color: 'var(--text)',
                                fontWeight: 500,
                                lineHeight: '1.6'
                            }}>
                                {userData.goal}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UserDetailPage;