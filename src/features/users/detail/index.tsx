'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Breadcrumb, Avatar, Button, Progress, Tabs, Badge, Flex, Row, Col, Input } from '@/shared/ui';
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

    const mealTabItems = useMemo(() => [
        {
            key: 'workout',
            label: 'Workout',
        },
        {
            key: 'meal',
            label: 'Meal',
        },
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
            plan: 'Free Trial',
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
        <Card
            title={<span className="text text-base sm:text-lg font-semibold">Chi tiết người dùng</span>}
        >
            {/* Header với Breadcrumb và Edit button */}
            <div className="flex items-center justify-between mb-3">
                <Breadcrumb items={breadcrumbItems} />
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Icon name="mdi:pencil" />
                    Cập nhật thông tin
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {/* Left Column - Hồ sơ người dùng */}
                <Col xs={24} lg={12}>
                    <Card title="Hồ sơ người dùng" className="h-fit">
                        <Flex align="flex-start" gap={16}>
                            <Avatar size={120} src={userData.avatar} />
                            <Flex vertical flex={1} gap={8}>
                                <Input
                                    value={userData.name}
                                    readOnly
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        padding: '5px 0 5px 10px',
                                        boxShadow: 'none'
                                    }}
                                />
                                <Input
                                    value={userData.email}
                                    readOnly
                                    style={{
                                        fontSize: '14px',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        padding: '5px 0 5px 10px',
                                        boxShadow: 'none'
                                    }}
                                />
                                <Badge
                                    count={userData.plan}
                                    style={{
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        borderRadius: '12px',
                                        alignSelf: 'flex-start',
                                    }}
                                />
                            </Flex>
                        </Flex>

                        <Row gutter={[16, 16]} className="mt-3">
                            <Col span={8}>
                                <span className="text-[var(--text-secondary)]">Ngày sinh:</span>
                            </Col>
                            <Col span={16}>
                                <Input value={userData.birthDate} readOnly />
                            </Col>

                            <Col span={8}>
                                <span className="text-[var(--text-secondary)]">Giới tính:</span>
                            </Col>
                            <Col span={16}>
                                <Input value={userData.gender} readOnly />
                            </Col>

                            <Col span={8}>
                                <span className="text-[var(--text-secondary)]">Chiều cao:</span>
                            </Col>
                            <Col span={16}>
                                <Input value={userData.height} readOnly />
                            </Col>

                            <Col span={8}>
                                <span className="text-[var(--text-secondary)]">Cân nặng:</span>
                            </Col>
                            <Col span={16}>
                                <Input value={userData.weight} readOnly />
                            </Col>

                            <Col span={8}>
                                <span className="text-[var(--text-secondary)]">Mục tiêu:</span>
                            </Col>
                            <Col span={16}>
                                <Input.TextArea value={userData.goal} readOnly rows={3} />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Right Column - AI Setup & Kế hoạch */}
                <Col xs={24} lg={12}>
                    <Flex vertical gap={24}>
                        {/* AI Setup */}
                        <Card title="AI Setup" className="h-fit">
                            <Row gutter={[16, 16]}>
                                {/* Left Column - Diet Info */}
                                <Col xs={24} sm={16}>
                                    <div className="space-y-2">
                                        <div>
                                            <h4 className="text-[var(--text-secondary)] mb-2 pl-2">Ăn uống</h4>
                                            <Row gutter={[16, 8]}>
                                                <Col span={8}>
                                                    <span className="text-[var(--text-secondary)] pl-4">● Thích:</span>
                                                </Col>
                                                <Col span={16}>
                                                    <Input value={userData.diet.likes} readOnly />
                                                </Col>

                                                <Col span={8}>
                                                    <span className="text-[var(--text-secondary)] pl-4">● Tránh:</span>
                                                </Col>
                                                <Col span={16}>
                                                    <Input value={userData.diet.avoids} readOnly />
                                                </Col>
                                            </Row>
                                        </div>

                                        <Row gutter={[16, 16]}>
                                            <Col span={8}>
                                                <span className="text-[var(--text-secondary)] pl-2">Số bữa/ngày:</span>
                                            </Col>
                                            <Col span={16}>
                                                <Input value={userData.diet.mealsPerDay.toString()} readOnly />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>

                                {/* Right Column - Avatar & Body Fat */}
                                <Col style={{ borderLeft: '2px solid var(--primary)', padding: '24px 16px 0 16px' }} xs={24} sm={8}>
                                    <Avatar shape='square' size={100} src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c" />
                                    <div>
                                        <span className="text-[var(--text-secondary)]">Body Fat:</span>
                                        <span className="text-[var(--text)] ml-2 font-semibold text-orange-500">
                                            {userData.bodyFat}%
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        {/* Kế hoạch đang dùng */}
                        <Card title="Kế hoạch đang dùng" className="flex-1">
                            <Tabs items={mealTabItems} defaultActiveKey="workout" />
                            <Row gutter={[16, 16]}>
                                {/* Sáng */}
                                <Col xs={24} sm={8}>
                                    <h4 className="font-medium text-[var(--text-secondary)] mb-2">Sáng</h4>
                                    <div className="space-y-2">
                                        <div className="bg-white border border-[var(--border)] rounded px-2 py-1 text-[var(--text)]">
                                            Cá hồi
                                        </div>
                                        <div className="bg-white border border-[var(--border)] rounded px-2 py-1 text-[var(--text)]">
                                            Salad
                                        </div>
                                    </div>
                                    <Progress
                                        showInfo={false}
                                        percent={64}
                                        size="small"
                                        style={{ flex: 1 }}
                                        strokeColor="var(--primary)"
                                    />
                                    <span className="text-[10px] text-[var(--text-secondary)]">
                                        {userData.mealPlan.morning.calories}
                                    </span>
                                </Col>

                                {/* Trưa */}
                                <Col xs={24} sm={8}>
                                    <h4 className="font-medium text-[var(--text-secondary)] mb-2">Trưa</h4>
                                    <div className="space-y-2">
                                        <div className="bg-white border border-[var(--border)] rounded px-2 py-1 text-[var(--text)]">
                                            Cá hồi
                                        </div>
                                        <div className="bg-white border border-[var(--border)] rounded px-2 py-1 text-[var(--text)]">
                                            Salad
                                        </div>
                                    </div>
                                    <Progress
                                        showInfo={false}
                                        percent={64}
                                        size="small"
                                        style={{ flex: 1 }}
                                        strokeColor="var(--primary)"
                                    />
                                    <span className="text-[10px] text-[var(--text-secondary)]">
                                        {userData.mealPlan.noon.calories}
                                    </span>
                                </Col>

                                {/* Bữa phụ */}
                                <Col xs={24} sm={8}>
                                    <h4 className="font-medium text-[var(--text-secondary)] mb-2">Bữa phụ</h4>
                                    <div className="space-y-2">
                                        <div className="bg-white border border-[var(--border)] rounded px-2 py-1 text-[var(--text)]">
                                            Cá hồi
                                        </div>
                                        <div className="bg-white border border-[var(--border)] rounded px-2 py-1 text-[var(--text)]">
                                            Salad
                                        </div>
                                    </div>
                                    <Progress
                                        showInfo={false}
                                        percent={64}
                                        size="small"
                                        style={{ flex: 1 }}
                                        strokeColor="var(--primary)"
                                    />
                                    <span className="text-[10px] text-[var(--text-secondary)]">
                                        {userData.mealPlan.snack.calories}
                                    </span>
                                </Col>
                            </Row>
                        </Card>
                    </Flex>
                </Col>
            </Row>
        </Card>
    );
};

export default UserDetailPage;