import React from 'react';
import { Card, Flex } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

interface Achievement {
    year: string;
    title: string;
    organization: string;
}

interface AdvisorAchievementsProps {
    achievements: Achievement[];
}

export const AdvisorAchievements: React.FC<AdvisorAchievementsProps> = ({ achievements }) => {
    return (
        <Card title="Thành tích nổi bật" className="h-fit">
            {achievements.length === 0 ? (
                <div className="text-sm text-[var(--text-secondary)]">
                    Chưa có thành tích được cập nhật.
                </div>
            ) : (
                <Flex vertical gap={12}>
                    {achievements.map((achievement, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg"
                        >
                            <Icon name="mdi:trophy-outline" size={24} className="text-[var(--primary)]" />
                            <div>
                                <div className="font-semibold text-[var(--text)]">
                                    {achievement.title}
                                </div>
                                <div className="text-sm text-[var(--text-secondary)]">
                                    {achievement.organization} • {achievement.year}
                                </div>
                            </div>
                        </div>
                    ))}
                </Flex>
            )}
        </Card>
    );
};
