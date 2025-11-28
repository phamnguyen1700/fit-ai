'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Card, Breadcrumb, Button, Flex, Row, Col } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import { AdvisorProfile } from './components/AdvisorProfile';
import { AdvisorStats } from './components/AdvisorStats';
import { AdvisorSpecialty } from './components/AdvisorSpecialty';
import { AdvisorAchievements } from './components/AdvisorAchievements';
import { ManagedClientsList } from './components/ManagedClientsList';
import { useAdvisorDetail, useSoftDeleteAdvisor, useReactivateAdvisor, useUpdateAdvisorProfile } from '@/tanstack/hooks/advisor';
import { AdvisorDetail, Achievement } from '@/types/advisor';
import { Skeleton, App } from 'antd';
import toast from 'react-hot-toast';

const resolveAvatarUrl = (avatar?: string) => {
    if (!avatar) return undefined;
    if (avatar.startsWith('http')) return avatar;
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
    const normalized = avatar.replace(/^\/+/, '');
    return base ? `${base}/${normalized}` : avatar;
};

type AdvisorDetailView = {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    specialty: string;
    experience: string;
    rating: number;
    totalClients: number;
    activeClients: number;
    completedPrograms: number;
    status: string;
    isActive: boolean;
    certifications: string[];
    joinDate: string;
    workingHours: string;
    bio: string;
    achievements: Achievement[];
};

const formatDate = (value?: string) => {
    if (!value) return 'Chưa cập nhật';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString('vi-VN');
};

const mapAdvisorDetailToProfile = (advisor?: AdvisorDetail): AdvisorDetailView | null => {
    if (!advisor) return null;

    const fullName = `${advisor.firstName ?? ''} ${advisor.lastName ?? ''}`.trim();
    const certifications = Array.isArray(advisor.certifications)
        ? advisor.certifications
    : typeof advisor.certifications === 'string'
    ? advisor.certifications.split(',').map((item: string) => item.trim()).filter(Boolean)
        : [];

    return {
        id: advisor.id,
        name: fullName || advisor.email,
        email: advisor.email,
        phone: advisor.phone || 'Chưa cập nhật',
        avatar: resolveAvatarUrl(advisor.profilePicture) || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
        specialty: advisor.specialties || 'Chưa cập nhật',
        experience: typeof advisor.yearsExperience === 'number' ? `${advisor.yearsExperience} năm` : 'Chưa cập nhật',
        rating: typeof advisor.rating === 'number' ? advisor.rating : 0,
        totalClients: advisor.totalClients ?? 0,
        activeClients: advisor.activeClients ?? 0,
        completedPrograms: advisor.completedPrograms ?? 0,
        status: advisor.isActive ? 'Hoạt động' : 'Ngưng hoạt động',
        isActive: advisor.isActive,
        certifications,
        joinDate: formatDate(advisor.lastCreate),
        workingHours: advisor.workingHours || 'Chưa cập nhật',
        bio: advisor.bio || 'Chưa có mô tả',
        achievements: advisor.achievements || [],
    };
};

interface AdvisorDetailPageProps {
    advisorId?: string;
}

