'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Breadcrumb, Avatar, Button, Progress, Tabs, Badge, Flex, Row, Col, Input } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

interface AdvisorDetailPageProps {
    advisorId?: string;
}

export const AdvisorDetailPage: React.FC<AdvisorDetailPageProps> = ({ advisorId }) => {
    const router = useRouter();

    // Mock data - trong thực tế sẽ fetch từ API dựa trên advisorId
    const advisorData = {
        id: advisorId || '1',
        name: 'Nguyễn Văn Mạnh',
        email: 'nguyen.van.manh@fitai.com',
        phone: '0901234567',
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
        specialty: 'Thể hình',
        experience: '8 năm',
        rating: 4.8,
        totalClients: 145,
        activeClients: 98,
        completedPrograms: 67,
        status: 'Hoạt động',
        certifications: ['PT Certified', 'Nutrition Specialist', 'CrossFit Level 2'],
        birthDate: '15-03-1990',
        gender: 'Nam',
        joinDate: '01-01-2020',
        specializations: ['Giảm cân', 'Tăng cơ', 'Thể hình thi đấu'],
        workingHours: 'Thứ 2 - Thứ 6: 6:00 - 22:00\nThứ 7 - CN: 8:00 - 18:00',
        bio: 'Huấn luyện viên có hơn 8 năm kinh nghiệm trong lĩnh vực thể hình và dinh dưỡng. Chuyên về xây dựng chương trình tập luyện và kế hoạch dinh dưỡng cá nhân hóa.',
        achievements: [
            { year: '2023', title: 'Best Trainer Award', organization: 'FitAI' },
            { year: '2022', title: 'Top Performer', organization: 'FitAI' },
            { year: '2021', title: 'Excellence in Training', organization: 'FitAI' }
        ],
        stats: {
            avgSessionsPerWeek: 25,
            clientSatisfaction: 96,
            programCompletionRate: 78
        }
    };

    // Mock data khách hàng đang quản lý
    const managedClients = [
        {
            id: '1',
            name: 'Trần Văn An',
            email: 'tran.van.an@example.com',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
            program: 'Giảm cân',
            startDate: '01/10/2024',
            progress: 65,
            status: 'Đang hoạt động',
            sessionsCompleted: 12,
            totalSessions: 20
        },
        {
            id: '2',
            name: 'Nguyễn Thị Bình',
            email: 'nguyen.thi.binh@example.com',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
            program: 'Tăng cơ',
            startDate: '15/09/2024',
            progress: 80,
            status: 'Đang hoạt động',
            sessionsCompleted: 16,
            totalSessions: 20
        },
        {
            id: '3',
            name: 'Lê Hoàng Cường',
            email: 'le.hoang.cuong@example.com',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            program: 'Thể hình thi đấu',
            startDate: '20/08/2024',
            progress: 45,
            status: 'Đang hoạt động',
            sessionsCompleted: 9,
            totalSessions: 20
        },
        {
            id: '4',
            name: 'Phạm Thu Hương',
            email: 'pham.thu.huong@example.com',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
            program: 'Giảm cân',
            startDate: '05/11/2024',
            progress: 30,
            status: 'Đang hoạt động',
            sessionsCompleted: 6,
            totalSessions: 20
        },
        {
            id: '5',
            name: 'Hoàng Văn Đức',
            email: 'hoang.van.duc@example.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
            program: 'Tăng cơ',
            startDate: '12/07/2024',
            progress: 95,
            status: 'Sắp hoàn thành',
            sessionsCompleted: 19,
            totalSessions: 20
        },
        {
            id: '6',
            name: 'Vũ Thị Mai',
            email: 'vu.thi.mai@example.com',
            avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
            program: 'Yoga & Thể hình',
            startDate: '25/09/2024',
            progress: 55,
            status: 'Đang hoạt động',
            sessionsCompleted: 11,
            totalSessions: 20
        }
    ];

    const breadcrumbItems = [
        { title: 'Trang chủ', href: '/admin/dashboard' },
        { title: 'Quản lý advisor', href: '/admin/advisors' },
        { title: 'Thông tin advisor' }
    ];

    const tabItems = [
        {
            key: 'clients',
            label: 'Khách hàng',
        },
        {
            key: 'programs',
            label: 'Chương trình',
        },
        {
            key: 'schedule',
            label: 'Lịch làm việc',
        },
    ];

    const handleEdit = useCallback(() => {
        console.log('Edit advisor:', advisorData.id);
    }, [advisorData.id]);

    const handleDeactivate = useCallback(() => {
        console.log('Deactivate advisor:', advisorData.id);
    }, [advisorData.id]);

    return (
        <Card
            title={<span className="text text-base sm:text-lg font-semibold">Chi tiết Advisor</span>}
        >
            {/* Header với Breadcrumb và Action buttons */}
            <div className="flex items-center justify-between mb-3">
                <Breadcrumb items={breadcrumbItems} />
                <Flex gap={8}>
                    <Button variant="ghost" size="sm" onClick={handleEdit}>
                        <Icon name="mdi:pencil" />
                        Cập nhật thông tin
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDeactivate}>
                        <Icon name="mdi:pause-circle-outline" />
                        Tạm dừng
                    </Button>
                </Flex>
            </div>

            <Row gutter={[24, 24]}>
                {/* Left Column - Hồ sơ Advisor */}
                <Col xs={24} lg={12}>
                    <Card title="Hồ sơ Advisor" className="h-fit">
                        <Flex align="flex-start" gap={16}>
                            <Avatar size={120} src={advisorData.avatar}>
                                {advisorData.name[0]}
                            </Avatar>
                            <Flex vertical flex={1} gap={8}>
                                <Input
                                    value={advisorData.name}
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
                                    value={advisorData.email}
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
                                    count={advisorData.status}
                                    style={{
                                        backgroundColor: advisorData.status === 'Hoạt động' ? '#52c41a' : '#fa8c16',
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
                                <span className="text-[var(--text-secondary)]">Số điện thoại:</span>
                            </Col>
                            <Col span={16}>
                                <Input value={advisorData.phone} readOnly />
                            </Col>

                            <Col span={8}>
                                <span className="text-[var(--text-secondary)]">Ngày sinh:</span>
                            </Col>
                            <Col span={16}>
                                <Input value={advisorData.birthDate} readOnly />
                            </Col>

                            <Col span={8}>
                                <span className="text-[var(--text-secondary)]">Giới tính:</span>
                            </Col>
                            <Col span={16}>
                                <Input value={advisorData.gender} readOnly />
                            </Col>

                            <Col span={8}>
                                <span className="text-[var(--text-secondary)]">Ngày tham gia:</span>
                            </Col>
                            <Col span={16}>
                                <Input value={advisorData.joinDate} readOnly />
                            </Col>

                            <Col span={8}>
                                <span className="text-[var(--text-secondary)]">Chuyên môn:</span>
                            </Col>
                            <Col span={16}>
                                <Input value={advisorData.specialty} readOnly />
                            </Col>

                            <Col span={8}>
                                <span className="text-[var(--text-secondary)]">Kinh nghiệm:</span>
                            </Col>
                            <Col span={16}>
                                <Input value={advisorData.experience} readOnly />
                            </Col>

                            <Col span={8}>
                                <span className="text-[var(--text-secondary)]">Giới thiệu:</span>
                            </Col>
                            <Col span={16}>
                                <Input.TextArea value={advisorData.bio} readOnly rows={3} />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Right Column - Thống kê & Thông tin chuyên môn */}
                <Col xs={24} lg={12}>
                    <Flex vertical gap={24}>
                        {/* Thống kê */}
                        <Card title="Thống kê" className="h-fit">
                            <Row gutter={[16, 16]}>
                                {/* Row 1 - 3 cột số liệu chính */}
                                <Col xs={24} sm={8}>
                                    <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                                        <div className="text-4xl font-bold text-[var(--primary)] mb-2">
                                            {advisorData.totalClients}
                                        </div>
                                        <div className="text-sm text-[var(--text-secondary)]">
                                            Tổng khách hàng
                                        </div>
                                    </div>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                                        <div className="text-4xl font-bold text-[#52c41a] mb-2">
                                            {advisorData.activeClients}
                                        </div>
                                        <div className="text-sm text-[var(--text-secondary)]">
                                            Đang theo dõi
                                        </div>
                                    </div>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                                        <div className="text-4xl font-bold text-[#1890ff] mb-2">
                                            {advisorData.completedPrograms}
                                        </div>
                                        <div className="text-sm text-[var(--text-secondary)]">
                                            Hoàn thành
                                        </div>
                                    </div>
                                </Col>

                                {/* Row 2 - 3 cột thống kê bổ sung */}
                                <Col xs={24} sm={8}>
                                    <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                                        <div className="text-sm text-[var(--text-secondary)] mb-2">Đánh giá</div>
                                        <Flex align="center" gap={8}>
                                            <span className="text-xl">⭐</span>
                                            <span className="text-xl font-bold text-[var(--primary)]">
                                                {advisorData.rating}/5
                                            </span>
                                        </Flex>
                                    </div>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                                        <div className="text-sm text-[var(--text-secondary)] mb-2">Buổi/tuần</div>
                                        <div className="text-xl font-bold text-[var(--text)]">
                                            {advisorData.stats.avgSessionsPerWeek}
                                        </div>
                                    </div>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                                        <div className="text-sm text-[var(--text-secondary)] mb-2">Hoàn thành</div>
                                        <Progress
                                            percent={advisorData.stats.programCompletionRate}
                                            size="small"
                                            strokeColor="var(--primary)"
                                            showInfo={true}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        {/* Chuyên môn */}
                        <Card title="Chuyên môn & Chứng chỉ" className="h-fit">
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <h4 className="text-[var(--text-secondary)] mb-2">Lĩnh vực chuyên môn</h4>
                                    <Flex gap={8} wrap="wrap">
                                        {advisorData.specializations.map((spec, index) => (
                                            <Badge
                                                key={index}
                                                count={spec}
                                                style={{
                                                    backgroundColor: 'var(--bg-tertiary)',
                                                    color: 'var(--primary)',
                                                    border: '1px solid var(--primary)',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    borderRadius: '12px',
                                                }}
                                            />
                                        ))}
                                    </Flex>
                                </Col>

                                <Col span={24}>
                                    <h4 className="text-[var(--text-secondary)] mb-2">Chứng chỉ</h4>
                                    <Flex vertical gap={8}>
                                        {advisorData.certifications.map((cert, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] rounded"
                                            >
                                                <Icon name="mdi:certificate-outline" className="text-[var(--primary)]" />
                                                <span className="text-[var(--text)]">{cert}</span>
                                            </div>
                                        ))}
                                    </Flex>
                                </Col>

                                <Col span={24}>
                                    <h4 className="text-[var(--text-secondary)] mb-2">Giờ làm việc</h4>
                                    <Input.TextArea value={advisorData.workingHours} readOnly rows={2} />
                                </Col>
                            </Row>
                        </Card>

                        {/* Thành tích */}
                        <Card title="Thành tích nổi bật" className="h-fit">
                            <Flex vertical gap={12}>
                                {advisorData.achievements.map((achievement, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg"
                                    >
                                        <Icon name="mdi:trophy-outline" size={24} className="text-[var(--primary)]" />
                                        <div>
                                            <div className="font-semibold text-[var(--text)]">
                                                {achievement.title}
                                            </div>
                                            <div className="text-sm text-[var(--text-secondary)]">
                                                {achievement.organization} • {achievement.year}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Flex>
                        </Card>
                    </Flex>
                </Col>
            </Row>

            {/* Bottom Section - Quản lý khách hàng */}
            <Row gutter={[24, 24]} className="mt-6">
                <Col span={24}>
                    <Card title="Khách hàng đang quản lý" className="h-fit">
                        <div className="mb-4">
                            <Flex justify="space-between" align="center">
                                <span className="text-[var(--text-secondary)]">
                                    Tổng số: <span className="font-semibold text-[var(--text)]">{managedClients.length} khách hàng</span>
                                </span>
                                <Input.Search 
                                    placeholder="Tìm kiếm khách hàng..." 
                                    style={{ width: 300 }}
                                />
                            </Flex>
                        </div>

                        <Row gutter={[16, 16]}>
                            {managedClients.map((client) => (
                                <Col xs={24} sm={12} lg={8} key={client.id}>
                                    <Card className="h-full hover:shadow-lg transition-shadow">
                                        <Flex align="flex-start" gap={12}>
                                            <Avatar size={56} src={client.avatar}>
                                                {client.name[0]}
                                            </Avatar>
                                            <Flex vertical flex={1} gap={8}>
                                                <div className="font-semibold text-[var(--text)] text-base">
                                                    {client.name}
                                                </div>
                                                <div className="text-sm text-[var(--text-secondary)]">
                                                    {client.email}
                                                </div>
                                            </Flex>
                                            <Badge
                                                count={client.status}
                                                style={{
                                                    backgroundColor: client.status === 'Đang hoạt động' ? '#52c41a' : '#1890ff',
                                                    fontSize: '10px',
                                                    padding: '0 8px',
                                                    height: '20px',
                                                    lineHeight: '20px'
                                                }}
                                            />
                                        </Flex>

                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <Flex justify="space-between" className="mb-1">
                                                    <span className="text-sm text-[var(--text-secondary)]">Chương trình:</span>
                                                    <span className="text-sm font-semibold text-[var(--primary)]">
                                                        {client.program}
                                                    </span>
                                                </Flex>
                                            </div>

                                            <div>
                                                <Flex justify="space-between" className="mb-1">
                                                    <span className="text-sm text-[var(--text-secondary)]">Ngày bắt đầu:</span>
                                                    <span className="text-sm text-[var(--text)]">
                                                        {client.startDate}
                                                    </span>
                                                </Flex>
                                            </div>

                                            <div>
                                                <Flex justify="space-between" className="mb-1">
                                                    <span className="text-sm text-[var(--text-secondary)]">Tiến độ:</span>
                                                    <span className="text-sm font-semibold text-[var(--text)]">
                                                        {client.sessionsCompleted}/{client.totalSessions} buổi
                                                    </span>
                                                </Flex>
                                                <Progress
                                                    percent={client.progress}
                                                    size="small"
                                                    strokeColor={
                                                        client.progress >= 80 ? '#52c41a' : 
                                                        client.progress >= 50 ? '#1890ff' : 
                                                        '#fa8c16'
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <Flex gap={8} className="mt-4">
                                            <Button 
                                                size="md" 
                                                style={{ flex: 1, minHeight: '40px' }}
                                                onClick={() => router.push(`/admin/users/${client.id}`)}
                                            >
                                                <Icon name="mdi:account-details" />
                                                Chi tiết
                                            </Button>
                                            <Button 
                                                size="md" 
                                                variant="ghost"
                                                style={{ minHeight: '40px', minWidth: '40px' }}
                                                onClick={() => console.log('Schedule session for', client.id)}
                                            >
                                                <Icon name="mdi:calendar-plus" />
                                            </Button>
                                        </Flex>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default AdvisorDetailPage;
