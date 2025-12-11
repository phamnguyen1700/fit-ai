'use client';

import React, { useRef, useState } from 'react';
import { Avatar, Flex, Button } from '@/shared/ui';
import { Icon, icons } from '@/shared/ui/icon';
import { useUploadAdvisorProfilePicture } from '@/tanstack/hooks/advisor';
import { useAuthStore } from '@/stores/stores';

interface ProfileHeaderProps {
    name: string;
    email: string;
    phone: string;
    avatar: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    name,
    email,
    phone,
    avatar,
}) => {
    const { user } = useAuthStore();
    const advisorId = user?.id;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const uploadAvatar = useUploadAdvisorProfilePicture();

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Kích thước file không được vượt quá 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        if (advisorId) {
            uploadAvatar.mutate(
                { advisorId, file },
                {
                    onSuccess: () => {
                        setPreviewAvatar(null);
                    },
                    onError: () => {
                        setPreviewAvatar(null);
                    },
                }
            );
        }
    };

    const displayAvatar = previewAvatar || avatar;

    // Debug: log avatar URL để kiểm tra
    React.useEffect(() => {
        if (displayAvatar && displayAvatar !== previewAvatar) {
            console.log('Avatar URL:', displayAvatar);
        }
    }, [displayAvatar, previewAvatar]);

    return (
        <div className="flex items-start gap-6 pb-8 border-b border-[var(--border)]">
            <div className="relative flex-shrink-0">
                {displayAvatar ? (
                    <Avatar 
                        key={displayAvatar} 
                        size={100} 
                        src={displayAvatar}
                        className="border-3 border-[var(--primary)]/20 shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={handleAvatarClick}
                    >
                        {name[0]?.toUpperCase()}
                    </Avatar>
                ) : (
                    <Avatar 
                        size={100} 
                        className="border-3 border-[var(--primary)]/20 shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={handleAvatarClick}
                    >
                        {name[0]?.toUpperCase()}
                    </Avatar>
                )}
                <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={uploadAvatar.isPending}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Đổi ảnh đại diện"
                >
                    {uploadAvatar.isPending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Icon name="mdi:camera" size={16} />
                    )}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-[var(--text)] mb-3">
                    {name}
                </h2>
                <div className="space-y-2.5">
                    <Flex align="center" gap={10} className="text-sm">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                            <Icon name={icons.email} size={16} className="text-[var(--primary)]" />
                        </div>
                        <span className="text-[var(--text-secondary)] truncate">{email}</span>
                    </Flex>
                    <Flex align="center" gap={10} className="text-sm">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                            <Icon name={icons.phone} size={16} className="text-[var(--primary)]" />
                        </div>
                        <span className="text-[var(--text-secondary)] truncate">{phone}</span>
                    </Flex>
                </div>
            </div>
        </div>
    );
};
