'use client';
import React from 'react';
import Header from './components/header';
import FeedbackCards from './components/FeedbackCards';

export default function FeedbackPage() {
  return (
    <div className="bg-white min-h-screen p-6 rounded-lg shadow-sm">
      <Header />
      <div style={{ marginTop: '16px' }}>
      <FeedbackCards />
      </div>
      </div>
  );
}


