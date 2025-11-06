import React from 'react';
import { Card, Avatar, Badge, Flex, Row, Col, Input } from '@/shared/ui';

interface AdvisorProfileProps {
    advisorData: {
        name: string;
        email: string;
        phone: string;
        avatar: string;
        status: string;
        birthDate: string;
        gender: string;
        joinDate: string;
        experience: string;
        bio: string;
    };
}

export const AdvisorProfile: React.FC<AdvisorProfileProps> = ({ advisorData }) => {
    return (
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
    );
};
