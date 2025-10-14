'use client';

import React from 'react';
import { UserDetailPage } from '@/features/users/detail';

interface UserProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const resolvedParams = React.use(params);
  return <UserDetailPage userId={resolvedParams.id} />;
}
