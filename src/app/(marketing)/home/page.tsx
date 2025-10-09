import React from "react";
import { Card } from "@/shared/ui/core/Card";
import Download from "@/shared/ui/layout/marketing/components/Dowload";
import FeedbackCard from "@/shared/ui/common/FeedbackCard";

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
    bodyStyle={{
      padding: "40px 32px",
      background: bgColor,
      textAlign: "center",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <img src={image} alt={title} className="w-32 h-32 mx-auto mb-6" />
    <h3
      className="text-2xl font-bold text-gray-800 mb-4"
      style={{ fontFamily: "Phudu, sans-serif" }}
    >
      {title}
    </h3>
    <p className="text-gray-600 text-center leading-relaxed">{description}</p>
  </Card>
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

  return (
    <div className="w-full bg-[var(--primay-extralight)]">
      {/* Banner */}
      <div
        className="w-full relative"
        style={{ background: "var(--primay-extralight)" }}
      >
        <img
          src="/img/homeBanner.png"
          alt="FIT AI Banner"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Stats Section */}
      <div className="w-full flex justify-center py-12">
        <div className="w-full max-w-7xl px-4">
          <Card
            className="w-full rounded-2xl border-0 shadow-lg"
            bodyStyle={{
              padding: "48px 40px",
              height: "170px",
              background: "#2a2a2a",
              borderRadius: "10px",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center relative z-10">
              {stats.map((stat, idx) => (
                <StatItem key={idx} value={stat.value} label={stat.label} />
              ))}

              <div className="text-white text-sm leading-relaxed relative">
                <div className="font-medium">
                  CHÚNG TÔI KẾT NỐI BẠN VỚI AI COACH & TRAINER PHÙ HỢP, ĐẢM BẢO
                  LỘ TRÌNH THEO SÁT MỤC TIÊU, NHU CẦU VÀ THÓI QUEN CỦA BẠN.
                </div>
              </div>
            </div>

            {/* Orange leaf decoration */}
            <img
              src="/img/Leaf.png"
              alt="Leaf decoration"
              className="absolute -bottom-10 -right-4"
              style={{
                width: "100px",
                height: "100px",
                transform: "rotate(15deg)",
              }}
            />
          </Card>
        </div>
      </div>

      {/* Why Choose FIT AI Planning Section */}
      <div className="w-full flex justify-center py-16 bg-gray-50">
        <div className="w-full max-w-7xl px-4">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-semibold text-gray-800 mb-4"
              style={{ fontFamily: "Phudu, sans-serif" }}
            >
              TẠI SAO NÊN CHỌN FIT AI PLANNING?
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </div>
      </div>
{/* Download App Section */}
      <div className="w-full flex justify-center py-16 bg-white">
        <div className="w-full max-w-7xl px-4">
          {/* Section Header - Top */}
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Phudu, sans-serif" }}
            >
              TẢI XUỐNG APP
            </h2>
            <p className="text-gray-600 text-lg">
              TRẢI NGHIỆM SỨC MẠNH CỦA AI TRONG FITNESS TRÊN MỌI THIẾT BỊ CỦA BẠN
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Left Column - Phone Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <img
                  src="/img/WelcomeScreens1.png"
                  alt="FIT AI Planning App"
                  className="w-96 h-auto max-w-full"
                />
              </div>
            </div>

            {/* Right Column - Download Content */}
            <div className="flex flex-col justify-center">
              {/* App Benefits */}
              <div className="mb-8">
                <h3
                  className="text-3xl font-bold text-gray-800 mb-4"
                  style={{ fontFamily: "Phudu, sans-serif" }}
                >
                  FIT AI PLANNING – LUÔN BÊN BẠN
                </h3>
                <p className="text-gray-600 text-base mb-6">
                  TẢI NGAY FIT AI PLANNING ĐỂ BẮT ĐẦU HÀNH TRÌNH KHỎE MẠNH
                </p>
            
                <div className="space-y-3 mb-8">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-base">
                      Có mặt trên iOS & Android
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-base">
                      Miễn phí cài đặt, dùng thử dễ dàng
                    </span>
                  </div>
                </div>
              </div>

              {/* Download Component */}
                <Download />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full flex justify-center py-16" style={{ background: 'linear-gradient(135deg, #FFEEEE 0%, #FFEBD3 100%)' }}>
        <div className="w-full max-w-7xl px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Phudu, sans-serif" }}
            >
              TÍNH NĂNG
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              VỚI CÁC TÍNH NĂNG VƯỢT TRỘI CỦA AI, NGƯỜI DÙNG SẼ ĐƯỢC SỬ DỤNG CÁC CHỨC NĂNG NHƯ
              THEO DÕI CÂN NẶNG, LỊCH TẬP TỪ ĐÔNG THỨC ĐƠN ĐỊNH DƯỠNG, ĐÀO TẠO TIẾN ĐỘ.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - AI Coach */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <img
                  src="/img/feature1.png"
                  alt="AI Coach Feature"
                  className="w-64 h-auto max-w-full rounded-3xl shadow-lg"
                />
              </div>
              <div className="text-center">
                <h3
                  className="text-xl font-bold text-gray-800 mb-3"
                  style={{ fontFamily: "Phudu, sans-serif" }}
                >
                  AI COACH THÔNG MINH
                </h3>
              </div>
            </div>

            {/* Feature 2 - Progress Tracking */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <img
                  src="/img/feature2.png"
                  alt="Progress Tracking Feature"
                  className="w-64 h-auto max-w-full rounded-3xl shadow-lg"
                />
              </div>
              <div className="text-center">
                <h3
                  className="text-xl font-bold text-gray-800 mb-3"
                  style={{ fontFamily: "Phudu, sans-serif" }}
                >
                  THEO DÕI TIẾN ĐỘ
                </h3>
              </div>
            </div>

            {/* Feature 3 - Daily Challenge */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <img
                  src="/img/feature3.png"
                  alt="Daily Challenge Feature"
                  className="w-64 h-auto max-w-full rounded-3xl shadow-lg"
                />
              </div>
              <div className="text-center">
                <h3
                  className="text-xl font-bold text-gray-800 mb-3"
                  style={{ fontFamily: "Phudu, sans-serif" }}
                >
                  THÁCH THỨC HẰNG NGÀY
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Feedback Section */}
      <div className="w-full flex justify-center py-16 bg-gray-50">
        <div className="w-full max-w-7xl px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Phudu, sans-serif" }}
            >
              PHẢN HỒI CỦA NGƯỜI DÙNG
            </h2>
          </div>

          {/* Feedback Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeedbackCard
              name="Annette Black"
              role=""
              avatarUrl="/img/avatar1.jpg"
              rating={4}
              content="App rất dễ dùng, nhắc lịch siêu tiện lợi"
            />
            <FeedbackCard
              name="Annette Black"
              role=""
              avatarUrl="/img/avatar1.jpg"
              rating={5}
              content="Fit AI giúp tôi giảm 5kg trong 2 tháng"
            />
            <FeedbackCard
              name="Annette Black"
              role=""
              avatarUrl="/img/avatar1.jpg"
              rating={5}
              content="Trainer AI phân tích chuẩn, tôi tập hiệu quả"
            />
            <FeedbackCard
              name="Annette Black"
              role=""
              avatarUrl="/img/avatar1.jpg"
              rating={5}
              content="Fit AI giúp tôi giảm 5kg trong 2 tháng"
            />
            <FeedbackCard
              name="Annette Black"
              role=""
              avatarUrl="/img/avatar1.jpg"
              rating={5}
              content="Trainer AI phân tích chuẩn, tôi tập hiệu quả"
            />
            <FeedbackCard
              name="Annette Black"
              role=""
              avatarUrl="/img/avatar1.jpg"
              rating={5}
              content="Fit AI giúp tôi giảm 5kg trong 2 tháng"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
