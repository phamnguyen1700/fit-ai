import React from 'react';
import { Card, Avatar, Badge, Flex, Row, Col, Input } from '@/shared/ui';

interface AdvisorProfileProps {
    advisorData: {
        name: string;
        email: string;
        phone: string;
        avatar: string;
        status: string;
        joinDate: string;
        experience: string;
        bio: string;
    };
    isEditing?: boolean;
    formData?: {
        firstName: string;
        lastName: string;
        phone: string;
        bio: string;
        yearsExperience: number;
    };
    onFormChange?: (field: string, value: string | number) => void;
}

export const AdvisorProfile: React.FC<AdvisorProfileProps> = ({ 
    advisorData, 
    isEditing = false,
    formData,
    onFormChange 
}) => {
    const displayName = isEditing && formData 
        ? `${formData.firstName} ${formData.lastName}`.trim() || advisorData.name
        : advisorData.name;
    return (
        <Card title="Hồ sơ Advisor" className="h-fit">
            <Flex align="flex-start" gap={16}>
                <Avatar size={120} src={advisorData.avatar}>
                    {displayName[0]}
                </Avatar>
                <Flex vertical flex={1} gap={8}>
                    {isEditing && formData ? (
                        <Flex gap={8}>
                            <Input
                                value={formData.firstName}
                                onChange={(e) => onFormChange?.('firstName', e.target.value)}
                                placeholder="Họ"
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                }}
                            />
                            <Input
                                value={formData.lastName}
                                onChange={(e) => onFormChange?.('lastName', e.target.value)}
                                placeholder="Tên"
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                }}
                            />
                        </Flex>
                    ) : (
                        <Input
                            value={displayName}
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
                    )}
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
                    <Input 
                        value={isEditing && formData ? formData.phone : advisorData.phone} 
                        readOnly={!isEditing}
                        onChange={isEditing ? (e) => onFormChange?.('phone', e.target.value) : undefined}
                    />
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
                    {isEditing && formData ? (
                        <Input 
                            type="number"
                            value={formData.yearsExperience}
                            onChange={(e) => onFormChange?.('yearsExperience', parseInt(e.target.value) || 0)}
                            placeholder="Số năm kinh nghiệm"
                            min={0}
                        />
                    ) : (
                        <Input value={advisorData.experience} readOnly />
                    )}
                </Col>

                <Col span={8}>
                    <span className="text-[var(--text-secondary)]">Giới thiệu:</span>
                </Col>
                <Col span={16}>
                    <Input.TextArea 
                        value={isEditing && formData ? formData.bio : advisorData.bio} 
                        readOnly={!isEditing}
                        onChange={isEditing ? (e) => onFormChange?.('bio', e.target.value) : undefined}
                        rows={3} 
                    />
                </Col>
            </Row>
        </Card>
    );
};
