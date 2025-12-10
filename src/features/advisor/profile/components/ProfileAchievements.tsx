'use client';

import React from 'react';
import { Card, Flex } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { Achievement } from '@/types/advisor';

interface ProfileAchievementsProps {
    achievements: Achievement[];
}

export const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({ achievements }) => {
    return (
        <Card 
            title={
                <div className="flex items-center gap-2">
                    <Icon name="mdi:trophy-outline" size={20} className="text-[var(--primary)]" />
                    <span>Thành tích nổi bật</span>
                </div>
            }
            className="h-fit"
        >
            {achievements.length === 0 ? (
                <div className="text-center py-10">
                    <Icon name="mdi:trophy-outline" size={48} className="text-[var(--text-secondary)] mb-4 mx-auto opacity-30" />
                    <div className="text-sm text-[var(--text-secondary)] italic">
                        Chưa có thành tích được cập nhật.
                    </div>
                </div>
            ) : (
                <Flex vertical gap={3}>
                    {achievements.map((achievement, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800 hover:shadow-md transition-all hover:scale-[1.02]"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                    <Icon name="mdi:trophy" size={24} className="text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-base text-[var(--text)] mb-2">
                                    {achievement.title}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] flex-wrap">
                                    <Icon name="mdi:office-building-outline" size={16} />
                                    <span>{achievement.organization}</span>
                                    {achievement.year && (
                                        <>
                                            <span className="text-[var(--text-secondary)]/50">•</span>
                                            <Icon name="mdi:calendar-outline" size={16} />
                                            <span>{achievement.year}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </Flex>
            )}
        </Card>
    );
};
