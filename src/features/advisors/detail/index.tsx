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
import { AdvisorDetail, Achievement, AdvisorCustomer } from '@/types/advisor';
import { Skeleton, App } from 'antd';
import toast from 'react-hot-toast';

const resolveAvatarUrl = (avatar?: string) => {
    if (!avatar) return undefined;
    
    // Nếu đã là full URL (http/https), xử lý và trả về
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        // Kiểm tra và sửa lỗi duplicate filename trong path bằng regex
        // Pattern: .../filename.ext/filename.ext?query -> .../filename.ext?query
        // Sử dụng regex để tránh làm hỏng query parameters khi parse URL
        const duplicatePattern = /(\/[^\/]+\.(jpg|jpeg|png|gif|webp))\/\1(\?|$)/i;
        
        if (duplicatePattern.test(avatar)) {
            // Loại bỏ duplicate filename trong path
            const fixedPath = avatar.replace(duplicatePattern, '$1$3');
            console.log('Fixed duplicate filename in avatar URL:', { original: avatar, fixed: fixedPath });
            return fixedPath;
        }
        
        // Log để debug
        console.log('Avatar URL:', avatar);
        return avatar;
    }
    
    // Nếu là relative path, resolve với base URL
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
    const normalized = avatar.replace(/^\/+/, '');
    const resolved = base ? `${base}/${normalized}` : avatar;
    return resolved;
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
    const rawSpecialties = advisor.specialties as string[] | string | undefined;
    const specialtiesArray = Array.isArray(rawSpecialties)
        ? rawSpecialties
        : typeof rawSpecialties === 'string'
        ? rawSpecialties.split(',').map((item: string) => item.trim()).filter(Boolean)
        : [];
    const customers = advisor.customers ?? [];
    const activeCustomers = customers.filter((customer) => customer.subscriptionStatus === 'Active').length;
    const totalCustomers =
        typeof advisor.totalCustomers === 'number' ? advisor.totalCustomers : customers.length;

    return {
        id: advisor.id,
        name: fullName || advisor.email,
        email: advisor.email,
        phone: advisor.phone || 'Chưa cập nhật',
        avatar: resolveAvatarUrl(advisor.profilePicture) || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
        specialty: specialtiesArray.length ? specialtiesArray.join(', ') : 'Chưa cập nhật',
        experience: typeof advisor.yearsExperience === 'number' ? `${advisor.yearsExperience} năm` : 'Chưa cập nhật',
        rating: typeof advisor.rating === 'number' ? advisor.rating : 0,
        totalClients: totalCustomers,
        activeClients: activeCustomers,
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

    const advisorData = data?.data as AdvisorDetail | undefined;
    const advisorDetail = useMemo(() => mapAdvisorDetailToProfile(advisorData), [advisorData]);
    const advisorCustomers = useMemo<AdvisorCustomer[]>(() => advisorData?.customers ?? [], [advisorData]);

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
                    <ManagedClientsList clients={advisorCustomers} />
                </Col>
            </Row>
        </Card>
    );
};

export default AdvisorDetailPage;
