import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, Avatar, Badge, Button, Flex, Row, Col, Input } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

interface Client {
    id: string;
    name: string;
    email: string;
    avatar: string;
    program: string;
    startDate: string;
    status: string;
}

interface ManagedClientsListProps {
    clients: Client[];
}

export const ManagedClientsList: React.FC<ManagedClientsListProps> = ({ clients }) => {
    const router = useRouter();

    return (
        <Card title="Khách hàng đang quản lý" className="h-fit">
            <div className="mb-4">
                <Flex justify="space-between" align="center">
                    <span className="text-[var(--text-secondary)]">
                        Tổng số: <span className="font-semibold text-[var(--text)]">{clients.length} khách hàng</span>
                    </span>
                    <Input.Search 
                        placeholder="Tìm kiếm khách hàng..." 
                        style={{ width: 300 }}
                    />
                </Flex>
            </div>

            <Row gutter={[16, 16]}>
                {clients.map((client) => (
                    <Col xs={24} sm={12} lg={8} key={client.id}>
                        <Card className="h-full hover:shadow-lg transition-shadow">
                            {/* Header */}
                            <Flex align="flex-start" gap={12} className="mb-4">
                                <Avatar size={56} src={client.avatar}>
                                    {client.name[0]}
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

                            {/* Info */}
                            <div className="space-y-2 mb-4 p-3 bg-[var(--bg-secondary)] rounded-lg">
                                <Flex justify="space-between">
                                    <span className="text-sm text-[var(--text-secondary)]">Chương trình:</span>
                                    <span className="text-sm font-semibold text-[var(--primary)]">
                                        {client.program}
                                    </span>
                                </Flex>
                                <Flex justify="space-between">
                                    <span className="text-sm text-[var(--text-secondary)]">Ngày bắt đầu:</span>
                                    <span className="text-sm text-[var(--text)]">
                                        {client.startDate}
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
