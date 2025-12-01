'use client';

import React from 'react';
import { Col, Row } from '@/shared/ui';
import ClientsStats from './components/ClientsStats';
import ClientsMonthView from './components/ClientsMonthView';


export function AdvisorClients() {
  return (
    <Row gutter={[0, 16]}>
      {/* Statistics */}
      <Col span={24}>
        <ClientsStats />
      </Col>
      
      {/* Clients Grid */}
      <Col span={24}>
        <ClientsMonthView />
      </Col>
    </Row>
  );
}
