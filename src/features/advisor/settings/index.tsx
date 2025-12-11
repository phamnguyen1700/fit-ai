'use client';

import React, { useMemo } from 'react';
import { Card, Row, Col } from '@/shared/ui';
import { Skeleton } from 'antd';
import { useAdvisorDetail } from '@/tanstack/hooks/advisor';
import { AdvisorDetail } from '@/types/advisor';
import { useAuthStore } from '@/stores/stores';
import { ProfileInfoCard } from './components/ProfileInfoCard';
import { ChangePasswordForm } from './components/ChangePasswordForm';

// Utility functions
const resolveAvatarUrl = (avatar?: string) => {
    if (!avatar) return undefined;
    // Nếu đã là full URL (http/https), trả về trực tiếp không encode
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return avatar;
    }
    // Nếu là relative path, resolve với base URL
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
    const normalized = avatar.replace(/^\/+/, '');
    const resolved = base ? `${base}/${normalized}` : avatar;
    return resolved;
};

const formatDate = (value?: string) => {
    if (!value) return 'Chưa cập nhật';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString('vi-VN');
};

export const AdvisorSettingsPage: React.FC = () => {
    const { user } = useAuthStore();
    const advisorId = user?.id;
    
    const { data, isLoading, isError } = useAdvisorDetail(advisorId);

    const advisorData = data?.data as AdvisorDetail | undefined;

    // Process data from API
    const processedData = useMemo(() => {
        if (!advisorData) return null;

        const fullName = `${advisorData.firstName ?? ''} ${advisorData.lastName ?? ''}`.trim();
        const certifications = Array.isArray(advisorData.certifications)
            ? advisorData.certifications
            : typeof advisorData.certifications === 'string'
            ? advisorData.certifications.split(',').map((item: string) => item.trim()).filter(Boolean)
            : [];

        const resolvedAvatar = resolveAvatarUrl(advisorData.profilePicture) || '';
        
        // Debug: log để kiểm tra
        if (advisorData.profilePicture) {
            console.log('Original profilePicture:', advisorData.profilePicture);
            console.log('Resolved avatar URL:', resolvedAvatar);
        }

        return {
            name: fullName || advisorData.email,
            email: advisorData.email,
            phone: advisorData.phone || 'Chưa cập nhật',
            avatar: resolvedAvatar,
            joinDate: formatDate(advisorData.lastCreate),
            certifications,
            bio: advisorData.bio || 'Chưa có mô tả',
        };
    }, [advisorData]);

    if (!advisorId) {
        return (
            <Card>
                <div className="py-12 text-center text-sm text-[var(--error)]">
                    Không tìm thấy thông tin advisor. Vui lòng đăng nhập lại.
                </div>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card>
                    <Skeleton active paragraph={{ rows: 4 }} />
                </Card>
                <Card>
                    <Skeleton active paragraph={{ rows: 6 }} />
                </Card>
            </div>
        );
    }

    if (isError || !processedData || !advisorData) {
        return (
            <Card>
                <div className="py-12 text-center text-sm text-[var(--error)]">
                    Không thể tải thông tin advisor. Vui lòng thử lại sau.
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Cài đặt</h1>
                {/* <p className="text-sm text-[var(--text-secondary)]">
                    Quản lý thông tin tài khoản và bảo mật của bạn
                </p> */}
            </div>

            <Row gutter={[40, 24]}>
                {/* Left Column - Profile Information */}
                <Col xs={24} lg={14}>
                    <ProfileInfoCard
                        advisorData={advisorData}
                        processedData={processedData}
                    />
                </Col>

                {/* Right Column - Change Password */}
                <Col xs={24} lg={10}>
                    <ChangePasswordForm />
                </Col>
            </Row>
        </div>
    );
};

export default AdvisorSettingsPage;
