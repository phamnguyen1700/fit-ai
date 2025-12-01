'use client';

import React from 'react';
import { Row, Col, Card, Button } from '@/shared/ui';
import { Icon, icons } from '@/shared/ui/icon';
import { useRouter } from 'next/navigation';
import ClientProfile from './components/ClientProfile';
import MealSchedule from './components/MealSchedule';
import WorkoutSchedule from './components/WorkoutSchedule';

interface ClientDetailProps {
  clientId: string;
}

export function ClientDetail({ clientId }: ClientDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<'profile' | 'meals' | 'workouts'>('profile');

  return (
    <div className="space-y-4">
      {/* Back Button and Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <Icon name={icons.chevronLeft} />
          Quay lại
        </Button>
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => router.push(`/advisor/chat`)}>
            <Icon name={icons.message} className="mr-2" />
            Nhắn tin
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card className="p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-primary text-white shadow-md'
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon name={icons.users} className="mr-2 inline" />
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'meals'
                ? 'bg-primary text-white shadow-md'
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon name="mdi:food-apple-outline" className="mr-2 inline" />
            Lịch ăn uống
          </button>
          <button
            onClick={() => setActiveTab('workouts')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'workouts'
                ? 'bg-primary text-white shadow-md'
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon name="mdi:dumbbell" className="mr-2 inline" />
            Lịch tập luyện
          </button>
        </div>
      </Card>

      {/* Content */}
      <div>
        {activeTab === 'profile' && <ClientProfile clientId={clientId} />}
        {activeTab === 'meals' && <MealSchedule clientId={clientId} />}
        {activeTab === 'workouts' && <WorkoutSchedule clientId={clientId} />}
      </div>
    </div>
  );
}
