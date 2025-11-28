'use client';

import React from 'react';
import { Card, Row, Col, Segmented } from '@/shared/ui';
import { PaidCard } from '@/shared/ui';

type Period = 'paid' | 'pending' | 'refund';

const list = [
    {
        avatarUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e',
        customerName: 'Nguyen Van A',
        planLabel: '1 tháng Premium',
        dateTime: '10/09/2025 – 09:30 AM',
        statusText: 'Thành công',
        amount: '₫199.000',
        email: 'nguyenvana@example.com',
        expiredAt: '10/10/2025 – 09:30 AM',
    },
    {
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        customerName: 'Tran Thi B',
        planLabel: '3 tháng Premium',
        dateTime: '11/09/2025 – 02:15 PM',
        statusText: 'Thành công',
        amount: '₫499.000',
        email: 'tranthib@example.com',
        expiredAt: '11/12/2025 – 02:15 PM',
    },
    {
        avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
        customerName: 'Le Van C',
        planLabel: '6 tháng Premium',
        dateTime: '12/09/2025 – 07:45 PM',
        statusText: 'Thành công',
        amount: '₫899.000',
        email: 'levanc@example.com',
        expiredAt: '12/03/2026 – 07:45 PM',
    },
    {
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
        customerName: 'Pham Thi D',
        planLabel: '12 tháng Premium',
        dateTime: '13/09/2025 – 11:20 AM',
        statusText: 'Thành công',
        amount: '₫1.499.000',
        email: 'phamthid@example.com',
        expiredAt: '13/09/2026 – 11:20 AM',
    },
];


export const NewPaidReport: React.FC = () => {
    const [period, setPeriod] = React.useState<Period>('paid');

    return (
        <Card
            className="new-paid-report-card rounded-xl"
            title={<span className="text text-base sm:text-lg font-semibold">Mới thanh toán</span>}
            extra={
                <Segmented
                    size="small"
                    value={period}
                    onChange={(v) => setPeriod(v as Period)}
                    options={[{ label: 'Đã thanh toán', value: 'paid' }, { label: 'Chờ', value: 'pending' }, { label: 'Hoàn', value: 'refund' }]}
                />
            }
        >
            <Row gutter={[12, 12]}>
                {list.map((it, idx) => (
                    <Col xs={24} key={idx}>
                        <div className="flex items-center justify-between gap-3 pl-5 rounded-xl bg-[var(--bg)] border border-[var(--border)]" style={{ borderLeft: '7px solid var(--success)' }}>
                            <div className="flex items-center gap-3">
                                <PaidCard {...it} className="!bg-transparent !border-0 p-0" />
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default NewPaidReport;


