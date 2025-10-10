'use client';
import React from "react";
import { Card } from "@/shared/ui/core/Card";
import Download from "@/shared/ui/layout/marketing/components/Download";
import FeedbackCard from "@/shared/ui/common/FeedbackCard";
import Tabs3 from "@/shared/ui/core/Tabs3";
import Premium from "@/shared/ui/layout/marketing/components/Premium";
import Question from "@/shared/ui/layout/marketing/components/Question";
import Footer from "@/shared/ui/layout/marketing/components/Footer";

// TypeScript interfaces
interface StatItemProps {
  value: string;
  label: string;
}

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  bgColor: string;
}

interface SectionProps {
  bgClass: string;
  children: React.ReactNode;
}

// Component Stat
const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <div className="text-center md:text-left">
    <div className="text-5xl font-bold text-white mb-3">{value}</div>
    <div className="text-white text-sm font-medium leading-tight">{label}</div>
  </div>
);

// Component Feature Card
const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  title,
  description,
  bgColor,
}) => (
  <Card
    className="h-full rounded-3xl border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
    styles={{ body: {
      padding: "40px 32px",
      background: bgColor,
      textAlign: "center",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    } }}
  >
    <img src={image} alt={title} className="w-32 h-32 mx-auto mb-6" />
    <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "Phudu, sans-serif" }}>
      {title}
    </h3>
    <p className="text-gray-600 text-center leading-relaxed">{description}</p>
  </Card>
);

// Section Wrapper Component
const Section: React.FC<SectionProps> = ({ bgClass, children }) => (
  <div className={`w-full flex justify-center py-16 ${bgClass}`}>
    <div className="w-full max-w-7xl px-4">{children}</div>
  </div>
);

// Section Title Component
const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "Phudu, sans-serif" }}>
      {title}
    </h2>
    {subtitle && <p className="text-gray-600 text-lg max-w-4xl mx-auto">{subtitle}</p>}
  </div>
);

// CheckmarkItem Component
const CheckmarkItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center">
    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    </div>
    <span className="text-gray-700 text-base">{text}</span>
  </div>
);

// Feature Display Component
const FeatureDisplay: React.FC<{ image: string; title: string; alt: string }> = ({ image, title, alt }) => (
  <div className="flex flex-col items-center">
    <div className="relative mb-6">
      <img src={image} alt={alt} className="w-64 h-auto max-w-full rounded-3xl shadow-lg" />
    </div>
    <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: "Phudu, sans-serif" }}>
      {title}
    </h3>
  </div>
);

