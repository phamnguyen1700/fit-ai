'use client';

import React, { useState } from 'react';
import { LoginModal } from '@/shared/ui/layout/marketing/components/LoginModal';
import Header from './components/Header';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
