import React from 'react';
import { Card, Row, Col } from '@/shared/ui';

interface AdvisorStatsProps {
    advisorData: {
        totalClients: number;
        activeClients: number;
        rating: number;
    };
}

export const AdvisorStats: React.FC<AdvisorStatsProps> = ({ advisorData }) => {
    return (
        <Card title="Thống kê" className="h-fit">
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="text-4xl font-bold text-[var(--primary)] mb-2">
                            {advisorData.totalClients}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                            Tổng khách hàng
                        </div>
                    </div>
                </Col>

                <Col xs={24} sm={8}>
                    <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="text-4xl font-bold text-[#52c41a] mb-2">
                            {advisorData.activeClients}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                            Đang theo dõi
                        </div>
                    </div>
                </Col>

                <Col xs={24} sm={8}>
                    <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="text-4xl font-bold text-[var(--primary)] mb-2">
                            {advisorData.rating} ⭐
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                            Đánh giá
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};
