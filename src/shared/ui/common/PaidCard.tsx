import React from 'react';
import { Flex, Button } from '@/shared/ui';
import { Avatar } from '@/shared/ui';
import { Icon, icons } from '@/shared/ui/icon';

export interface PaidCardProps {
    avatarUrl: string;
    customerName: string;
    dateTime: string;          // e.g., '09/09/2025 – 10:45 AM'
    planLabel: string;         // e.g., '3 tháng Premium'
    statusText: string;        // e.g., 'Thành công'
    email?: string;
    amount?: string;           // formatted currency
    expiredAt?: string;        // e.g., '09/11/2025 – 10:45 AM'
    className?: string;
}

export const PaidCard: React.FC<PaidCardProps> = ({
    avatarUrl,
    customerName,
    dateTime,
    planLabel,
    statusText,
    email,
    amount,
    expiredAt,
}) => {
    const [open, setOpen] = React.useState(false);

    const onClickExtend = () => {
        console.log('clicked extend, before toggle:', open);
        setOpen(v => !v);
    };

    return (
        <Flex
            align="center"
            justify="space-between"   // thêm dòng này để đẩy nút sang phải
            wrap="wrap"
            style={{ width: '100%', gap: 8, padding: 10 }}
        >            <Avatar
            size={96}
            src={avatarUrl}
            style={{ background: avatarUrl ? undefined : 'var(--primary)' }}
        >
                {!avatarUrl && customerName?.[0]?.toUpperCase?.()}
            </Avatar>
            <Flex align="flex-start" gap={12} style={{ gap: 12 }}>
                <div className="grid grid-cols-[140px_auto] gap-x-6 text-sm flex-1 min-w-[260px]">
                    <div className="text font-semibold leading-tight">{customerName}</div>
                    <div></div>
                    <div className="text-secondary">Ngày/Giờ:</div>
                    <div className='text-secondary'>{dateTime ?? '-'}</div>
                    <div className="text-secondary">Gói dịch vụ:</div>
                    <div className="text text-secondary">{planLabel ?? '-'}</div>
                    <div className="text-secondary">Trạng thái:</div>
                    <div style={{ color: 'var(--success)' }}>{statusText ?? '-'}</div>

                    {open && (
                        <>
                            {amount && <div className="text-secondary">Số tiền:</div>}
                            {amount && <div className="text text-secondary">{amount}</div>}
                            {email && <div className="text-secondary">Email:</div>}
                            {email && <div className='text-secondary'>{email}</div>}
                            {expiredAt && <div className="text-secondary">Thời hạn:</div>}
                            {expiredAt && <div className='text-secondary'>{expiredAt}</div>}
                        </>
                    )}
                </div>
            </Flex>
            <div style={{ position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)' }}>
                <Button
                    variant="text"
                    aria-label={open ? 'collapse' : 'expand'}
                    onClick={onClickExtend}
                    className={`expand-toggle ${open ? 'is-open' : ''}`} // thêm class is-open nếu đang mở
                    >
                    <Icon name={open ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                </Button>
            </div>
        </Flex>
    );
};

export default PaidCard;


