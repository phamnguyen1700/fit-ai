import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, Avatar, Badge, Button, Flex, Row, Col, Input } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import { AdvisorCustomer } from '@/types/advisor';
import { Empty } from 'antd';

interface ManagedClientsListProps {
    clients?: AdvisorCustomer[];
}

const formatGoal = (goal?: string) => {
    if (!goal) return 'Chưa cập nhật';
    return goal
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
};

const formatStatus = (status?: string) => {
    if (!status) return 'Không xác định';
    switch (status) {
        case 'Active':
            return 'Đang hoạt động';
        case 'Free':
            return 'Miễn phí';
        case 'Suspended':
            return 'Tạm dừng';
        default:
            return status;
    }
};

const getStatusColor = (status?: string) => {
    switch (status) {
        case 'Active':
            return '#52c41a';
        case 'Free':
            return '#1890ff';
        case 'Suspended':
            return '#faad14';
        default:
            return '#d9d9d9';
    }
};

const formatDate = (value?: string | null) => {
    if (!value) return 'Chưa cập nhật';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString('vi-VN');
};

export const ManagedClientsList: React.FC<ManagedClientsListProps> = ({ clients }) => {
    const totalClients = clients?.length ?? 0;

    const router = useRouter();

    return (
        <Card title="Khách hàng đang quản lý" className="h-fit">
            <div className="mb-4">
                <Flex justify="space-between" align="center">
                    <span className="text-[var(--text-secondary)]">
                        Tổng số: <span className="font-semibold text-[var(--text)]">{totalClients} khách hàng</span>
                    </span>
                    <Input.Search 
                        placeholder="Tìm kiếm khách hàng..." 
                        style={{ width: 300 }}
                    />
                </Flex>
            </div>

            {!totalClients && (
                <Empty description="Chưa có khách hàng nào" />
            )}

            <Row gutter={[16, 16]}>
                {clients?.map((client) => (
                    <Col xs={24} sm={12} lg={8} key={client.id}>
                        <Card className="h-full hover:shadow-lg transition-shadow">
                            {/* Header */}
                            <Flex align="flex-start" gap={12} className="mb-4">
                                <Avatar size={56} src={client.avatar || undefined}>
                                    {(client.name || client.email || 'U')[0]}
                                </Avatar>
                                <Flex vertical flex={1}>
                                    <div className="font-semibold text-[var(--text)] text-base">
                                        {client.name}
                                    </div>
                                    <div className="text-sm text-[var(--text-secondary)]">
                                        {client.email}
                                    </div>
                                </Flex>
                                <Badge
                                    count={formatStatus(client.subscriptionStatus)}
                                    style={{
                                        backgroundColor: getStatusColor(client.subscriptionStatus),
                                        fontSize: '10px',
                                        padding: '0 8px',
                                        height: '20px',
                                        lineHeight: '20px'
                                    }}
                                />
                            </Flex>

                            {/* Info */}
                            <div className="space-y-2 mb-4 p-3 bg-[var(--bg-secondary)] rounded-lg">
                                <Flex justify="space-between">
                                    <span className="text-sm text-[var(--text-secondary)]">Chương trình:</span>
                                    <span className="text-sm font-semibold text-[var(--primary)]">
                                        {formatGoal(client.goal)}
                                    </span>
                                </Flex>
                                <Flex justify="space-between">
                                    <span className="text-sm text-[var(--text-secondary)]">Ngày bắt đầu:</span>
                                    <span className="text-sm text-[var(--text)]">
                                        {formatDate(client.subscriptionStartDate)}
                                    </span>
                                </Flex>
                            </div>

                            {/* Actions */}
                            <Flex gap={8}>
                                <Button 
                                    size="md" 
                                    style={{ flex: 1 }}
                                    onClick={() => router.push(`/admin/users/${client.id}`)}
                                >
                                    <Icon name="mdi:account-details" />
                                    Chi tiết
                                </Button>
                                <Button 
                                    size="md" 
                                    variant="ghost"
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
    );
};
