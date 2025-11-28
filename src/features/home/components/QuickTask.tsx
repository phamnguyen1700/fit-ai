'use client';

import React from 'react';
import { Card, SearchInput } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

type QuickAction = {
    key: string;
    icon?: React.ReactNode;
    label: string;
    onClick?: () => void;
};

const actions: QuickAction[] = [
    { key: 'menu', label: 'Thêm thực đơn', icon: <Icon name="mdi:plus" /> },
    { key: 'exercise', label: 'Thêm bài tập', icon: <Icon name="mdi:plus" /> },
    { key: 'feedback', label: 'Duyệt feedback', icon: <Icon name="mdi:check-circle-outline" /> },
];

export const QuickTask: React.FC = () => {
    return (
        <Card
            className="rounded-xl"
            title={<span className="text text-base sm:text-lg font-semibold">Hoạt động gần đây</span>}
        >
            <div className="mb-2">
                <SearchInput />
            </div>

            <div
                className="rounded-xl p-4 sm:p-5"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url('https://images.unsplash.com/photo-1502904550040-7534597429ae')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="text text-base font-semibold mb-3" style={{ color: 'white' }}>Tác vụ nhanh</div>
                <div className="flex flex-col gap-3">
                    {actions.map((a) => (
                        <button
                            key={a.key}
                            onClick={a.onClick}
                            className="w-full text-left rounded-[12px] border border-[var(--border)] bg-white hover:border-[var(--primary)] transition-colors px-4 py-1 flex items-center gap-3"
                        >
                            <span
                                className="inline-flex h-6 w-6 items-center justify-center"
                                style={{
                                    color: "black", 
                                }}
                            >
                                {a.icon}
                            </span>
                            <span className="text-black">{a.label}</span>
                        </button>

                    ))}
                </div>
            </div>
        </Card>
    );
};

export default QuickTask;


