import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../core/Card';
import { Avatar } from '../core/Avatar';
import { Flex } from '../core/Flex';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Icon } from '../../ui/icon';

export interface AdvisorCardProps {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    specialty: string; // Chuyên môn
    experience: string; // Kinh nghiệm
    clients: number; // Số lượng khách hàng
    rating: number; // Đánh giá (0-5)
    statusLabel: string; // Trạng thái: Hoạt động, Tạm nghỉ, etc.
    onMenuClick?: (key: string, advisorId: string) => void;
}

export const AdvisorCard: React.FC<AdvisorCardProps> = ({
    id,
    name,
    email,
    phone,
    avatarUrl,
    specialty,
    experience,
    clients,
    rating,
    statusLabel,
    onMenuClick,
}) => {
    const router = useRouter();
    
    const handleMenuClick = (key: string) => {
        const advisorId = id || '1';
        
        switch (key) {
            case 'detail':
                router.push(`/admin/advisors/${advisorId}`);
                break;
            case 'edit':
                console.log('Edit advisor:', advisorId);
                break;
            case 'delete':
                console.log('Delete advisor:', advisorId);
                break;
            case 'deactivate':
                console.log('Deactivate advisor:', advisorId);
                break;
            default:
                break;
        }
        
        onMenuClick?.(key, advisorId);
    };

    const items: MenuProps['items'] = [
        { key: 'detail', label: 'Xem chi tiết' },
        { key: 'edit', label: 'Chỉnh sửa' },
        { key: 'deactivate', label: 'Tạm dừng hoạt động' },
        { key: 'delete', label: 'Xoá advisor' },
    ];

    const getStatusColor = () => {
        switch (statusLabel.toLowerCase()) {
            case 'hoạt động':
                return 'var(--success)';
            case 'tạm nghỉ':
                return '#fa8c16';
            case 'ngưng hoạt động':
                return 'var(--error)';
            default:
                return 'var(--text-secondary)';
        }
    };

    return (
        <Card
            className="advisor-card"
            style={{ borderRadius: 12 }}
        >
            <div className="flex flex-col gap-4">
                <Flex align="center" justify="space-between">
                    <Flex align="center" gap={12}>
                        <Avatar size={48} src={avatarUrl}>
                            {name?.[0]}
                        </Avatar>
                        <div>
                            <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{name}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{email}</div>
                            {phone && <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{phone}</div>}
                        </div>
                    </Flex>
                    <Dropdown
                        trigger={['click']}
                        menu={{ items, onClick: (info) => handleMenuClick(info.key) }}
                    >
                        <button className="advisor-filter-more h-6 w-6 grid place-items-center rounded-md border border-[var(--border)] hover:bg-[var(--bg-tertiary)]">
                            <Icon name="mdi:dots-vertical" />
                        </button>
                    </Dropdown>
                </Flex>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                    <div style={{ color: 'var(--text-secondary)' }}>Chuyên môn:</div>
                    <div className="md:col-span-3 text-right" style={{ color: '#fa8c16', fontWeight: 600 }}>{specialty}</div>

                    <div style={{ color: 'var(--text-secondary)' }}>Kinh nghiệm:</div>
                    <div className="md:col-span-3 text-right" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{experience}</div>

                    <div style={{ color: 'var(--text-secondary)' }}>Số khách hàng:</div>
                    <div className="md:col-span-3 text-right" style={{ color: 'var(--primary)', fontWeight: 600 }}>{clients} người</div>

                    <div style={{ color: 'var(--text-secondary)' }}>Đánh giá:</div>
                    <div className="md:col-span-3 text-right" style={{ color: '#fa8c16', fontWeight: 600 }}>
                        ⭐ {rating.toFixed(1)}/5
                    </div>

                    <div style={{ color: 'var(--text-secondary)' }}>Trạng thái:</div>
                    <div className="md:col-span-3 text-right" style={{ color: getStatusColor(), fontWeight: 600 }}>{statusLabel}</div>
                </div>
            </div>
        </Card>
    );
};

export default AdvisorCard;
