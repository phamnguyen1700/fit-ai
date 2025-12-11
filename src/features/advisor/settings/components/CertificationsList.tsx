'use client';

import React from 'react';
import { Icon } from '@/shared/ui/icon';

interface CertificationsListProps {
    certifications: string[];
}

export const CertificationsList: React.FC<CertificationsListProps> = ({
    certifications,
}) => {
    if (!certifications || certifications.length === 0) {
        return null;
    }

    // Extract filename from path if it's a file path
    const getDisplayName = (cert: string): string => {
        // If it looks like a file path, extract the filename
        if (cert.includes('/')) {
            const parts = cert.split('/');
            const filename = parts[parts.length - 1];
            // Remove file extension if present
            return filename.split('.')[0] || filename;
        }
        return cert;
    };

    return (
        <div className="w-full">
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-sm transition-all duration-200">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                        <Icon name="mdi:certificate-outline" size={18} className="text-[var(--primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wide">
                            Chứng chỉ
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {certifications.map((cert, index) => {
                                const displayName = getDisplayName(cert);
                                return (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                                        style={{
                                            backgroundColor: 'var(--primary)',
                                            color: 'white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        <Icon name="mdi:certificate" size={14} />
                                        <span className="max-w-[200px] truncate">{displayName}</span>
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
