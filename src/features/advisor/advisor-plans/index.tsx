'use client';

import React from 'react';
import { Col, Row } from '@/shared/ui';
import PlansTable from './components/PlansTable';
import PlansStats from './components/PlansStats';

export function AdvisorPlans() {
  return (
    <Row gutter={[0, 16]}>
      {/* Plans Statistics */}
      <Col span={24}>
        <PlansStats />
      </Col>
      
      {/* Plans Table */}
      <Col span={24}>
        <PlansTable />
      </Col>
    </Row>
  );
}
