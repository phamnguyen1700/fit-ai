'use client';

import React from 'react';
import { Col, Row } from '@/shared/ui';
import DashboardStats from './components/DashboardStats';
import RecentClients from './components/RecentClients';
import UpcomingSessions from './components/UpcomingSessions';

export function AdvisorDashboard() {
  return (
    <Row gutter={[0, 16]}>
      {/* Dashboard Statistics */}
      <Col span={24}>
        <DashboardStats />
      </Col>
      
      {/* Recent Clients */}
      <Col span={24}>
        <RecentClients />
      </Col>
      
      {/* Upcoming Sessions */}
      <Col span={24}>
        <UpcomingSessions />
      </Col>
    </Row>
  );
}
