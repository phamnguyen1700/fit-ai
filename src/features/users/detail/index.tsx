'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Breadcrumb, Avatar, Button, Progress, Tabs, Badge, Flex, Row, Col, Input } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

interface UserDetailPageProps {
    userId?: string;
}

export const UserDetailPage: React.FC<UserDetailPageProps> = ({ userId }) => {
    const router = useRouter();

    // Mock data - trong thực tế sẽ fetch từ API dựa trên userId
    const userData = {
        id: userId || '1',
        name: 'Cameron Williamson',
        email: 'debra.holt@example.com',
        avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c',
        plan: 'Free Trial',
        birthDate: '12-12-2002',
        gender: 'Nam',
        height: '1m75',
        weight: '85kg',
        goal: 'Giảm mỡ bụng, xuống còn 75kg, tăng mỡ cơ, tăng cơ, tăng mỡ gan, giảm cholesterol',
        diet: {
            likes: 'Thịt gà, cá hồi',
            avoids: 'Sữa bò, gluten',
            mealsPerDay: 4
        },
        bodyFat: 24,
        mealPlan: {
            morning: { food: 'Cá hồi, Salad', calories: '320/500 kcal' },
            noon: { food: 'Cá hồi, Salad', calories: '320/500 kcal' },
            snack: { food: 'Cá hồi, Salad', calories: '320/500 kcal' }
        }
    };

    const breadcrumbItems = [
        { title: 'Trang chủ', href: '/admin/dashboard' },
        { title: 'Quản lý người dùng', href: '/admin/users' },
        { title: 'Thông người dùng' }
    ];

    const mealTabItems = [
        {
            key: 'workout',
            label: 'Workout',
        },
        {
            key: 'meal',
            label: 'Meal',
        },
    ];

    const handleEdit = useCallback(() => {
        // TODO: Implement edit functionality
        console.log('Edit user:', userData.id);
    }, [userData.id]);

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
