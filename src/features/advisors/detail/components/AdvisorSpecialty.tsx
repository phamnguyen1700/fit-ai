import React from 'react';
import { Card, Flex, Row, Col, Input } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

interface AdvisorSpecialtyProps {
    advisorData: {
        certifications: string[];
        workingHours: string;
        specialty?: string;
    };
    isEditing?: boolean;
    formData?: {
        specialties: string;
        availability: string;
    };
    onFormChange?: (field: string, value: string) => void;
}

export const AdvisorSpecialty: React.FC<AdvisorSpecialtyProps> = ({ 
    advisorData, 
    isEditing = false,
    formData,
    onFormChange 
}) => {
    return (
        <Card title="Chuyên môn" className="h-fit">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <h4 className="text-[var(--text-secondary)] mb-2">Lĩnh vực chuyên môn:</h4>
                    {isEditing && formData ? (
                        <Input
                            value={formData.specialties}
                            onChange={(e) => onFormChange?.('specialties', e.target.value)}
                            placeholder="VD: Fitness, Nutrition, Yoga"
                        />
                    ) : (
                        <div className="text-sm text-[var(--text)]">
                            {advisorData.specialty || 'Chưa cập nhật'}
                        </div>
                    )}
                </Col>

                <Col span={24}>
                    <h4 className="text-[var(--text-secondary)] mb-2">Tình trạng khả dụng:</h4>
                    {isEditing && formData ? (
                        <Input
                            value={formData.availability}
                            onChange={(e) => onFormChange?.('availability', e.target.value)}
                            placeholder="VD: Available, Busy, Offline"
                        />
                    ) : (
                        <div className="text-sm text-[var(--text)]">
                            {advisorData.workingHours || 'Chưa cập nhật'}
                        </div>
                    )}
                </Col>

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
