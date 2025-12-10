'use client';

import React from 'react';
import { Avatar, Button, Flex } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

interface ProfileHeaderProps {
    name: string;
    email: string;
    avatar: string;
    status: string;
    bio?: string;
    isEditing: boolean;
    isSaving: boolean;
    firstName?: string;
    lastName?: string;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    name,
    email,
    avatar,
    status,
    bio,
    isEditing,
    isSaving,
    firstName,
    lastName,
    onEdit,
    onCancel,
    onSave,
}) => {
    const statusColor = status === 'Hoạt động' ? '#52c41a' : '#fa8c16';
    const displayName = isEditing && firstName && lastName 
        ? `${firstName} ${lastName}`.trim() || name
        : name;

    return (
        <div className="relative">
            {/* Gradient Background */}
            <div 
                className="absolute inset-0 rounded-lg"
                style={{
                    background: 'var(--primary-light)',
                    height: '200px',
                }}
            />
            
            {/* Content */}
            <div className="relative z-10 px-6 py-8 min-h-[200px] flex flex-col">
                {/* Edit Button - Top Right */}
                <div className="absolute top-6 right-6">
                    <Flex gap={8}>
                        {isEditing ? (
                            <>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={onCancel}
                                    disabled={isSaving}
                                    className="bg-white/90 hover:bg-white"
                                >
                                    <Icon name="mdi:close" />
                                    Hủy
                                </Button>
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    onClick={onSave}
                                    loading={isSaving}
                                    className="bg-white text-[var(--primary)] hover:bg-white/90"
                                >
                                    <Icon name="mdi:content-save" />
                                    Lưu thay đổi
                                </Button>
                            </>
                        ) : (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={onEdit}
                                className="bg-white/90 hover:bg-white"
                            >
                                <Icon name="mdi:pencil" />
                                Chỉnh sửa hồ sơ
                            </Button>
                        )}
                    </Flex>
                </div>

                {/* Profile Info - Vertically Centered */}
                <Flex align="center" gap={24} className="flex-1">
                    <Avatar 
                        size={120} 
                        src={avatar}
                        className="border-4 border-white shadow-lg flex-shrink-0"
                    >
                        {displayName[0]?.toUpperCase()}
                    </Avatar>
                    <Flex vertical gap={10} className="flex-1 justify-center">
                        <h1 className="text-3xl font-bold text-white mb-0">
                            {displayName}
                        </h1>
                        <div className="flex items-center gap-3">
                            <Icon name="mdi:email-outline" size={18} color="rgba(255,255,255,0.9)" />
                            <span className="text-white/90 text-sm">{email}</span>
                        </div>
                        {bio && bio !== 'Chưa có mô tả' && (
                            <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                                {bio}
                            </p>
                        )}
                        <div
                            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full"
                            style={{
                                backgroundColor: statusColor,
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '500',
                                width: 'fit-content',
                            }}
                        >
                            {status}
                        </div>
                    </Flex>
                </Flex>
            </div>
        </div>
    );
};