export const AdvisorDetailPage: React.FC<AdvisorDetailPageProps> = ({ advisorId }) => {
    const { data, isLoading, isError } = useAdvisorDetail(advisorId);
    const softDeleteAdvisor = useSoftDeleteAdvisor();
    const reactivateAdvisor = useReactivateAdvisor();
    const updateAdvisorProfile = useUpdateAdvisorProfile();
    const { modal } = App.useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        bio: '',
        specialties: '',
        yearsExperience: 0,
        profilePicture: '',
        availability: '',
    });

    const advisorDetail = useMemo(() => mapAdvisorDetailToProfile(data?.data as AdvisorDetail | undefined), [data?.data]);

    // Initialize form data when advisor detail is loaded
    useEffect(() => {
        if (advisorDetail && !isEditing) {
            // Parse firstName and lastName from name
            const nameParts = advisorDetail.name.trim().split(/\s+/);
            const firstName = nameParts.slice(0, -1).join(' ') || '';
            const lastName = nameParts[nameParts.length - 1] || '';

            // Parse yearsExperience from experience string (e.g., "5 năm" -> 5)
            const experienceMatch = advisorDetail.experience.match(/(\d+)/);
            const yearsExperience = experienceMatch ? parseInt(experienceMatch[1]) : 0;

            setFormData({
                firstName,
                lastName,
                phone: advisorDetail.phone === 'Chưa cập nhật' ? '' : advisorDetail.phone,
                bio: advisorDetail.bio === 'Chưa có mô tả' ? '' : advisorDetail.bio,
                specialties: advisorDetail.specialty === 'Chưa cập nhật' ? '' : advisorDetail.specialty,
                yearsExperience,
                profilePicture: advisorDetail.avatar || '',
                availability: advisorDetail.workingHours === 'Chưa cập nhật' ? '' : advisorDetail.workingHours,
            });
        }
    }, [advisorDetail, isEditing]);

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

    const handleEdit = useCallback(() => {
        if (!advisorDetail) return;
        setIsEditing(true);
    }, [advisorDetail]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        // Reset form data to original values
        if (advisorDetail) {
            const nameParts = advisorDetail.name.trim().split(/\s+/);
            const firstName = nameParts.slice(0, -1).join(' ') || '';
            const lastName = nameParts[nameParts.length - 1] || '';
            const experienceMatch = advisorDetail.experience.match(/(\d+)/);
            const yearsExperience = experienceMatch ? parseInt(experienceMatch[1]) : 0;

            setFormData({
                firstName,
                lastName,
                phone: advisorDetail.phone === 'Chưa cập nhật' ? '' : advisorDetail.phone,
                bio: advisorDetail.bio === 'Chưa có mô tả' ? '' : advisorDetail.bio,
                specialties: advisorDetail.specialty === 'Chưa cập nhật' ? '' : advisorDetail.specialty,
                yearsExperience,
                profilePicture: advisorDetail.avatar || '',
                availability: advisorDetail.workingHours === 'Chưa cập nhật' ? '' : advisorDetail.workingHours,
            });
        }
    }, [advisorDetail]);

    const handleSave = useCallback(() => {
        if (!advisorId || !advisorDetail) return;

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

        console.log('Sending update request:', { advisorId, updateData });

        updateAdvisorProfile.mutate(
            { advisorId, data: updateData },
            {
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    }, [advisorId, advisorDetail, formData, updateAdvisorProfile]);

    const handleFormChange = useCallback((field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const handleDeactivate = useCallback(() => {
        if (!advisorDetail || !advisorId) return;
        
        modal.confirm({
            title: 'Xác nhận tạm dừng',
            content: `Bạn có chắc chắn muốn tạm dừng hoạt động của advisor "${advisorDetail.name}"?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            okButtonProps: {
                type: 'primary',
                loading: softDeleteAdvisor.isPending,
                style: {
                    backgroundColor: 'var(--primary)',
                    borderColor: 'var(--primary)',
                    color: 'white',
                },
            },
            onOk: () => {
                return new Promise<void>((resolve, reject) => {
                    softDeleteAdvisor.mutate(advisorId, {
                        onSuccess: () => {
                            resolve();
                        },
                        onError: (error) => {
                            reject(error);
                        },
                    });
                });
            },
        });
    }, [advisorDetail, advisorId, softDeleteAdvisor, modal]);

    const handleReactivate = useCallback(() => {
        if (!advisorDetail || !advisorId) return;
        
        modal.confirm({
            title: 'Xác nhận khởi động lại',
            content: `Bạn có chắc chắn muốn khởi động lại advisor "${advisorDetail.name}"?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            okButtonProps: {
                type: 'primary',
                loading: reactivateAdvisor.isPending,
                style: {
                    backgroundColor: 'var(--primary)',
                    borderColor: 'var(--primary)',
                    color: 'white',
                },
            },
            onOk: () => {
                return new Promise<void>((resolve, reject) => {
                    reactivateAdvisor.mutate(advisorId, {
                        onSuccess: () => {
                            resolve();
                        },
                        onError: (error) => {
                            reject(error);
                        },
                    });
                });
            },
        });
    }, [advisorDetail, advisorId, reactivateAdvisor, modal]);

    if (isLoading) {
        return (
            <Card title={<span className="text text-base sm:text-lg font-semibold">Chi tiết Advisor</span>}>
                <Skeleton active paragraph={{ rows: 8 }} />
            </Card>
        );
    }

    if (isError || !advisorDetail) {
        return (
            <Card title={<span className="text text-base sm:text-lg font-semibold">Chi tiết Advisor</span>}>
                <div className="py-12 text-center text-sm text-[var(--error)]">
                    Không tìm thấy thông tin advisor. Vui lòng kiểm tra lại.
                </div>
            </Card>
        );
    }

    return (
        <Card
            title={<span className="text text-base sm:text-lg font-semibold">Chi tiết Advisor</span>}
        >
            {/* Header với Breadcrumb và Action buttons */}
            <div className="flex items-center justify-between mb-3">
                <Breadcrumb items={breadcrumbItems} />
                <Flex gap={8}>
                    {isEditing ? (
                        <>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleCancel}
                                disabled={updateAdvisorProfile.isPending}
                            >
                                <Icon name="mdi:close" />
                                Hủy
                            </Button>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={handleSave}
                                loading={updateAdvisorProfile.isPending}
                            >
                                <Icon name="mdi:content-save" />
                                Lưu thay đổi
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" onClick={handleEdit}>
                                <Icon name="mdi:pencil" />
                                Cập nhật thông tin
                            </Button>
                            {advisorDetail.isActive ? (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleDeactivate}
                                    loading={softDeleteAdvisor.isPending}
                                    disabled={softDeleteAdvisor.isPending}
                                >
                                    <Icon name="mdi:pause-circle-outline" />
                                    Tạm dừng
                                </Button>
                            ) : (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleReactivate}
                                    loading={reactivateAdvisor.isPending}
                                    disabled={reactivateAdvisor.isPending}
                                >
                                    <Icon name="mdi:play-circle-outline" />
                                    Khởi động lại
                                </Button>
                            )}
                        </>
                    )}
                </Flex>
            </div>

            <Row gutter={[24, 24]}>
                {/* Left Column - Hồ sơ Advisor */}
                <Col xs={24} lg={12}>
                    <AdvisorProfile 
                        advisorData={advisorDetail} 
                        isEditing={isEditing}
                        formData={formData}
                        onFormChange={handleFormChange}
                    />
                </Col>

                {/* Right Column - Thống kê & Thông tin chuyên môn */}
                <Col xs={24} lg={12}>
                    <Flex vertical gap={24}>
                        <AdvisorStats advisorData={advisorDetail} />
                        <AdvisorSpecialty 
                            advisorData={advisorDetail} 
                            isEditing={isEditing}
                            formData={formData}
                            onFormChange={handleFormChange}
                        />
                        <AdvisorAchievements achievements={advisorDetail.achievements?.length ? advisorDetail.achievements : []} />
                    </Flex>
                </Col>
            </Row>

            {/* Bottom Section - Quản lý khách hàng */}
            <Row gutter={[24, 24]} className="mt-6">
                <Col span={24}>
                    <ManagedClientsList clients={managedClients} />
                </Col>
            </Row>
        </Card>
    );
};

export default AdvisorDetailPage;
