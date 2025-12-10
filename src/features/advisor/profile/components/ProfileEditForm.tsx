'use client';

import React from 'react';
import { Card, Input, Row, Col } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
interface ProfileFormData {
    firstName: string;
    lastName: string;
    phone: string;
    bio: string;
    specialties: string;
    yearsExperience: number;
    profilePicture: string;
    availability: string;
}

interface ProfileEditFormProps {
    formData: ProfileFormData;
    onFormChange: (field: string, value: string | number) => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
    formData,
    onFormChange,
}) => {
    return (
        <Card 
            title={
                <div className="flex items-center gap-2">
                    <Icon name="mdi:account-edit" size={20} className="text-[var(--primary)]" />
                    <span>Chỉnh sửa thông tin cơ bản</span>
                </div>
            }
            className="h-fit border-2 border-[var(--primary)]/20"
        >
            <Row gutter={[16, 20]}>
                <Col xs={24} sm={12}>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Icon name="mdi:account-outline" size={16} className="text-[var(--text-secondary)]" />
                            <span className="text-sm font-medium text-[var(--text-secondary)]">Họ *</span>
                        </div>
                        <Input
                            value={formData.firstName}
                            onChange={(e) => onFormChange('firstName', e.target.value)}
                            placeholder="Nhập họ"
                            status={!formData.firstName.trim() ? 'error' : ''}
                        />
                    </div>
                </Col>
                <Col xs={24} sm={12}>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Icon name="mdi:account-outline" size={16} className="text-[var(--text-secondary)]" />
                            <span className="text-sm font-medium text-[var(--text-secondary)]">Tên *</span>
                        </div>
                        <Input
                            value={formData.lastName}
                            onChange={(e) => onFormChange('lastName', e.target.value)}
                            placeholder="Nhập tên"
                            status={!formData.lastName.trim() ? 'error' : ''}
                        />
                    </div>
                </Col>
            </Row>
        </Card>
    );
};
