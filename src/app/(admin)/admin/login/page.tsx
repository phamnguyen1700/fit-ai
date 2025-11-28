'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect to home page - login is now handled via modal
export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, [router]);

  return null;
}
