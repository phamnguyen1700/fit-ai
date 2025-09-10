'use client';

import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { StatsSection } from '../components/StatsSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { TestimonialsSection } from '../components/TestimonialsSection';

// Fake data
const fakeStats = {
  totalUsers: 50000,
  totalWorkouts: 1000000,
  totalCaloriesBurned: 50000000,
  averageRating: 4.8,
};

const fakeFeatures = [
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

const fakeTestimonials = [
  {
    id: '1',
    name: 'Nguyễn Minh Anh',
    role: 'Nhân viên văn phòng',
    content: 'Fit AI đã giúp tôi giảm 15kg trong 3 tháng. Chương trình tập luyện cá nhân hóa thực sự hiệu quả!',
    rating: 5
  },
  {
    id: '2',
    name: 'Trần Văn Nam',
    role: 'Sinh viên',
    content: 'Ứng dụng rất dễ sử dụng và có nhiều tính năng hay. AI tư vấn rất chính xác và hữu ích.',
    rating: 5
  },
  {
    id: '3',
    name: 'Lê Thị Hoa',
    role: 'Giáo viên',
    content: 'Tôi đã thử nhiều app fitness nhưng Fit AI là tốt nhất. Cộng đồng rất tích cực và động viên.',
    rating: 5
  }
];

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection stats={fakeStats} />
      <FeaturesSection features={fakeFeatures} />
      <TestimonialsSection testimonials={fakeTestimonials} />
      
      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu hành trình fitness của bạn?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Tải xuống Fit AI ngay hôm nay và trải nghiệm sức mạnh của AI trong fitness
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Tải cho iOS
            </button>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Tải cho Android
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
