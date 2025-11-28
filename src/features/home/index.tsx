'use client';

import React from 'react';
import QuickReportTable from './components/QuickReportTable';
import ChartReport from './components/ChartReport';
import QuickTask from './components/QuickTask';
import FeedbackReport from './components/FeedbackReport';
import NewPaidReport from './components/NewPaidReport';
import NewUserTable from './components/NewUserTable';
import { Col, Row } from '@/shared/ui';

// Fake data for users - Expanded for pagination testing
const fakeUsers = [
  {
    id: '1',
    name: 'Jane Cooper',
    email: 'nathan.roberts@example.com',
    registrationTime: '6 tháng',
    expirationDate: 'November 28, 2015',
    planType: 'free' as const,
  },
  {
    id: '2',
    name: 'Wade Warren',
    email: 'deanna.curtis@example.com',
    registrationTime: '5 năm',
    expirationDate: 'March 23, 2013',
    planType: 'premium' as const,
  },
  {
    id: '3',
    name: 'Cameron Williamson',
    email: 'jessica.hanson@example.com',
    registrationTime: '2 năm',
    expirationDate: 'September 24, 2017',
    planType: 'free' as const,
  },
  {
    id: '4',
    name: 'Leslie Alexander',
    email: 'tanya.hill@example.com',
    registrationTime: '1 năm',
    expirationDate: 'August 7, 2017',
    planType: 'premium' as const,
  },
  {
    id: '5',
    name: 'Ronald Richards',
    email: 'nathan.roberts@example.com',
    registrationTime: '1 năm',
    expirationDate: 'August 24, 2013',
    planType: 'free' as const,
  },
  {
    id: '6',
    name: 'Bessie Cooper',
    email: 'tanya.hill@example.com',
    registrationTime: '1 năm',
    expirationDate: 'November 16, 2014',
    planType: 'premium' as const,
  },
  {
    id: '7',
    name: 'John Doe',
    email: 'john.doe@example.com',
    registrationTime: '3 tháng',
    expirationDate: 'December 15, 2024',
    planType: 'free' as const,
  },
  {
    id: '8',
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    registrationTime: '2 năm',
    expirationDate: 'January 20, 2025',
    planType: 'premium' as const,
  },
  {
    id: '9',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    registrationTime: '4 tháng',
    expirationDate: 'February 10, 2025',
    planType: 'free' as const,
  },
  {
    id: '10',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    registrationTime: '8 tháng',
    expirationDate: 'March 5, 2025',
    planType: 'premium' as const,
  },
  {
    id: '11',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    registrationTime: '1 năm 2 tháng',
    expirationDate: 'April 15, 2025',
    planType: 'free' as const,
  },
  {
    id: '12',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    registrationTime: '6 tháng',
    expirationDate: 'May 20, 2025',
    planType: 'premium' as const,
  },
  {
    id: '13',
    name: 'David Miller',
    email: 'david.miller@example.com',
    registrationTime: '3 năm',
    expirationDate: 'June 8, 2025',
    planType: 'free' as const,
  },
  {
    id: '14',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    registrationTime: '1 năm 6 tháng',
    expirationDate: 'July 12, 2025',
    planType: 'premium' as const,
  },
  {
    id: '15',
    name: 'James Taylor',
    email: 'james.taylor@example.com',
    registrationTime: '2 tháng',
    expirationDate: 'August 25, 2025',
    planType: 'free' as const,
  },
  {
    id: '16',
    name: 'Jennifer Thomas',
    email: 'jennifer.thomas@example.com',
    registrationTime: '1 năm 8 tháng',
    expirationDate: 'September 3, 2025',
    planType: 'premium' as const,
  },
  {
    id: '17',
    name: 'Christopher Jackson',
    email: 'christopher.jackson@example.com',
    registrationTime: '5 tháng',
    expirationDate: 'October 18, 2025',
    planType: 'free' as const,
  },
  {
    id: '18',
    name: 'Amanda White',
    email: 'amanda.white@example.com',
    registrationTime: '1 năm 3 tháng',
    expirationDate: 'November 7, 2025',
    planType: 'premium' as const,
  },
  {
    id: '19',
    name: 'Matthew Harris',
    email: 'matthew.harris@example.com',
    registrationTime: '7 tháng',
    expirationDate: 'December 22, 2025',
    planType: 'free' as const,
  },
  {
    id: '20',
    name: 'Jessica Martin',
    email: 'jessica.martin@example.com',
    registrationTime: '2 năm 1 tháng',
    expirationDate: 'January 14, 2026',
    planType: 'premium' as const,
  },
];

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
      
      {/* New User Table */}
      <Col span={24}>
        <NewUserTable users={fakeUsers} />
      </Col>
    </Row>
  );
}