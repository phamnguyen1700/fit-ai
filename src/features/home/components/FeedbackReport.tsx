'use client';

import React from 'react';
import { Card, Row, Col, Segmented } from '@/shared/ui';
import { FeedbackCard } from '@/shared/ui';

type Period = 'day' | 'month' | 'year';

const fakeList = [
  {
    name: 'Annette Black',
    role: 'Graphic Designer',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    rating: 5,
    content:
      "I’ve used other kits, but this one is the best. The attention to detail and usability are truly amazing.",
  },
  {
    name: 'Guy Hawkins',
    role: 'Graphic Designer',
    avatarUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c',
    rating: 4,
    content:
      "Great quality and polish. The design system speeds up our workflow a lot.",
  },
  {
    name: 'Albert Flores',
    role: 'Graphic Designer',
    avatarUrl: 'https://images.unsplash.com/photo-1545996124-0501ebae84d3',
    rating: 4,
    content:
      "Clean and easy to use. The components are thoughtfully crafted.",
  },
];

export const FeedbackReport: React.FC = () => {
  const [period, setPeriod] = React.useState<Period>('day');

  return (
    <Card
      className="rounded-xl"
      title={<span className="text text-base sm:text-lg font-semibold">Feedback mới</span>}
      extra={
        <Segmented
          size="small"
          value={period}
          onChange={(v) => setPeriod(v as Period)}
          options={[{ label: 'Ngày', value: 'day' }, { label: 'Tháng', value: 'month' }, { label: 'Năm', value: 'year' }]}
        />
      }
    >
      <Row gutter={[16, 16]}>
        {fakeList.concat(fakeList).map((fb, idx) => (
          <Col key={idx} xs={24} md={12}>
            <FeedbackCard {...fb} />
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default FeedbackReport;