export default function MarketingHomePage() {
  const stats = [
    { value: "1K+", label: "NGƯỜI DÙNG HOẠT ĐỘNG MỖI NGÀY" },
    { value: "95%", label: "TỶ LỆ DUY TRÌ THÓI QUEN SAU 3 THÁNG" },
    { value: "4.5M", label: "BỮA ĂN & BÀI TẬP ĐÃ ĐƯỢC UP" },
  ];

  const features = [
    {
      image: "/img/Group65.png",
      title: "AI THÔNG MINH",
      description:
        "SỬ DỤNG TRÍ TUỆ NHÂN TẠO ĐỂ PHÂN TÍCH VÀ ĐƯA RA LỜI KHUYÊN TẬP LUYỆN PHÙ HỢP NHẤT VỚI BẠN",
      bgColor: "#E3F2FD",
    },
    {
      image: "/img/Group66.png",
      title: "THEO DÕI CHÍNH XÁC",
      description:
        "GHI NHẬN VÀ PHÂN TÍCH MỌI HOẠT ĐỘNG TẬP LUYỆN VỚI ĐỘ CHÍNH XÁC CAO.",
      bgColor: "#E8F5E8",
    },
    {
      image: "/img/Group67.png",
      title: "CỘNG ĐỒNG TÍCH CỰC",
      description:
        "THAM GIA CỘNG ĐỒNG FITNESS LỚN NHẤT VIỆT NAM VÀ CÙNG NHAU TIẾN BỘ.",
      bgColor: "#F3E5F5",
    },
    {
      image: "/img/Group68.png",
      title: "ĐA NỀN TẢNG",
      description: "SỬ DỤNG TRÊN MỌI THIẾT BỊ VỚI ĐỒNG BỘ DỮ LIỆU TỰ ĐỘNG.",
      bgColor: "#FFF3E0",
    },
  ];

  const appFeatures = [
    { image: "/img/feature1.png", title: "AI COACH THÔNG MINH", alt: "AI Coach Feature" },
    { image: "/img/feature2.png", title: "THEO DÕI TIẾN ĐỘ", alt: "Progress Tracking Feature" },
    { image: "/img/feature3.png", title: "THÁCH THỨC HẰNG NGÀY", alt: "Daily Challenge Feature" },
  ];

  const feedbacks = [
    { name: "Annette Black", rating: 4, content: "App rất dễ dùng, nhắc lịch siêu tiện lợi" },
    { name: "Annette Black", rating: 5, content: "Fit AI giúp tôi giảm 5kg trong 2 tháng" },
    { name: "Annette Black", rating: 5, content: "Trainer AI phân tích chuẩn, tôi tập hiệu quả" },
    { name: "Annette Black", rating: 5, content: "Fit AI giúp tôi giảm 5kg trong 2 tháng" },
    { name: "Annette Black", rating: 5, content: "Trainer AI phân tích chuẩn, tôi tập hiệu quả" },
    { name: "Annette Black", rating: 5, content: "Fit AI giúp tôi giảm 5kg trong 2 tháng" },
  ];

  const faqItems = [
    {
      id: '1',
      question: 'AI trong Fit AI hoạt động thế nào?',
      answer: 'Bạn có thể dùng gói Starter miễn phí với tính năng cơ bản, nâng cấp khi cần thêm tính năng nâng cao.'
    },
    {
      id: '2',
      question: 'Tôi có thể hủy gói bất kỳ lúc nào không?',
      answer: 'Có, bạn có thể hủy gói bất kỳ lúc nào từ trang cài đặt tài khoản của mình. Việc hủy sẽ có hiệu lực ngay lập tức và bạn vẫn có thể sử dụng các tính năng premium cho đến hết chu kỳ thanh toán hiện tại.'
    },
    {
      id: '3',
      question: 'Tôi có thể dùng trên nhiều thiết bị không?',
      answer: 'Có, bạn có thể sử dụng tài khoản Fit AI trên nhiều thiết bị khác nhau. Dữ liệu của bạn sẽ được đồng bộ hóa tự động giữa các thiết bị để đảm bảo trải nghiệm liền mạch.'
    }
  ];

  return (
    <div className="w-full bg-[var(--primay-extralight)]">
      {/* Banner */}
      <div className="w-full relative" style={{ background: "var(--primay-extralight)" }}>
        <img src="/img/homeBanner.png" alt="FIT AI Banner" className="w-full h-auto object-cover" />
      </div>

      {/* Stats Section */}
      <div className="w-full flex justify-center py-12">
        <div className="w-full max-w-7xl px-4">
          <Card
            className="w-full rounded-2xl border-0 shadow-lg"
            styles={{ body: {
              padding: "48px 40px",
              height: "170px",
              background: "#2a2a2a",
              borderRadius: "10px",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
            } }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center relative z-10">
              {stats.map((stat, idx) => (
                <StatItem key={idx} {...stat} />
              ))}
              <div className="text-white text-sm leading-relaxed relative">
                <div className="font-medium">
                  CHÚNG TÔI KẾT NỐI BẠN VỚI AI COACH & TRAINER PHÙ HỢP, ĐẢM BẢO LỘ TRÌNH THEO SÁT MỤC TIÊU, NHU CẦU VÀ THÓI QUEN CỦA BẠN.
                </div>
              </div>
            </div>
            <img src="/img/Leaf.png" alt="Leaf decoration" className="absolute -bottom-10 -right-4" style={{ width: "100px", height: "100px", transform: "rotate(15deg)" }} />
          </Card>
        </div>
      </div>

      {/* Why Choose FIT AI Planning Section */}
      <Section bgClass="bg-gray-50">
        <SectionTitle title="TẠI SAO NÊN CHỌN FIT AI PLANNING?" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </Section>

      {/* Download App Section */}
      <Section bgClass="bg-white">
        <SectionTitle
          title="TẢI XUỐNG APP"
          subtitle="TRẢI NGHIỆM SỨC MẠNH CỦA AI TRONG FITNESS TRÊN MỌI THIẾT BỊ CỦA BẠN"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center lg:justify-start">
            <img src="/img/WelcomeScreens1.png" alt="FIT AI Planning App" className="w-96 h-auto max-w-full" />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "Phudu, sans-serif" }}>
              FIT AI PLANNING – LUÔN BÊN BẠN
            </h3>
            <p className="text-gray-600 text-base mb-6">
              TẢI NGAY FIT AI PLANNING ĐỂ BẮT ĐẦU HÀNH TRÌNH KHỎE MẠNH
            </p>
            <div className="space-y-3 mb-8">
              <CheckmarkItem text="Có mặt trên iOS & Android" />
              <CheckmarkItem text="Miễn phí cài đặt, dùng thử dễ dàng" />
            </div>
            <Download />
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <div className="w-full flex justify-center py-16" style={{ background: 'linear-gradient(135deg, #FFEEEE 0%, #FFEBD3 100%)' }}>
        <div className="w-full max-w-7xl px-4">
          <SectionTitle
            title="TÍNH NĂNG"
            subtitle="VỚI CÁC TÍNH NĂNG VƯỢT TRỘI CỦA AI, NGƯỜI DÙNG SẼ ĐƯỢC SỬ DỤNG CÁC CHỨC NĂNG NHƯ THEO DÕI CÂN NẶNG, LỊCH TẬP TỪ ĐÔNG THỨC ĐƠN ĐỊNH DƯỠNG, ĐÀO TẠO TIẾN ĐỘ."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {appFeatures.map((feature, idx) => (
              <FeatureDisplay key={idx} {...feature} />
            ))}
          </div>
        </div>
      </div>

      {/* User Feedback Section */}
      <Section bgClass="bg-gray-50">
        <SectionTitle title="PHẢN HỒI CỦA NGƯỜI DÙNG" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbacks.map((feedback, idx) => (
            <FeedbackCard
              key={idx}
              name={feedback.name}
              role=""
              avatarUrl="/img/avatar1.jpg"
              rating={feedback.rating}
              content={feedback.content}
            />
          ))}
        </div>
      </Section>

      {/* Package Section */}
      <div className="w-full flex justify-center pt-12 pb-0">
        <div className="w-full max-w-7xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-6" style={{ fontFamily: "Phudu, sans-serif" }}>
              GÓI PHÙ HỢP VỚI MỌI NHU CẦU
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto mb-6">
              CHỌN GÓI TẬP LUYỆN & DINH DƯỠNG PHÙ HỢP NHẤT CHO BẠN. TẬP TRUNG VÀO KẾT QUẢ VÀ SỰ TIẾN BỘ CỦA BẠN.
            </p>
            <Tabs3
              items={[
                { key: 'monthly', label: 'Hàng tháng' },
                { key: 'yearly', label: 'Hàng năm', discount: '-20%' }
              ]}
              defaultActiveKey="yearly"
              className="mb-8"
            />
          </div>
          <Premium />
        </div>
      </div>

      {/* FAQ Section */}
      <Section bgClass="bg-white">
        <div className="w-full max-w-4xl mx-auto">
          <SectionTitle title="CÂU HỎI THƯỜNG GẶP" />
          <Question items={faqItems} />
        </div>
      </Section>

      {/* Footer */}
      <Footer />
    </div>
  );
}