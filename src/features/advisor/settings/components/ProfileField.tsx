'use client';

import React from 'react';
import { Icon } from '@/shared/ui/icon';

interface ProfileFieldProps {
    label: string;
    value: string;
    icon?: string;
    fullWidth?: boolean;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({
    label,
    value,
    icon,
    fullWidth = false,
}) => {
    const isEmpty = !value || value === 'Chưa cập nhật' || value === 'Chưa có mô tả';
    
    return (
        <div className={fullWidth ? 'w-full' : 'w-full sm:flex-1'}>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-sm transition-all duration-200 h-full">
                <div className="flex items-start gap-3">
                    {icon && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                            <Icon name={icon} size={18} className="text-[var(--primary)]" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                            {label}
                        </div>
                        <div className={`text-base leading-relaxed ${isEmpty ? 'text-[var(--text-secondary)] italic' : 'text-[var(--text)] font-medium'}`}>
                            {isEmpty ? (value || 'Chưa cập nhật') : value}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
