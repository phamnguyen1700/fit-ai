'use client';

import React from 'react';
import { Input } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

interface EditableProfileFieldProps {
    label: string;
    value: string;
    icon?: string;
    fullWidth?: boolean;
    isEditing: boolean;
    fieldName: string;
    onChange: (field: string, value: string) => void;
    multiline?: boolean;
}

export const EditableProfileField: React.FC<EditableProfileFieldProps> = ({
    label,
    value,
    icon,
    fullWidth = false,
    isEditing,
    fieldName,
    onChange,
    multiline = false,
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
                        {isEditing ? (
                            multiline ? (
                                <Input.TextArea
                                    value={value}
                                    onChange={(e) => onChange(fieldName, e.target.value)}
                                    placeholder={`Nhập ${label.toLowerCase()}`}
                                    rows={4}
                                    className="w-full"
                                />
                            ) : (
                                <Input
                                    value={value}
                                    onChange={(e) => onChange(fieldName, e.target.value)}
                                    placeholder={`Nhập ${label.toLowerCase()}`}
                                    size="large"
                                    className="w-full"
                                />
                            )
                        ) : (
                            <div className={`text-base leading-relaxed ${isEmpty ? 'text-[var(--text-secondary)] italic' : 'text-[var(--text)] font-medium'}`}>
                                {isEmpty ? (value || 'Chưa cập nhật') : value}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
