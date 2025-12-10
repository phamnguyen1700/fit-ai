'use client';

import React from 'react';
import { Card, Row, Col } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

interface ProfileStatsProps {
    totalClients: number;
    activeClients: number;
    rating: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
    totalClients,
    activeClients,
    rating,
}) => {
    return (
        <Card 
            title={
                <div className="flex items-center gap-2">
                    <Icon name="mdi:chart-line" size={20} className="text-[var(--primary)]" />
                    <span>Thống kê</span>
                </div>
            }
            className="h-fit"
        >
            <Row gutter={[12, 12]}>
                <Col xs={24} sm={8}>
                    <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Icon name="mdi:account-group" size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                            {totalClients}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wide">
                            Tổng khách hàng
                        </div>
                    </div>
                </Col>

                <Col xs={24} sm={8}>
                    <div className="text-center p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Icon name="mdi:account-check" size={24} className="text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                            {activeClients}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wide">
                            Đang theo dõi
                        </div>
                    </div>
                </Col>

                <Col xs={24} sm={8}>
                    <div className="text-center p-5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg border border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <Icon name="mdi:star" size={24} className="text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                            {rating.toFixed(1)}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wide">
                            Đánh giá
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};
