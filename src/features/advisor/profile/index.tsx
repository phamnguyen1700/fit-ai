'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Card, Row, Col } from '@/shared/ui';
import { Skeleton } from 'antd';
import { useAdvisorDetail, useUpdateAdvisorProfile } from '@/tanstack/hooks/advisor';
import { AdvisorDetail } from '@/types/advisor';
import { useAuthStore } from '@/stores/stores';
import toast from 'react-hot-toast';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileInfo } from './components/ProfileInfo';
import { ProfileStats } from './components/ProfileStats';
import { ProfileSpecialty } from './components/ProfileSpecialty';
import { ProfileAchievements } from './components/ProfileAchievements';
import { ProfileEditForm } from './components/ProfileEditForm';

// Utility functions
const resolveAvatarUrl = (avatar?: string) => {
    if (!avatar) return undefined;
    if (avatar.startsWith('http')) {
        return encodeURI(avatar);
    }
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
    const normalized = avatar.replace(/^\/+/, '');
    const resolved = base ? `${base}/${normalized}` : avatar;
    return encodeURI(resolved);
};

const formatDate = (value?: string) => {
    if (!value) return 'Chưa cập nhật';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString('vi-VN');
};

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

export const AdvisorProfilePage: React.FC = () => {
    const { user } = useAuthStore();
    const advisorId = user?.id;
    
    const { data, isLoading, isError } = useAdvisorDetail(advisorId);
    const updateAdvisorProfile = useUpdateAdvisorProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: '',
        lastName: '',
        phone: '',
        bio: '',
        specialties: '',
        yearsExperience: 0,
        profilePicture: '',
        availability: '',
    });

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
        const rawSpecialties = advisorData.specialties as string[] | string | undefined;
        const specialtiesArray = Array.isArray(rawSpecialties)
            ? rawSpecialties
            : typeof rawSpecialties === 'string'
            ? rawSpecialties.split(',').map((item: string) => item.trim()).filter(Boolean)
            : [];
        const customers = advisorData.customers ?? [];
        const activeCustomers = customers.filter((customer) => customer.subscriptionStatus === 'Active').length;
        const totalCustomers =
            typeof advisorData.totalCustomers === 'number' ? advisorData.totalCustomers : customers.length;

        return {
            name: fullName || advisorData.email,
            email: advisorData.email,
            phone: advisorData.phone || 'Chưa cập nhật',
            avatar: resolveAvatarUrl(advisorData.profilePicture) || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
            specialty: specialtiesArray.length ? specialtiesArray.join(', ') : 'Chưa cập nhật',
            experience: typeof advisorData.yearsExperience === 'number' ? `${advisorData.yearsExperience} năm` : 'Chưa cập nhật',
            rating: typeof advisorData.rating === 'number' ? advisorData.rating : 0,
            totalClients: totalCustomers,
            activeClients: activeCustomers,
            status: advisorData.isActive ? 'Hoạt động' : 'Ngưng hoạt động',
            certifications,
            joinDate: formatDate(advisorData.lastCreate),
            workingHours: advisorData.workingHours || advisorData.availability || 'Chưa cập nhật',
            bio: advisorData.bio || 'Chưa có mô tả',
            achievements: advisorData.achievements || [],
        };
    }, [advisorData]);

    // Initialize form data when advisor detail is loaded
    useEffect(() => {
        if (advisorData && !isEditing) {
            setFormData({
                firstName: advisorData.firstName || '',
                lastName: advisorData.lastName || '',
                phone: advisorData.phone || '',
                bio: advisorData.bio || '',
                specialties: Array.isArray(advisorData.specialties)
                    ? advisorData.specialties.join(', ')
                    : advisorData.specialties || '',
                yearsExperience: advisorData.yearsExperience || 0,
                profilePicture: advisorData.profilePicture || '',
                availability: advisorData.workingHours || advisorData.availability || '',
            });
        }
    }, [advisorData, isEditing]);

    const handleEdit = useCallback(() => {
        if (!processedData) return;
        setIsEditing(true);
    }, [processedData]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        // Reset form data to original values
        if (advisorData) {
            setFormData({
                firstName: advisorData.firstName || '',
                lastName: advisorData.lastName || '',
                phone: advisorData.phone || '',
                bio: advisorData.bio || '',
                specialties: Array.isArray(advisorData.specialties)
                    ? advisorData.specialties.join(', ')
                    : advisorData.specialties || '',
                yearsExperience: advisorData.yearsExperience || 0,
                profilePicture: advisorData.profilePicture || '',
                availability: advisorData.workingHours || advisorData.availability || '',
            });
        }
    }, [advisorData]);

    const handleSave = useCallback(() => {
        if (!advisorId || !advisorData) return;

        // Basic validation
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            toast.error('Vui lòng nhập đầy đủ họ và tên');
            return;
        }

        const updateData = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phone: formData.phone.trim() || '',
            bio: formData.bio.trim() || '',
            specialties: formData.specialties.trim() || '',
            yearsExperience: formData.yearsExperience || 0,
            profilePicture: formData.profilePicture.trim() || '',
            availability: formData.availability.trim() || '',
        };

        updateAdvisorProfile.mutate(
            { advisorId, data: updateData },
            {
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    }, [advisorId, advisorData, formData, updateAdvisorProfile]);

    const handleFormChange = useCallback((field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

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
            <Card>
                <Skeleton active paragraph={{ rows: 8 }} />
            </Card>
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
        <div className="space-y-8">
            {/* Profile Header with Gradient Background */}
            <Card className="overflow-hidden p-0">
                <ProfileHeader
                    name={processedData.name}
                    email={processedData.email}
                    avatar={processedData.avatar}
                    status={processedData.status}
                    bio={processedData.bio}
                    isEditing={isEditing}
                    isSaving={updateAdvisorProfile.isPending}
                    firstName={formData.firstName}
                    lastName={formData.lastName}
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                    onSave={handleSave}
                />
            </Card>

            {/* Main Content */}
            <Row gutter={[24, 24]}>
                {/* Left Column */}
                <Col xs={24} lg={16}>
                    <div className="space-y-8">
                        {isEditing && (
                            <ProfileEditForm
                                formData={formData}
                                onFormChange={handleFormChange}
                            />
                        )}
                        <ProfileInfo
                            phone={processedData.phone}
                            joinDate={processedData.joinDate}
                            experience={processedData.experience}
                            bio={processedData.bio}
                            isEditing={isEditing}
                            formData={formData}
                            onFormChange={handleFormChange}
                        />
                        <ProfileSpecialty
                            specialty={processedData.specialty}
                            workingHours={processedData.workingHours}
                            certifications={processedData.certifications}
                            isEditing={isEditing}
                            formData={formData}
                            onFormChange={handleFormChange}
                        />
                    </div>
                </Col>

                {/* Right Column */}
                <Col xs={24} lg={8}>
                    <div className="space-y-8">
                        <ProfileStats
                            totalClients={processedData.totalClients}
                            activeClients={processedData.activeClients}
                            rating={processedData.rating}
                        />
                        <ProfileAchievements achievements={processedData.achievements} />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AdvisorProfilePage;
