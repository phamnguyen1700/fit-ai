'use client';

import React from 'react';
import { Card, Input } from '@/shared/ui';
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

interface ProfileInfoProps {
    phone: string;
    joinDate: string;
    experience: string;
    bio: string;
    isEditing: boolean;
    formData?: ProfileFormData;
    onFormChange?: (field: string, value: string | number) => void;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
    phone,
    joinDate,
    experience,
    bio,
    isEditing,
    formData,
    onFormChange,
}) => {
    return (
        <Card 
            title={
                <div className="flex items-center gap-2">
                    <Icon name="mdi:account-outline" size={20} className="text-[var(--primary)]" />
                    <span>Thông tin cá nhân</span>
                </div>
            }
            className="h-fit"
        >
            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                            <Icon name="mdi:phone-outline" size={20} className="text-[var(--primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">Số điện thoại</div>
                            {isEditing && formData ? (
                                <Input 
                                    value={formData.phone} 
                                    onChange={(e) => onFormChange?.('phone', e.target.value)}
                                    placeholder="Nhập số điện thoại"
                                    size="large"
                                />
                            ) : (
                                <div className="text-base text-[var(--text)] font-semibold">
                                    {phone === 'Chưa cập nhật' ? (
                                        <span className="text-[var(--text-secondary)] italic font-normal">{phone}</span>
                                    ) : (
                                        phone
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                            <Icon name="mdi:calendar-outline" size={20} className="text-[var(--primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">Ngày tham gia</div>
                            <div className="text-base text-[var(--text)] font-semibold">{joinDate}</div>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                            <Icon name="mdi:briefcase-outline" size={20} className="text-[var(--primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">Kinh nghiệm</div>
                            {isEditing && formData ? (
                                <Input 
                                    type="number"
                                    value={formData.yearsExperience}
                                    onChange={(e) => onFormChange?.('yearsExperience', parseInt(e.target.value) || 0)}
                                    placeholder="Số năm kinh nghiệm"
                                    min={0}
                                    suffix="năm"
                                    size="large"
                                />
                            ) : (
                                <div className="text-base text-[var(--text)] font-semibold">
                                    {experience === 'Chưa cập nhật' ? (
                                        <span className="text-[var(--text-secondary)] italic font-normal">{experience}</span>
                                    ) : (
                                        experience
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                            <Icon name="mdi:text-box-outline" size={20} className="text-[var(--primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">Giới thiệu</div>
                            {isEditing && formData ? (
                                <Input.TextArea 
                                    value={formData.bio} 
                                    onChange={(e) => onFormChange?.('bio', e.target.value)}
                                    placeholder="Viết giới thiệu về bản thân..."
                                    rows={4}
                                    size="large"
                                />
                            ) : (
                                <div className="text-base text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                                    {bio === 'Chưa có mô tả' ? (
                                        <span className="text-[var(--text-secondary)] italic">{bio}</span>
                                    ) : (
                                        bio
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
