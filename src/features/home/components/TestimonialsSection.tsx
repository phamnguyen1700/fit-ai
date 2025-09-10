'use client';

import React from 'react';
import { Testimonial } from '../api/service';
import { useHomeUiStore } from '../store/homeUi.store';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const { currentTestimonialIndex, nextTestimonial, prevTestimonial } = useHomeUiStore();

  const defaultTestimonials: Testimonial[] = [
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

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;
  const currentTestimonial = displayTestimonials[currentTestimonialIndex % displayTestimonials.length];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Người dùng nói gì về Fit AI
          </h2>
          <p className="text-lg text-gray-600">
            Hàng nghìn người dùng đã tin tưởng và đạt được mục tiêu fitness với Fit AI
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <div className="mb-6">
              {renderStars(currentTestimonial.rating)}
            </div>
            <blockquote className="text-xl text-gray-700 mb-6 italic">
              "{currentTestimonial.content}"
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                {currentTestimonial.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">{currentTestimonial.name}</div>
                <div className="text-gray-600">{currentTestimonial.role}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            {displayTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => useHomeUiStore.getState().setCurrentTestimonialIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentTestimonialIndex % displayTestimonials.length
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
