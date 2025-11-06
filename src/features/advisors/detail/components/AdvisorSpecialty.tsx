import React from 'react';
import { Card, Badge, Flex, Row, Col, Input } from '@/shared/ui';
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
                </Col>

                <Col span={24}>
                    <h4 className="text-[var(--text-secondary)] mb-2">Giờ làm việc</h4>
                    <Input.TextArea value={advisorData.workingHours} readOnly rows={2} />
                </Col>
            </Row>
        </Card>
    );
};
