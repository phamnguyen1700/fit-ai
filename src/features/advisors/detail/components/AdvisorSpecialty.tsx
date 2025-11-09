import React from 'react';
import { Card, Flex, Row, Col } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

interface AdvisorSpecialtyProps {
    advisorData: {
        certifications: string[];
        workingHours: string;
    };
}

export const AdvisorSpecialty: React.FC<AdvisorSpecialtyProps> = ({ advisorData }) => {
    return (
        <Card title="Chứng chỉ" className="h-fit">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <h4 className="text-[var(--text-secondary)] mb-2">Chứng chỉ</h4>
                    {advisorData.certifications.length === 0 ? (
                        <div className="text-sm text-[var(--text-secondary)]">Chưa cập nhật chứng chỉ.</div>
                    ) : (
                        <Flex vertical gap={8}>
                            {advisorData.certifications.map((cert, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] rounded"
                                >
                                    <Icon name="mdi:certificate-outline" className="text-[var(--primary)]" />
                                    <span className="text-[var(--text)]">{cert}</span>
                                </div>
                            ))}
                        </Flex>
                    )}
                </Col>
            </Row>
        </Card>
    );
};
