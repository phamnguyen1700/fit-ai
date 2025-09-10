'use client';

import React from 'react';
import { Feature } from '../api/service';

interface FeaturesSectionProps {
  features: Feature[];
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  const defaultFeatures: Feature[] = [
    {
      id: '1',
      title: 'AI Tư vấn cá nhân',
      description: 'Trí tuệ nhân tạo phân tích và đưa ra lời khuyên tập luyện phù hợp với từng cá nhân.',
      icon: '🤖',
      benefits: ['Phân tích thể trạng', 'Chương trình cá nhân hóa', 'Theo dõi tiến độ']
    },
    {
      id: '2',
      title: 'Theo dõi thông minh',
      description: 'Ghi nhận và phân tích mọi hoạt động tập luyện của bạn một cách chính xác.',
      icon: '📊',
      benefits: ['Ghi nhận bài tập', 'Phân tích hiệu quả', 'Báo cáo chi tiết']
    },
    {
      id: '3',
      title: 'Cộng đồng động viên',
      description: 'Kết nối với bạn bè và chia sẻ thành tích để cùng nhau tiến bộ.',
      icon: '👥',
      benefits: ['Chia sẻ thành tích', 'Thách thức bạn bè', 'Động viên lẫn nhau']
    },
    {
      id: '4',
      title: 'Chế độ dinh dưỡng',
      description: 'Tư vấn chế độ ăn uống khoa học để đạt được mục tiêu fitness.',
      icon: '🥗',
      benefits: ['Thực đơn cá nhân', 'Tính toán calo', 'Lời khuyên dinh dưỡng']
    }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những tính năng độc đáo giúp bạn đạt được mục tiêu fitness một cách hiệu quả nhất
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayFeatures.map((feature) => (
            <div key={feature.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-500">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
