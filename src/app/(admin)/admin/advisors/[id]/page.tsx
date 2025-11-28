'use client';

import React from 'react';
import { AdvisorDetailPage } from '@/features/advisors/detail';

interface AdvisorProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdvisorProfilePage({ params }: AdvisorProfilePageProps) {
  const resolvedParams = React.use(params);
  return <AdvisorDetailPage advisorId={resolvedParams.id} />;
}
