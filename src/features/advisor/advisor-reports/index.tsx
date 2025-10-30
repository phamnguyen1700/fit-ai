'use client';

import React from 'react';
import { Col, Row } from '@/shared/ui';
import ReportsOverview from './components/ReportsOverview';
import PerformanceChart from './components/PerformanceChart';
import ClientProgressTable from './components/ClientProgressTable';

export function AdvisorReports() {
  return (
    <Row gutter={[0, 16]}>
      {/* Reports Overview */}
      <Col span={24}>
        <ReportsOverview />
      </Col>
      
      {/* Performance Chart */}
      <Col span={24}>
        <PerformanceChart />
      </Col>
      
      {/* Client Progress Table */}
      <Col span={24}>
        <ClientProgressTable />
      </Col>
    </Row>
  );
}
