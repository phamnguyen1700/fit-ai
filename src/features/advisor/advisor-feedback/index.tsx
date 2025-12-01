'use client';

import React from 'react';
import { Row, Col } from '@/shared/ui';
import FeedbackStats from './components/FeedbackStats';
import FeedbackGrid from './components/FeedbackGrid';

export function AdvisorFeedback() {
  return (
    <Row gutter={[0, 16]}>
      {/* Statistics */}
      <Col span={24}>
        <FeedbackStats />
      </Col>
      
      {/* Feedback Grid */}
      <Col span={24}>
        <FeedbackGrid />
      </Col>
    </Row>
  );
}
