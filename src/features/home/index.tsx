'use client';

import React from 'react';
import ChartReport from './components/ChartReport';
import QuickTask from './components/QuickTask';
import FeedbackReport from './components/FeedbackReport';
import { Col, Row } from '@/shared/ui';

const components = [
  ChartReport,
  QuickTask,
  FeedbackReport,
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