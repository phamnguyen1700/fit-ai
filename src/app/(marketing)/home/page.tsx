// # Trang chủ giới thiệu (/)
// Sử dụng đường dẫn tuyệt đối từ thư mục public cho ảnh banner
import { Card } from '@/shared/ui/core/Card';

export default function MarketingHomePage() {
  return (
    <div className="w-full bg-[var(--primay-extralight)]">
      {/* Banner full width */}
      <div className="w-full" style={{ background: 'var(--primay-extralight)' }}>
        <img
          src="/img/homeBanner.png"
          alt="FIT AI Banner"
          className="w-full object-cover"
          style={{ minHeight: 400, maxHeight: 520, width: '100%' }}
        />
      </div>

      {/* Stats Section */}
      <div className="w-full flex justify-center py-12">
        <div className="w-full max-w-7xl px-4">
          <Card
            className="w-full rounded-2xl border-0 shadow-lg"
            bodyStyle={{
              padding: '48px 40px',
              height: '170px', // <-- Tăng chiều cao lên giá trị bạn muốn
              background: '#2a2a2a',
              borderRadius: '10px',
              position: 'relative',
              overflow: 'hidden',
              // Thêm 2 dòng dưới đây
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center relative z-10">
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-white mb-3">1K+</div>
                <div className="text-white text-sm font-medium leading-tight">
                  NGƯỜI DÙNG HOẠT ĐỘNG MỖI NGÀY
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-white mb-3">95%</div>
                <div className="text-white text-sm font-medium leading-tight">
                  TỶ LỆ DUY TRÌ THÓI QUEN SAU 3 THÁNG
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-white mb-3">4.5M</div>
                <div className="text-white text-sm font-medium leading-tight">
                  BỮA ĂN & BÀI TẬP ĐÃ ĐƯỢC UP
                </div>
              </div>

              <div className="text-white text-sm leading-relaxed relative">
                <div className="font-medium">
                  CHÚNG TÔI KẾT NỐI BẠN VỚI AI COACH & TRAINER PHÙ HỢP, ĐẢM BẢO LỘ TRÌNH THEO SÁT MỤC TIÊU, NHU CẦU VÀ THÓI QUEN CỦA BẠN.
                </div>
              </div>
            </div>

            {/* Orange leaf decoration */}
            <img
              src="/img/Leaf.png"
              alt="Leaf decoration"
              className="absolute -bottom-10 -right-4"
              style={{
                width: '100px',
                height: '100px',
                transform: 'rotate(15deg)'
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
