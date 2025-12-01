'use client';

import React from 'react';
import { Row, Col } from '@/shared/ui';
import { AIPlansStats, AIPlansList } from './components';

export function AdvisorAIPlans() {
  return (
    <Row gutter={[0, 16]}>
      {/* Statistics */}
      <Col span={24}>
        <AIPlansStats />
      </Col>
      
      {/* AI Plans List */}
      <Col span={24}>
        <AIPlansList />
      </Col>
    </Row>
  );
}
