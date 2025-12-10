'use client';

import React from 'react';
import { Card, Input, Flex } from '@/shared/ui';
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

interface ProfileSpecialtyProps {
    specialty: string;
    workingHours: string;
    certifications: string[];
    isEditing: boolean;
    formData?: ProfileFormData;
    onFormChange?: (field: string, value: string) => void;
}

export const ProfileSpecialty: React.FC<ProfileSpecialtyProps> = ({
    specialty,
    workingHours,
    certifications,
    isEditing,
    formData,
    onFormChange,
}) => {
    return (
        <Card 
            title={
                <div className="flex items-center gap-2">
                    <Icon name="mdi:certificate" size={20} className="text-[var(--primary)]" />
                    <span>Chuyên môn</span>
                </div>
            }
            className="h-fit"
        >
            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                            <Icon name="mdi:briefcase-variant" size={20} className="text-[var(--primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">Lĩnh vực chuyên môn</div>
                            {isEditing && formData ? (
                                <Input
                                    value={formData.specialties}
                                    onChange={(e) => onFormChange?.('specialties', e.target.value)}
                                    placeholder="VD: Fitness, Nutrition, Yoga"
                                    size="large"
                                />
                            ) : (
                                <div className="text-base text-[var(--text)] font-semibold">
                                    {specialty === 'Chưa cập nhật' ? (
                                        <span className="text-[var(--text-secondary)] italic font-normal">{specialty}</span>
                                    ) : (
                                        specialty
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                            <Icon name="mdi:clock-outline" size={20} className="text-[var(--primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">Thời gian làm việc</div>
                            {isEditing && formData ? (
                                <Input
                                    value={formData.availability}
                                    onChange={(e) => onFormChange?.('availability', e.target.value)}
                                    placeholder="VD: Thứ 2 - Thứ 6, 9:00 - 18:00"
                                    size="large"
                                />
                            ) : (
                                <div className="text-base text-[var(--text)] font-semibold">
                                    {workingHours === 'Chưa cập nhật' ? (
                                        <span className="text-[var(--text-secondary)] italic font-normal">{workingHours}</span>
                                    ) : (
                                        workingHours
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <div className="flex items-start gap-4 mb-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                            <Icon name="mdi:certificate-outline" size={20} className="text-[var(--primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">Chứng chỉ</div>
                        </div>
                    </div>
                    {certifications.length === 0 ? (
                        <div className="text-sm text-[var(--text-secondary)] italic pl-14">
                            Chưa cập nhật chứng chỉ.
                        </div>
                    ) : (
                        <Flex vertical gap={3} className="pl-14">
                            {certifications.map((cert, index) => {
                                // Extract filename from path if it's a file path
                                const getDisplayName = (certPath: string) => {
                                    // If it looks like a file path, extract just the filename
                                    if (certPath.includes('/')) {
                                        const parts = certPath.split('/');
                                        const filename = parts[parts.length - 1];
                                        // Remove duplicate filename if present
                                        return filename.replace(/\.pdf\/.*$/, '');
                                    }
                                    return certPath;
                                };

                                const displayName = getDisplayName(cert);
                                const isUrl = cert.startsWith('http') || cert.startsWith('/');

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 bg-white dark:bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)] hover:shadow-sm transition-shadow"
                                    >
                                        <Icon name="mdi:certificate-outline" size={20} className="text-[var(--primary)] flex-shrink-0" />
                                        {isUrl ? (
                                            <a 
                                                href={cert} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-[var(--primary)] font-medium hover:underline truncate flex-1"
                                            >
                                                {displayName}
                                            </a>
                                        ) : (
                                            <span className="text-sm text-[var(--text)] font-medium truncate flex-1">{displayName}</span>
                                        )}
                                        {isUrl && (
                                            <Icon name="mdi:open-in-new" size={16} className="text-[var(--text-secondary)] flex-shrink-0" />
                                        )}
                                    </div>
                                );
                            })}
                        </Flex>
                    )}
                </div>
            </div>
        </Card>
    );
};
