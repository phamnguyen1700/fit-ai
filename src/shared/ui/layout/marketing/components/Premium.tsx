import React from 'react';
import { Card } from '@/shared/ui/core/Card';

export interface PlanFeature {
  text: string;
}

export interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  features: PlanFeature[];
  buttonText: string;
  isPopular?: boolean;
  starColor?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({
  name,
  price,
  period,
  features,
  buttonText,
  isPopular = false,
  starColor = '#FF6B35'
}) => {
  return (
    <Card
      className="h-full rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
      styles={{
        body: {
          padding: '32px 24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
        }
      }}
    >
      {/* Orange decorative element at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ background: starColor }}
      />
      
      {/* Plan Header */}
      <div className="flex items-center mb-6">
        <div 
          className="w-6 h-6 rounded flex items-center justify-center mr-3"
          style={{ backgroundColor: starColor }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-800 mb-1">
          {price} <span className="text-lg font-normal text-gray-600">/ {period}</span>
        </div>
      </div>

      {/* Features List */}
      <div className="flex-1 mb-8">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"
                style={{ backgroundColor: starColor }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <span className="text-gray-700 text-sm leading-relaxed">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <button
        className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90"
        style={{ backgroundColor: starColor }}
      >
        {buttonText}
      </button>
    </Card>
  );
};

export interface PremiumProps {
  className?: string;
}

export const Premium: React.FC<PremiumProps> = ({ className = '' }) => {
  const plans: PlanCardProps[] = [
    {
      name: 'Starter Plan',
      price: '99.000đ',
      period: 'tháng',
      features: [
        { text: 'Ứng dụng cơ bản Fit AI' },
        { text: 'Theo dõi cân nặng & calo' },
        { text: 'Kế hoạch tập luyện cơ bản (AI gợi ý)' }
      ],
      buttonText: 'Chọn gói này',
      starColor: '#FF6B35'
    },
    {
      name: 'Premium Plan',
      price: '199.000đ',
      period: 'tháng',
      features: [
        { text: 'Tất cả tính năng Pro' },
        { text: 'Kế hoạch tập luyện nâng cao' },
        { text: 'AI tùy chỉnh theo mục tiêu' },
        { text: 'Thống kê chuyên sâu & biểu đồ' },
        { text: 'Kế hoạch dinh dưỡng chi tiết' },
        { text: 'Ưu tiên cập nhật tính năng mới' }
      ],
      buttonText: 'Chọn gói này',
      isPopular: true,
      starColor: '#FF6B35'
    },
    {
      name: 'Pro Plan',
      price: '399.000đ',
      period: 'tháng',
      features: [
        { text: 'Tất cả tính năng Starter' },
        { text: 'Huấn luyện viên AI cá nhân hóa 1-1' },
        { text: 'Nhắc nhở tập luyện & bữa ăn thông minh' },
        { text: 'Ưu tiên cập nhật tính năng mới' }
      ],
      buttonText: 'Chọn gói này',
      starColor: '#FF6B35'
    }
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <PlanCard key={index} {...plan} />
        ))}
      </div>
    </div>
  );
};

export default Premium;