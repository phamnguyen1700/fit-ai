'use client';

import React from 'react';
import QuickReportTable from './components/QuickReportTable';
import ChartReport from './components/ChartReport';
import QuickTask from './components/QuickTask';
import FeedbackReport from './components/FeedbackReport';
import NewPaidReport from './components/NewPaidReport';
import { Col, Row } from '@/shared/ui';

const components = [
  QuickReportTable,
  ChartReport,
  QuickTask,
  FeedbackReport,
  NewPaidReport,
];

export default function HomePage() {
  return (
    <Row gutter={[0, 16]}> 
      {components.map((Comp, idx) => (
        <Col span={24} key={idx}>
          <Comp />
        </Col>
      ))}
    </Row>
  );
}