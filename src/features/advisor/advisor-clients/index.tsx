'use client';

import React from 'react';
import { Col, Row } from '@/shared/ui';
import ClientsTable from './components/ClientsTable';
import ClientsFilter from './components/ClientsFilter';

export function AdvisorClients() {
  return (
    <Row gutter={[0, 16]}>
      {/* Filters */}
      <Col span={24}>
        <ClientsFilter />
      </Col>
      
      {/* Clients Table */}
      <Col span={24}>
        <ClientsTable />
      </Col>
    </Row>
  );
}
