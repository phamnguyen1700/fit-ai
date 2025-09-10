'use client';

import React from 'react';
import { HomeStats } from '../api/service';

interface StatsSectionProps {
  stats: HomeStats | null;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const defaultStats: HomeStats = {
    totalUsers: 50000,
    totalWorkouts: 1000000,
    totalCaloriesBurned: 50000000,
    averageRating: 4.8,
  };

  const displayStats = stats || defaultStats;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Được tin tưởng bởi hàng nghìn người dùng
          </h2>
          <p className="text-lg text-gray-600">
            Tham gia cộng đồng fitness lớn nhất Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {formatNumber(displayStats.totalUsers)}
            </div>
            <div className="text-gray-600">Người dùng</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {formatNumber(displayStats.totalWorkouts)}
            </div>
            <div className="text-gray-600">Bài tập</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {formatNumber(displayStats.totalCaloriesBurned)}
            </div>
            <div className="text-gray-600">Calo đốt cháy</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">
              {displayStats.averageRating}⭐
            </div>
            <div className="text-gray-600">Đánh giá</div>
          </div>
        </div>
      </div>
    </section>
  );
};
