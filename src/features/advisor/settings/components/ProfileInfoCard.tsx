'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, Flex, Button } from '@/shared/ui';
import { Icon, icons } from '@/shared/ui/icon';
import { ProfileHeader } from './ProfileHeader';
import { EditableProfileField } from './EditableProfileField';
import { ProfileField } from './ProfileField';
import { CertificationsList } from './CertificationsList';
import { AdvisorDetail } from '@/types/advisor';
import { useUpdateAdvisorProfile } from '@/tanstack/hooks/advisor';
import { useAuthStore } from '@/stores/stores';
import toast from 'react-hot-toast';

interface ProfileInfoCardProps {
    advisorData: AdvisorDetail;
    processedData: {
        name: string;
        email: string;
        phone: string;
        avatar: string;
        joinDate: string;
        certifications: string[];
        bio: string;
    };
}

interface FormData {
    firstName: string;
    lastName: string;
    phone: string;
    bio: string;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
    advisorData,
    processedData,
}) => {
    const { user } = useAuthStore();
    const advisorId = user?.id;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        phone: '',
        bio: '',
    });
    const updateProfile = useUpdateAdvisorProfile();

    // Initialize form data
    useEffect(() => {
        if (advisorData && !isEditing) {
            setFormData({
                firstName: advisorData.firstName || '',
                lastName: advisorData.lastName || '',
                phone: advisorData.phone || '',
                bio: advisorData.bio || '',
            });
        }
    }, [advisorData, isEditing]);

    const handleEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        // Reset form data
        if (advisorData) {
            setFormData({
                firstName: advisorData.firstName || '',
                lastName: advisorData.lastName || '',
                phone: advisorData.phone || '',
                bio: advisorData.bio || '',
            });
        }
    }, [advisorData]);

    const handleSave = useCallback(() => {
        if (!advisorId || !advisorData) return;

        // Validation
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            toast.error('Vui lòng nhập đầy đủ họ và tên');
            return;
        }

        const updateData = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phone: formData.phone.trim() || '',
            bio: formData.bio.trim() || '',
            specialties: typeof advisorData.specialties === 'string' 
                ? advisorData.specialties 
                : Array.isArray(advisorData.specialties)
                ? advisorData.specialties.join(', ')
                : '',
            yearsExperience: advisorData.yearsExperience || 0,
            profilePicture: advisorData.profilePicture || '',
            availability: advisorData.availability || advisorData.workingHours || '',
        };

        updateProfile.mutate(
            { advisorId, data: updateData },
            {
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    }, [advisorId, advisorData, formData, updateProfile]);

    const handleFormChange = useCallback((field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const displayName = isEditing && formData.firstName && formData.lastName
        ? `${formData.firstName} ${formData.lastName}`.trim()
        : processedData.name;

    return (
        <div className="h-full">
            <div className="mb-4 flex items-center justify-between">
                <Flex align="center" gap={8}>
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                        <Icon name={icons.advisors} size={18} className="text-[var(--primary)]" />
                    </div>
                    <span className="text-lg font-semibold">Thông tin cá nhân</span>
                </Flex>
                {!isEditing ? (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleEdit}
                        className="flex items-center gap-2"
                    >
                        <Icon name="mdi:pencil" size={16} />
                        Chỉnh sửa
                    </Button>
                ) : (
                    <Flex gap={8}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={updateProfile.isPending}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSave}
                            loading={updateProfile.isPending}
                        >
                            Lưu thay đổi
                        </Button>
                    </Flex>
                )}
            </div>
            <Card className="h-full shadow-sm">
                <div className="space-y-8">
                    <ProfileHeader
                        name={displayName}
                        email={processedData.email}
                        phone={isEditing ? formData.phone : processedData.phone}
                        avatar={processedData.avatar}
                    />

                    <div className="space-y-5">
                        <div className="flex flex-col sm:flex-row gap-5">
                            <EditableProfileField
                                label="Họ"
                                value={formData.firstName}
                                icon="mdi:account-outline"
                                isEditing={isEditing}
                                fieldName="firstName"
                                onChange={handleFormChange}
                            />
                            <EditableProfileField
                                label="Tên"
                                value={formData.lastName}
                                icon="mdi:account-outline"
                                isEditing={isEditing}
                                fieldName="lastName"
                                onChange={handleFormChange}
                            />
                        </div>

                        <EditableProfileField
                            label="Số điện thoại"
                            value={formData.phone}
                            icon={icons.phone}
                            fullWidth
                            isEditing={isEditing}
                            fieldName="phone"
                            onChange={handleFormChange}
                        />

                        <EditableProfileField
                            label="Giới thiệu"
                            value={formData.bio}
                            icon="mdi:text-box-outline"
                            fullWidth
                            isEditing={isEditing}
                            fieldName="bio"
                            onChange={handleFormChange}
                            multiline
                        />

                        <ProfileField
                            label="Ngày tham gia"
                            value={processedData.joinDate}
                            icon="mdi:calendar-outline"
                            fullWidth
                        />

                        {processedData.certifications.length > 0 && (
                            <CertificationsList certifications={processedData.certifications} />
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};
