'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    router.push('/download');
  };

  const handleLearnMore = () => {
    router.push('/features');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Đạt được mục tiêu fitness với{' '}
            <span className="text-blue-600">FIT - AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Fit AI sử dụng trí tuệ nhân tạo để tạo ra chương trình tập luyện cá nhân hóa, 
            theo dõi tiến độ và đưa ra lời khuyên chuyên nghiệp cho bạn.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="px-8 py-4 text-lg"
            >
              Bắt đầu ngay
            </Button>
            <Button
              onClick={handleLearnMore}
              variant="secondary"
              size="lg"
              className="px-8 py-4 text-lg"
            >
              Tìm hiểu thêm
            </Button>
          </div>

          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email để nhận tin tức"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                onClick={() => {
                  if (email) {
                    // Handle newsletter subscription
                    alert('Cảm ơn bạn đã đăng ký!');
                    setEmail('');
                  }
                }}
                className="px-6 py-3"
              >
                Đăng ký
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Nhận tin tức và cập nhật mới nhất từ Fit AI
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
